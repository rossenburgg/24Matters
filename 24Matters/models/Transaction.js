const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // e.g., 'deposit', 'task completion'
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, required: true } // e.g., 'completed', 'pending'
});

transactionSchema.pre('save', function(next) {
  console.log(`Saving transaction for user ${this.userId}`);
  next();
});

transactionSchema.post('save', function(doc, next) {
  console.log(`Transaction ${doc._id} saved for user ${doc.userId}`);
  next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;