const jwt = require('jsonwebtoken');

const isAdminMiddleware = (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      console.log('Access denied. Admin privileges required.');
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    console.log('Admin check passed, proceeding...');
    next();
  } catch (error) {
    console.error(`Admin verification error: ${error}`);
    res.status(401).json({ message: 'Unauthorized', error: error.toString() });
  }
};

module.exports = isAdminMiddleware;