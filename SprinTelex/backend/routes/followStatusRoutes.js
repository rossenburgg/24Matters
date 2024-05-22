const express = require('express');
const router = express.Router();
const Follow = require('../models/followModel');
const authMiddleware = require('../middleware/authMiddleware');
const { check, validationResult } = require('express-validator');

// Check if a user is following another user
router.get('/isFollowing/:followerId/:followingId', [
  authMiddleware,
  check('followerId', 'Invalid followerId').isMongoId(),
  check('followingId', 'Invalid followingId').isMongoId()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { followerId, followingId } = req.params;
    const follow = await Follow.findOne({ follower: followerId, following: followingId });
    if (follow) {
      return res.status(200).json({ isFollowing: true });
    } else {
      return res.status(200).json({ isFollowing: false });
    }
  } catch (error) {
    console.error('Error checking follow status:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
});

module.exports = router;