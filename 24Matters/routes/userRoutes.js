const express = require('express');
const User = require('../models/User');
const { isAuthenticated } = require('./middleware/authMiddleware');

const router = express.Router();

// GET route for fetching the logged-in user's profile
router.get('/api/user/profile', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    // Placeholder for account status since it's not implemented yet
    const accountStatus = 'Active'; // Placeholder value
    console.log(`Retrieving profile for user: ${user.username}`);
    res.status(200).json({
      username: user.username,
      accountStatus: accountStatus,
      // Add other user details as needed
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile', error: error });
  }
});

// GET route for fetching the user's wallet balance and commission
router.get('/api/user/wallet', isAuthenticated, async (req, res) => {
  try {
    // Placeholder values for balance and commission
    const balance = "1000"; // Placeholder value for balance in USDT
    const commission = "50"; // Placeholder value for commission in USDT
    console.log(`Retrieving wallet balance and commission for user: ${req.session.userId}`);
    res.status(200).json({
      balance: balance,
      commission: commission
    });
  } catch (error) {
    console.error('Error fetching wallet balance and commission:', error);
    res.status(500).json({ message: 'Error fetching wallet balance and commission', error: error });
  }
});

module.exports = router;