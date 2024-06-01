const express = require('express');
const User = require('../models/User');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

router.get('/search', authenticateToken, async (req, res) => {
  const searchQuery = req.query.q;
  if (!searchQuery) {
    console.log('Search query is missing');
    return res.status(400).json({ success: false, error: 'A search query is required' });
  }

  try {
    console.log(`Attempting to search for friends with query: ${searchQuery}`);
    const users = await User.find({
      username: { $regex: searchQuery, $options: 'i' }, // Case-insensitive search
    }, 'username -_id'); // Select only the username field and exclude the _id field

    console.log(`Found ${users.length} users matching "${searchQuery}" query.`);
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error during friend search:', error);
    res.status(500).json({ success: false, error: 'Failed to search for friends due to an internal error.', details: error.message });
  }
});

module.exports = router;