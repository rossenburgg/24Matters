const express = require('express');
const router = express.Router();
const isAuthenticated = require('./middleware/authMiddleware').isAuthenticated;
const User = require('../models/User'); // Importing the User model
const { body, validationResult } = require('express-validator'); // Importing validation library
const rateLimit = require('express-rate-limit'); // Importing rate limiting library

// Rate limiter for deposit route to prevent abuse
const depositLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 deposit requests per windowMs
  message: 'Too many deposit attempts from this IP, please try again after 15 minutes'
});

// Function to update user balance in the database
const updateUserBalance = async (userId, amount) => {
    try {
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            console.log(`User with ID ${userId} not found.`);
            return null;
        }
        // Assuming 'balance' field exists in User model, update the balance
        user.balance = (user.balance || 0) + amount;
        const updatedUser = await user.save();
        console.log(`User ${userId}'s balance updated to ${updatedUser.balance}`);
        return { newBalance: updatedUser.balance };
    } catch (error) {
        console.error('Error updating user balance:', error.message);
        console.error(error.stack);
        throw error; // Rethrowing the error to be handled by the caller
    }
};

router.post('/api/deposit', isAuthenticated, depositLimiter, [
    body('amount').isNumeric().withMessage('Amount must be a number').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userId = req.session.userId;
        const { amount } = req.body;
        console.log(`Attempting to deposit ${amount} for user ${userId}`);
        const updateResult = await updateUserBalance(userId, parseFloat(amount));
        if (!updateResult) {
            console.log(`User not found for ID ${userId}`);
            return res.status(404).json({ error: 'User not found.' });
        }
        console.log(`Deposit successful for user ${userId}, new balance: ${updateResult.newBalance}`);
        res.status(200).json({
            message: 'Deposit successful.',
            updatedBalance: updateResult.newBalance
        });
    } catch (error) {
        console.error('Deposit error:', error.message);
        console.error(error.stack);
        res.status(400).json({ error: 'Failed to process deposit.' });
    }
});

module.exports = router;