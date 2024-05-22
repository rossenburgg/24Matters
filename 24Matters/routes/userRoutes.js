const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction'); // Import the Transaction model
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

// GET route for fetching the user's transaction history
router.get('/api/user/transactions', isAuthenticated, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.session.userId }).sort({ date: -1 });
    console.log(`Retrieving transactions for user: ${req.session.userId}`);
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error fetching transactions', error: error });
  }
});

// PUT route for updating user settings
router.put('/api/user/settings', isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.session;
    const { dashboardWidgets, theme } = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, {
      $set: {
        dashboardWidgets: dashboardWidgets,
        theme: theme
      }
    }, { new: true }).select('-password');

    if (!updatedUser) {
      console.log('User not found during settings update');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`User settings updated for user: ${updatedUser.username}`);
    res.status(200).json({
      message: 'User settings updated successfully',
      settings: {
        dashboardWidgets: updatedUser.dashboardWidgets,
        theme: updatedUser.theme
      }
    });
  } catch (error) {
    console.error('Error updating user settings:', error);
    res.status(500).json({ message: 'Error updating user settings', error: error });
  }
});

// GET route for the settings page
router.get('/settings', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      console.log('User not found for settings page');
      return res.status(404).send('User not found');
    }
    console.log(`Rendering settings page for user: ${user.username}`);
    res.render('settings', { user: user });
  } catch (error) {
    console.error('Error rendering settings page:', error);
    res.status(500).send('Error rendering settings page');
  }
});

module.exports = router;