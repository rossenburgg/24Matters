const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Ensure this import path is correct
const Follow = require('../models/followModel');
const asyncHandler = require('express-async-handler');
const authMiddleware = require('../middleware/authMiddleware');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Fetch followers list for a user with pagination
router.get('/:userId/followers', authMiddleware, asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID format' });
  }

  try {
    // Ensure the user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      console.error(`User not found for ID: ${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch followers
    const followers = await Follow.find({ following: userId })
      .populate('follower', 'username profilePictureUrl')
      .skip(skip)
      .limit(limit)
      .exec();

    // Count total followers for pagination
    const totalFollowers = await Follow.countDocuments({ following: userId });

    console.log('Fetched followers:', followers); // Log fetched data for debugging

    res.json({
      followers,
      totalPages: Math.ceil(totalFollowers / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({ message: 'Error fetching followers', error: error.toString() });
  }
}));

// Fetch following list for a user with pagination
router.get('/:userId/following', authMiddleware, asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID format' });
  }

  try {
    // Ensure the user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      console.error(`User not found for ID: ${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch following
    const following = await Follow.find({ follower: userId })
      .populate('following', 'username profilePictureUrl')
      .skip(skip)
      .limit(limit)
      .exec();

    // Count total following for pagination
    const totalFollowing = await Follow.countDocuments({ follower: userId });

    console.log('Fetched following:', following); // Log fetched data for debugging

    res.json({
      following: following.map(follow => follow.following),
      totalPages: Math.ceil(totalFollowing / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching following:', error);
    res.status(500).json({ message: 'Error fetching following', error: error.toString() });
  }
}));

// Unfollow a user
router.delete('/:userId/unfollow', authMiddleware, asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const followerId = req.user._id;

  try {
    const unfollowResult = await Follow.findOneAndDelete({ follower: followerId, following: userId });
    if (!unfollowResult) {
      return res.status(404).json({ message: 'Follow relationship not found' });
    }
    console.log(`User ${followerId} unfollowed ${userId}`);
    res.status(200).json({ message: `Successfully unfollowed user ${userId}` });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ message: 'Error unfollowing user', error: error.toString() });
  }
}));

// Remove a follower
router.delete('/:userId/removeFollower', authMiddleware, asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const followingId = req.user._id;

  try {
    const removeFollowerResult = await Follow.findOneAndDelete({ follower: userId, following: followingId });
    if (!removeFollowerResult) {
      return res.status(404).json({ message: 'Follow relationship not found' });
    }
    console.log(`User ${userId} removed from followers of ${followingId}`);
    res.status(200).json({ message: `Successfully removed follower ${userId}` });
  } catch (error) {
    console.error('Error removing follower:', error);
    res.status(500).json({ message: 'Error removing follower', error: error.toString() });
  }
}));

module.exports = router;