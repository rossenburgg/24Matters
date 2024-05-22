const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password, username, location, bio } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ email, password: hashedPassword, username, location, bio });
    const token = jwt.sign({ email: user.email, id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, userId: user._id.toString(), profilePictureUrl: user.profilePictureUrl });
    console.log('User registered successfully:', user._id.toString());
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Something went wrong during registration', error: error.message });
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ email: user.email, id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, userId: user._id.toString(), profilePictureUrl: user.profilePictureUrl });
    console.log('User signed in successfully:', user._id.toString());
  } catch (error) {
    console.error('Error during user sign in:', error);
    res.status(500).json({ message: 'Something went wrong during sign in', error: error.message });
  }
});

module.exports = router;