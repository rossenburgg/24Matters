const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticateToken = require('../middleware/authenticateToken');

// Search for users by username
router.get('/search', authenticateToken, (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm) {
    return res.status(400).json({ message: 'Search term is required' });
  }

  User.find({ username: { $regex: searchTerm, $options: 'i' } })
    .select('-password') // Exclude password from the results
    .then(users => {
      console.log(`Found ${users.length} users matching "${searchTerm}"`);
      res.json(users);
    })
    .catch(err => {
      console.error('Error searching for users:', err.message, err.stack);
      res.status(500).json({ message: 'Error searching for users', error: err.message });
    });
});

module.exports = router;