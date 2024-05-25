const { Server } = require("socket.io");
const Notification = require('./models/Notification'); // Importing the Notification model
let io;

const setupSocket = (server) => {
  io = new Server(server);
  io.on('connection', (socket) => {
    console.log('A user connected with socket ID:', socket.id);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });

    socket.on('register', userId => {
      socket.join(userId);
      console.log(`User ${userId} registered with socket ID ${socket.id}`);
    });

    // Emitting notifications and updates
    socket.on('new-notification', async (userId) => {
      try {
        const unreadCount = await Notification.find({ userId: userId, read: false }).count();
        io.to(userId).emit('notification count', unreadCount);
        console.log(`Notification count updated for user ${userId}`);
      } catch (error) {
        console.error('Error fetching unread notifications for user:', userId, error);
        console.error(error.stack);
      }
    });
  });

  console.log('Socket.IO setup completed.');
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { setupSocket, getIo };