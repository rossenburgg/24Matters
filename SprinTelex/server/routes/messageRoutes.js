const express = require('express');
const mongoose = require('mongoose'); // Import mongoose to use ObjectId
const Message = require('../models/Message');
const authenticateToken = require('../middleware/authenticateToken');
const sendPushNotification = require('../services/pushNotificationService'); // Import the push notification service

const router = express.Router();

// Send a message
router.post('/send', authenticateToken, async (req, res) => {
  const { conversationId, text, recipientExpoPushToken } = req.body; // Assume recipientExpoPushToken is passed in the request
  const sender = req.user.userId; // Assuming the authenticateToken middleware adds the userId to req.user

  // Validate conversationId format
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    console.error('Invalid conversationId format:', conversationId);
    return res.status(400).json({ error: 'Invalid conversationId format' });
  }

  try {
    const message = await Message.create({
      conversationId: mongoose.Types.ObjectId(conversationId),
      sender,
      text
    });
    console.log('Message sent:', message);

    // Send a push notification to the recipient
    if (recipientExpoPushToken) {
      await sendPushNotification(recipientExpoPushToken, text).catch(error => {
        console.error('Error sending push notification:', error);
        // Not failing the request because the main action (message sending) was successful
      });
    }

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(400).json({ error: error.message });
  }
});

// Retrieve messages for a conversation
router.get('/:conversationId', authenticateToken, async (req, res) => {
  const { conversationId } = req.params;

  // Validate conversationId format
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    console.error('Invalid conversationId format:', conversationId);
    return res.status(400).json({ error: 'Invalid conversationId format' });
  }

  try {
    const messages = await Message.find({
      conversationId: mongoose.Types.ObjectId(conversationId)
    }).populate('sender', 'email');
    console.log('Messages retrieved for conversation:', conversationId);
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error retrieving messages for conversation:', error);
    res.status(400).json({ error: error.message });
  }
});

// Error handling for undefined routes within /api/messages
router.use((req, res, next) => {
  const error = new Error("Messaging route not found");
  error.status = 404;
  console.error('Error trace:', error);
  next(error);
});

// General error handler for messaging routes
router.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
  console.error('Unhandled error in messaging routes:', error);
});

module.exports = router;