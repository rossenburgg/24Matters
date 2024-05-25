const User = require('../../models/User');

const themeMiddleware = async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      if (user && user.themePreference) {
        res.locals.themePreference = user.themePreference;
      } else {
        // Default theme preference if not set by user
        res.locals.themePreference = 'light';
      }
    } catch (error) {
      console.error('Error fetching user theme preference:', error);
      res.locals.themePreference = 'light';
    }
  } else {
    // Default theme preference for non-logged-in users
    res.locals.themePreference = 'light';
  }
  next();
};

module.exports = themeMiddleware;