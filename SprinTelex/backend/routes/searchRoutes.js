const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Adjust the path as necessary to match the location of your userModel.js

// Search users endpoint with pagination
router.get('/search', async (req, res) => {
  const { q: query, page = 1, limit = 10 } = req.query;
  
  if (!query) {
    return res.status(400).json({ message: 'Query parameter q is required.' });
  }

  try {
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } }
      ]
    }, '_id username name bio profileImage')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

    const count = await User.countDocuments({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } }
      ]
    });

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    console.error("Failed to search users:", error);
    res.status(500).json({ message: 'Error fetching user profiles', error: error.toString() });
  }
});

module.exports = router;