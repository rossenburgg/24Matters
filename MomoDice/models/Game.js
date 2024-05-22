const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  betAmount: { type: Number, required: true },
  chosenNumber: { type: Number }, // This field is now optional due to the new game logic
  diceResult: { type: Number }, // This field is now optional as we introduce resultNumber for the new game logic
  winStatus: { type: Boolean, required: true },
  payoutAmount: { type: Number, required: true },
  prediction: { type: String, required: true, enum: ['above', 'below'] }, // New field to store the user's prediction, now required
  threshold: { type: Number, required: true }, // New field for the prediction threshold, now required
  resultNumber: { type: Number, required: true }, // New field to store the dice roll result between 0 and 100, now required
  createdAt: { type: Date, default: Date.now } // Added to track when the bet was placed
});

gameSchema.index({ userId: 1 }, { background: true });
gameSchema.index({ createdAt: 1 }, { background: true }); // Index for efficiently querying recent bets

gameSchema.pre('save', function(next) {
  if (!this.isModified('winStatus')) return next();
  if (typeof this.winStatus !== 'boolean') {
    const err = new Error('Win status must be a boolean');
    console.error('Error saving game:', err);
    return next(err);
  } else if (this.prediction && !['above', 'below'].includes(this.prediction)) {
    const err = new Error('Prediction must be either "above" or "below"');
    console.error('Error saving game:', err);
    return next(err);
  } else if (this.prediction && (typeof this.threshold !== 'number' || this.threshold < 0 || this.threshold > 100)) {
    const err = new Error('Threshold must be a number between 0 and 100');
    console.error('Error saving game:', err);
    return next(err);
  } else if (this.prediction && (typeof this.resultNumber !== 'number' || this.resultNumber < 0 || this.resultNumber > 100)) {
    const err = new Error('Result number must be a number between 0 and 100');
    console.error('Error saving game:', err);
    return next(err);
  } else {
    next();
  }
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;