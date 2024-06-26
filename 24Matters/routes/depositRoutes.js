const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('./middleware/authMiddleware');
const User = require('../models/User');

router.get('/deposit', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).exec();
    if (!user) {
      console.log("User not found for deposit page.");
      return res.redirect('/login');
    } else {
      console.log(`Serving deposit page for user: ${user.username}`);
      res.render('deposit', { balance: user.balance });
    }
  } catch (error) {
    console.error(`Error fetching user info for deposit page: ${error.message}`);
    console.error(error.stack);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;