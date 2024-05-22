const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');
const { isAuthenticated } = require('./middleware/authMiddleware');

router.post('/api/support', isAuthenticated, async (req, res) => {
  try {
    const { issue } = req.body;
    if (!issue) {
      return res.status(400).json({ message: 'Issue detail is required.' });
    }
    const supportTicket = await SupportTicket.create({
      userId: req.session.userId,
      issue,
    });
    console.log(`Support ticket created successfully for user ID: ${req.session.userId}`);
    res.status(201).json({ message: 'Support ticket submitted successfully.', ticketId: supportTicket._id });
  } catch (error) {
    console.error(`Support ticket creation error: ${error.message}`, error);
    res.status(500).json({ message: 'Internal server error while creating support ticket.' });
  }
});

module.exports = router;