const mongoose = require('mongoose');

const verificationRequestSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'declined'], 
    default: 'pending',
    required: true
  }
}, { timestamps: true });

verificationRequestSchema.pre('save', async function(next) {
  try {
    // Ensure the referenced User exists before saving a VerificationRequest
    const userExists = await mongoose.model('User').findById(this.userId);
    if (!userExists) {
      throw new Error('User does not exist');
    }
    next();
  } catch (error) {
    console.error('Error saving VerificationRequest:', error.message);
    next(error);
  }
});

module.exports = mongoose.model('VerificationRequest', verificationRequestSchema);