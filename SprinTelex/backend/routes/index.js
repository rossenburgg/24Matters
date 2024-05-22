const express = require('express');
const router = express.Router();
const followRoutes = require('./followRoutes');
const userRoutes = require('./userRoutes'); // Assuming userRoutes exists and handles user-related endpoints
const authMiddleware = require('../middleware/authMiddleware'); // Import authMiddleware

// Apply authentication middleware to follow routes
router.use('/follow', authMiddleware, followRoutes);

// Add user routes to handle user profile and follow status checks
router.use('/users', userRoutes);

module.exports = router;