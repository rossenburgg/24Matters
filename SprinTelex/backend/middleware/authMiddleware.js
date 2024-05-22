const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      console.log('Authorization header is missing.');
      return res.status(401).json({ message: 'Authorization header is missing.' });
    }
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      console.log('Authentication token is missing.');
      return res.status(401).json({ message: 'Authentication token is missing.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      console.log('User not found.');
      return res.status(404).json({ message: 'User not found.' });
    }

    req.user = user;
    console.log(`User ${user._id} authenticated successfully.`);
    next();
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    } else {
      return res.status(500).json({ message: 'Failed to authenticate.', error: error.toString() });
    }
  }
};

module.exports = authMiddleware;