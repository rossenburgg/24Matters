const express = require('express');
const router = express.Router();
const isAuthenticated = require('./middleware/authMiddleware').isAuthenticated;
const SupportRequest = require('../models/SupportRequest');

// Route to render the support page
router.get('/support', isAuthenticated, (req, res) => {
  res.render('support');
});

// Route to handle support request submission
router.post('/submit-support', isAuthenticated, async (req, res) => {
  try {
    const { message } = req.body;
    const supportRequest = new SupportRequest({
      userId: req.session.userId,
      message: message,
      createdAt: new Date()
    });
    await supportRequest.save();
    res.status(200).send('Support request submitted successfully');
  } catch (error) {
    console.error(`Error submitting support request: ${error.message}`, error);
    res.status(500).send('Error submitting support request');
  }
});

module.exports = router;