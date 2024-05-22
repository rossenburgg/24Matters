const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  attachmentUrls: [{ type: String }] // Optional attachments
}, { timestamps: true });

messageSchema.pre('save', async function(next) {
  try {
    console.log(`Saving message from ${this.sender} to ${this.receiver}`);
    next();
  } catch (error) {
    console.error('Error saving message:', error);
    next(error);
  }
});

messageSchema.statics.findByReceiverId = async function(receiverId) {
  try {
    const messages = await this.find({ receiver: receiverId }).populate('sender', 'username').populate('receiver', 'username');
    console.log(`Messages fetched for receiver ID: ${receiverId}`);
    return messages;
  } catch (error) {
    console.error(`Error fetching messages for receiver ID: ${receiverId}`, error);
    throw error;
  }
};

module.exports = mongoose.model('Message', messageSchema);