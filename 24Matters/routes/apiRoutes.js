const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// Serve analytics data for the dashboard
router.get('/analytics/data', async (req, res) => {
  try {
    // Assuming req.session.userId is set after successful authentication
    if (!req.session || !req.session.userId) {
      console.log('User not authenticated');
      return res.status(403).json({ message: 'User not authenticated' });
    }

    const tasks = await Task.find({ userId: req.session.userId });
    const labels = tasks.map(task => task.creationDate.toISOString().split('T')[0]);
    const earnings = tasks.map(task => task.amountEarned);

    console.log('Analytics data fetched successfully for user:', req.session.userId);

    res.json({
      labels,
      earnings
    });
  } catch (err) {
    console.error('Error fetching analytics data:', err.message);
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;