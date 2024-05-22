const mongoose = require('mongoose');
const { Schema } = mongoose;

const followSchema = new Schema({
  follower: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  following: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

followSchema.index({ follower: 1, following: 1 }, { unique: true });

followSchema.pre('save', async function(next) {
  try {
    // Check if the follow relationship already exists to prevent duplicates
    const existingFollow = await mongoose.model('Follow').findOne({
      follower: this.follower,
      following: this.following
    });
    if (existingFollow) {
      const error = new Error('Follow relationship already exists.');
      error.statusCode = 400;
      throw error;
    }
    next();
  } catch (error) {
    console.error('Error saving follow relationship:', error.message, error.stack);
    next(error);
  }
});

module.exports = mongoose.model('Follow', followSchema);