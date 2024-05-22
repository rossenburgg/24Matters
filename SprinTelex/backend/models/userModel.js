const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  location: String,
  bio: String,
  profileImage: { type: String }, // Path or URL to the profile image
  isVerified: { type: Boolean, default: false }, // Added field for verification status
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

userSchema.virtual('followers', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'following',
  count: true, // Only get the count of followers
  autopopulate: true
});

userSchema.virtual('following', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'follower',
  count: true, // Only get the count of followed users
  autopopulate: true
});

userSchema.plugin(autopopulate);

userSchema.pre('save', async function(next) {
  try {
    // Log before saving the user
    console.log(`Attempting to save user: ${this.username}`);
    next();
  } catch (error) {
    console.error(`Error saving user: ${error.message}`, error);
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);