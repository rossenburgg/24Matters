const express = require('express');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const authMiddleware = require('../middleware/authMiddleware');
const Message = require('../models/messageModel'); // Assuming you have a message model
const User = require('../models/userModel'); // Assuming you have a user model for fetching followers

const router = express.Router();

// Middleware to authenticate and set user on request
router.use(authMiddleware);

// GET messages for a specific user
router.get('/:userId/messages', asyncHandler(async (req, res) => {
  const { userId } = req.params;

  try {
    // Verify the JWT token and extract user information
    const token = req.headers.authorization.split(' ')[1]; // Assuming bearer token format
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if the requested userId matches the token userId or if the user is admin
    if (decoded.id !== userId && !decoded.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).populate('sender', 'username').populate('receiver', 'username'); // Assuming sender and receiver fields in message model

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ message: 'Error fetching messages', error: error.toString() });
  }
}));

// POST send a message to a specific user
router.post('/:userId/send', asyncHandler(async (req, res) => {
  const { receiverId, message, attachmentUrls = [] } = req.body; // Defaulting attachmentUrls to an empty array if not provided
  const senderId = req.user.id; // Assuming user id is attached to req.user by authMiddleware

  if (!receiverId) {
    return res.status(400).json({ message: 'Receiver ID is required' });
  }

  try {
    // Create a new message in the database
    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content: message,
      attachmentUrls: attachmentUrls,
    });

    res.status(201).json({ message: 'Message sent successfully', data: newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message', error: error.toString() });
  }
}));

module.exports = router;