const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String, unique: true, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  termsAccepted: { type: Boolean, required: true },
  accountStatus: { type: String, default: 'Standard' },
  balance: { type: Number, default: 0 },
  commission: { type: Number, default: 0 },
  twoFactorSecret: { type: String },
  themePreference: { type: String, default: 'light' },
  referralCode: { type: String, unique: true, default: () => require('crypto').randomBytes(8).toString('hex') },
  referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  rewards: { type: Number, default: 0 },
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

  // Normalize phone number
  user.phone = user.phone.replace(/[^0-9]/g, '');
});

const User = mongoose.model('User', userSchema);

module.exports = User;