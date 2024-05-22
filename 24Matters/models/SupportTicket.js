const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issue: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

supportTicketSchema.pre('save', function(next) {
  console.log(`Creating support ticket for user ID: ${this.userId}`);
  next();
});

supportTicketSchema.post('save', function(doc) {
  console.log(`Support ticket ID: ${doc._id} created successfully.`);
});

const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);

module.exports = SupportTicket;