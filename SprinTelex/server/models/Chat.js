const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }
}, { timestamps: true });

chatSchema.post('save', function(doc) {
  console.log('Chat saved:', doc._id);
});

chatSchema.post('remove', function(doc) {
  console.log('Chat removed:', doc._id);
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;