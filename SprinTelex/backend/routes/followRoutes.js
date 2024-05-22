const express = require('express');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Follow = require('../models/followModel');
const User = require('../models/userModel');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Route to get followers of a user
router.get('/:userId/followers', authMiddleware, async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.error('Invalid userId provided:', userId);
    return res.status(400).json({ message: 'Invalid userId' });
  }

  try {
    const userExists = await User.findById(userId);
    if (!userExists) {
      console.log(`User with ID ${userId} not found.`);
      return res.status(404).json({ message: 'User not found' });
    }

    const followers = await Follow.find({ following: userId }).populate('follower', ['username', 'profilePictureUrl']);
    
    if (followers.length === 0) {
      console.log(`No followers found for user ID ${userId}.`);
      return res.status(404).json({ message: 'No followers found' });
    }
    
    console.log(`Fetched followers for user ID ${userId}.`);
    res.status(200).json(followers);
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
});

// Route to create a follow relationship
router.post('/', authMiddleware, async (req, res) => {
  const { followerId, followingId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(followerId) || !mongoose.Types.ObjectId.isValid(followingId)) {
    console.error('Invalid followerId or followingId provided:', followerId, followingId);
    return res.status(400).json({ message: 'Invalid followerId or followingId' });
  }

  try {
    const followerExists = await User.findById(followerId);
    const followingExists = await User.findById(followingId);

    if (!followerExists || !followingExists) {
      console.log(`Follower or Following user not found.`);
      return res.status(404).json({ message: 'Follower or Following user not found' });
    }

    const followExists = await Follow.findOne({ follower: followerId, following: followingId });
    if (followExists) {
      console.log(`Follow relationship already exists.`);
      return res.status(400).json({ message: 'Follow relationship already exists' });
    }

    const newFollow = new Follow({
      follower: followerId,
      following: followingId,
    });

    await newFollow.save();
    console.log(`New follow relationship created successfully.`);
    res.status(201).json({ message: 'Follow relationship created successfully', follow: newFollow });
  } catch (error) {
    console.error('Error creating follow relationship:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
});

module.exports = router;