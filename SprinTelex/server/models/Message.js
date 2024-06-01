const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

messageSchema.post('save', function(doc, next) {
  console.log(`New message saved with ID: ${doc._id} in conversation: ${doc.conversationId}`);
  next();
});

messageSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    console.error('There was a duplicate key error:', error.message, error.stack);
    next(new Error('There was a duplicate key error'));
  } else if (error) {
    console.error('Error saving message:', error.message, error.stack);
    next(error);
  } else {
    next();
  }
});

module.exports = mongoose.model('Message', messageSchema);