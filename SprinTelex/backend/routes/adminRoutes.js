const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');
const Admin = require('../models/adminModel'); // Assuming the existence of an Admin model

const router = express.Router();

// Define admin-specific routes here
router.get('/dashboard', adminAuthMiddleware, (req, res) => {
  console.log('Accessing Admin Dashboard');
  // Log the Authorization header to help diagnose token issues
  console.log('Auth Header:', req.headers.authorization);
  res.send('Admin Dashboard');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const adminUser = await Admin.findOne({ email });
    if (!adminUser) {
      return res.status(401).send('Authentication failed. User not found.');
    }
    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
      return res.status(401).send('Authentication failed. Wrong password.');
    }
    const token = jwt.sign({ id: adminUser.id, email: adminUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Admin logged in successfully:', adminUser.email);
    res.json({ token });
  } catch (error) {
    console.error('Error during admin login:', error.message, error.stack);
    res.status(500).send('Error during admin login');
  }
});

module.exports = router;