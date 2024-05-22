const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  accountStatus: { type: String, default: 'Standard' },
  balance: { type: Number, default: 0 }, // Added field for balance
  commission: { type: Number, default: 0 }, // Added field for commission
  twoFactorSecret: { type: String }, // Added field for 2FA
});

userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      console.error(err.stack);
      return next(err);
    }
    user.password = hash;
    next();
  });
});

const User = mongoose.model('User', userSchema);

module.exports = User;