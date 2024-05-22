const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isAuthenticated } = require('./middleware/authMiddleware');

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).exec();
    if (!user) {
      console.log("Redirecting to login, user not found.");
      res.redirect('/login');
    } else {
      console.log(`Displaying home page for user: ${user.username}`);
      res.render('home', {
        username: user.username,
        accountStatus: user.accountStatus
      });
    }
  } catch (error) {
    console.error(`Error fetching user: ${error.message}`);
    console.error(error.stack);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;