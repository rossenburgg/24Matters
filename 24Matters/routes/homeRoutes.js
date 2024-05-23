const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item'); // Required for fetching items
const { isAuthenticated } = require('./middleware/authMiddleware');

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).exec();
    const items = await Item.find({}).exec(); // Fetching all items from the database
    if (!user) {
      console.log("Redirecting to login, user not found.");
      res.redirect('/login');
    } else {
      console.log(`Displaying home page for user: ${user.username}`);
      res.render('home', {
        username: user.username,
        accountStatus: user.accountStatus,
        balance: user.balance,
        commission: user.commission,
        themePreference: user.themePreference,
        user: user, // Pass the entire user object to the view
        appBaseUrl: process.env.APP_BASE_URL, // Make appBaseUrl available to the view
        items: items // Passing items to the view
      });
    }
  } catch (error) {
    console.error(`Error fetching user and items for home page: ${error.message}`);
    console.error(error.stack);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;