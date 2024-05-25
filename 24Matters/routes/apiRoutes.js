const express = require('express');
const Task = require('../models/Task');
const Item = require('../models/Item'); // Importing the Item model
const User = require('../models/User');
const Purchase = require('../models/Purchase'); // Importing the Purchase model
const { isAuthenticated } = require('./middleware/authMiddleware');
const { fetchUnreadNotificationsPaginated } = require('../services/notificationService');
const Notification = require('../models/Notification'); // Importing the Notification model
const router = express.Router();

// Serve analytics data for the dashboard
router.get('/analytics/data', async (req, res) => {
  try {
    // Assuming req.session.userId is set after successful authentication
    if (!req.session || !req.session.userId) {
      console.log('User not authenticated');
      return res.status(403).json({ message: 'User not authenticated' });
    }

    const tasks = await Task.find({ userId: req.session.userId }).lean();
    const labels = tasks.map(task => task.creationDate.toISOString().split('T')[0]);
    const earnings = tasks.map(task => task.amountEarned);

    console.log('Analytics data fetched successfully for user:', req.session.userId);

    res.json({
      labels,
      earnings,
      tasks // Include tasks details for the performance metrics table
    });
  } catch (err) {
    console.error('Error fetching analytics data:', err);
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
  }
});

// Fetch item details by ID
router.get('/item/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Item.findById(itemId);
    if (!item) {
      console.log(`Item with ID ${itemId} not found`);
      return res.status(404).json({ message: 'Item not found' });
    }
    console.log(`Item details fetched successfully for item ID: ${itemId}`);
    res.json(item);
  } catch (err) {
    console.error(`Error fetching item details for item ID ${req.params.id}:`, err);
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
  }
});

// Purchase item
router.post('/purchase/:id', isAuthenticated, async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Item.findById(itemId);
    if (!item) {
      console.log(`Item with ID ${itemId} not found`);
      return res.status(404).json({ message: 'Item not found' });
    }

    const user = await User.findById(req.session.userId);
    if (user.balance < item.price) {
      console.log('Insufficient balance for purchase');
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Deduct item price from user's balance
    user.balance -= item.price;

    // Create a new purchase record
    const purchase = new Purchase({
      userId: req.session.userId,
      itemId: itemId,
      status: 'pending'
    });

    // Attempt to save user balance, purchase record atomically
    try {
      await user.save();
      await purchase.save();
      console.log(`Purchase record created for user ${req.session.userId} and item ${itemId}`);
      res.json({ message: 'Purchase successful, awaiting admin confirmation', newBalance: user.balance });
    } catch (err) {
      console.error('Error updating user balance or creating purchase record:', err);
      console.error(err.stack);
      res.status(500).json({ message: 'Error processing purchase' });
    }
  } catch (error) {
    console.error('Error processing purchase:', error);
    console.error(error.stack);
    res.status(500).json({ message: 'Error processing purchase' });
  }
});

// Route for fetching unread notifications with pagination
router.get('/notifications/unread', isAuthenticated, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { notifications, total, pages, currentPage } = await fetchUnreadNotificationsPaginated(req.session.userId, page, limit);

    res.json({
      success: true,
      data: notifications,
      meta: {
        total,
        pages,
        currentPage
      }
    });
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    console.error(error.stack);
    res.status(500).json({ success: false, message: "Failed to fetch unread notifications" });
  }
});

// New route for fetching user-specific notifications with pagination
router.get('/notifications', isAuthenticated, async (req, res) => {
  const userId = req.session.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalNotifications = await Notification.countDocuments({ userId });
    res.status(200).json({
      success: true,
      notifications,
      pageInfo: {
        currentPage: page,
        totalPages: Math.ceil(totalNotifications / limit),
        totalNotifications,
      },
    });
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    console.error(error.stack);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
});

module.exports = router;