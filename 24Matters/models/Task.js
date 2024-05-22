const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  potentialEarning: { type: Number, required: true },
  status: { type: String, required: true, enum: ['available', 'in progress', 'completed'], default: 'available' },
  uniqueId: { type: String, required: true, unique: true }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;