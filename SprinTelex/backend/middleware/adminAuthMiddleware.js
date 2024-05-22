const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel'); 

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    console.log('Authorization header is missing.');
    return res.status(401).json({ message: 'Authorization header is missing' });
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken.isAdmin) {
      console.log('Access denied. Admin privileges required.');
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    console.log(`Admin ${decodedToken.id} authenticated successfully.`);
    next();
  } catch (error) {
    console.error('Error in adminAuthMiddleware:', error);
    console.error('Error stack:', error.stack);
    return res.status(401).json({ message: 'Invalid or expired token', error: error.toString() });
  }
};