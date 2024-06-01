const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

// Fetch chat conversations for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const chats = await Chat.find({
      participants: { $in: [userId] }
    }).populate('lastMessage').populate('participants', 'email');

    const chatDetails = chats.map(chat => ({
      id: chat._id,
      participants: chat.participants,
      lastMessage: chat.lastMessage ? {
        text: chat.lastMessage.text,
        createdAt: chat.lastMessage.createdAt,
        sender: chat.lastMessage.sender
      } : null
    }));

    res.json(chatDetails);
  } catch (error) {
    console.error('Error fetching chat conversations:', error.message, error.stack);
    res.status(500).json({ message: 'Error fetching chat conversations' });
  }
});

// Create a new chat conversation
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { participantIds } = req.body;
    const userId = req.user.id;

    if (!participantIds.includes(userId)) {
      participantIds.push(userId); // Ensure the creator is included in the chat
    }

    const newChat = new Chat({
      participants: participantIds,
      lastMessage: null
    });

    const savedChat = await newChat.save();

    res.status(201).json(savedChat);
  } catch (error) {
    console.error('Error creating new chat conversation:', error.message, error.stack);
    res.status(500).json({ message: 'Error creating new chat conversation' });
  }
});

// Search for users to add to chat
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const users = await User.find({
      email: { $regex: searchTerm, $options: 'i' }
    }).select('-password');

    res.json(users);
  } catch (error) {
    console.error('Error searching for users:', error.message, error.stack);
    res.status(500).json({ message: 'Error searching for users' });
  }
});

module.exports = router;