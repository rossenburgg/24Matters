const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  twoFactorSecret: { type: String, default: '' },
  isTwoFactorEnabled: { type: Boolean, default: false },
  dashboardWidgets: {
    type: Map,
    of: String,
    default: {}
  },
  theme: {
    type: String,
    default: 'light' // Assuming 'light' and 'dark' are the two themes
  }
});

userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      return next(err);
    }
    user.password = hash;
    next();
  });
});

const User = mongoose.model('User', userSchema);

module.exports = User;