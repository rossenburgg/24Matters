const jwt = require('jsonwebtoken');
const Message = require('./models/Message'); // Import the Message model
const User = require('./models/User'); // Import the User model to access the recipient's Expo push token
const { sendPushNotification } = require('./services/pushNotificationService'); // Import the push notification service

module.exports = function (io) {
  io.use((socket, next) => {
    const token = socket.handshake.query.token;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.error('Socket authentication error:', err.message, err.stack);
          return next(new Error('Authentication error'));
        }
        socket.decoded = decoded; // Attach the decoded token to the socket instance
        next();
      });
    } else {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('user disconnected:', socket.id);
    });

    socket.on('new message', (msg) => {
      console.log('Received new message: ', msg);
      // Construct a new message object
      const message = new Message({
        conversationId: msg.conversationId,
        sender: msg.sender,
        text: msg.text,
        createdAt: new Date() // Save the current timestamp
      });

      // Save the message to the database
      message.save().then(async (savedMessage) => {
        console.log('Message saved to database with ID:', savedMessage._id);
        // Transmit the saved message object, including its database ID, to all clients in the same conversation
        io.to(msg.conversationId).emit('receive message', savedMessage); // This ensures the message is sent to all clients in the conversation

        // Fetch the recipient user to get the push token
        const recipientId = msg.recipient; // Assuming msg object contains recipient ID
        const recipient = await User.findById(recipientId);
        if (recipient && recipient.pushToken) {
          const sender = await User.findById(msg.sender);
          const senderName = sender ? sender.username : "Someone";
          // Send a push notification to the recipient
          await sendPushNotification(recipient.pushToken, {
            title: `${senderName} sent you a message`,
            body: msg.text.substring(0, 100), // Preview of the message text
          }).catch(err => {
            console.error('Error sending push notification:', err.message, err.stack);
          });
          console.log('Push notification sent successfully to:', recipient.pushToken);
        } else {
          console.log('Recipient has no push token or could not be found');
        }
      }).catch(err => {
        console.error('Error saving message to database:', err.message, err.stack);
      });

      // Join the conversation room
      socket.join(msg.conversationId);
    });

    socket.on('join conversation', (conversationId) => {
      console.log(`Socket ${socket.id} joining conversation ${conversationId}`);
      socket.join(conversationId);
    });

    socket.on('leave conversation', (conversationId) => {
      console.log(`Socket ${socket.id} leaving conversation ${conversationId}`);
      socket.leave(conversationId);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error.message, error.stack);
    });
  });
};