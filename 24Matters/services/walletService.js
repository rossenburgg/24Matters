const User = require('../models/User'); // Importing the User model

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

module.exports = { updateUserBalance };