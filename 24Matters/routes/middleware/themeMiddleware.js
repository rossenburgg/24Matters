const User = require('../../models/User');

const themeMiddleware = async (req, res, next) => {
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      if (user) {
        res.locals.themePreference = user.themePreference; // Assuming 'user.themePreference' exists and can be 'light' or 'dark'
        console.log(`Theme preference set to ${user.themePreference} for user ${req.session.userId}`);
      } else {
        res.locals.themePreference = 'light'; // Default theme
        console.log(`User not found. Setting default theme preference to 'light' for session ${req.session.userId}`);
      }
    } catch (error) {
      console.error("Error fetching user's theme preference:", error.message, error.stack);
      res.locals.themePreference = 'light'; // Fallback theme
      console.error(`Failed to fetch theme preference for user ${req.session.userId}. Defaulting to 'light'.`);
    }
  } else {
    res.locals.themePreference = 'light'; // Non-authenticated users get the default theme
    console.log("No user session found. Setting theme preference to 'light'.");
  }
  next();
};

module.exports = themeMiddleware;