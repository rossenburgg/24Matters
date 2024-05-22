const express = require('express');
const Task = require('../models/Task');
const { isAuthenticated } = require('./middleware/authMiddleware');

const router = express.Router();

// Fetch all available tasks
router.get('/api/tasks', isAuthenticated, async (req, res) => {
  try {
    const tasks = await Task.find({ status: 'available' });
    console.log('Fetched available tasks.');
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching available tasks:', error);
    res.status(500).json({ message: 'Server error while fetching tasks.' });
  }
});

// Fetch specific task details
router.get('/api/tasks/:taskId', isAuthenticated, async (req, res) => {
  try {
    const task = await Task.findOne({ uniqueId: req.params.taskId });
    if (!task) {
      console.log(`Task with ID ${req.params.taskId} not found.`);
      return res.status(404).json({ message: 'Task not found.' });
    }
    console.log(`Fetched details for task ID ${req.params.taskId}.`);
    res.json(task);
  } catch (error) {
    console.error(`Error fetching details for task ID ${req.params.taskId}:`, error);
    res.status(500).json({ message: 'Server error while fetching task details.' });
  }
});

// Submit a completed task
router.post('/api/tasks/submit', isAuthenticated, async (req, res) => {
  try {
    const { taskId } = req.body;
    const task = await Task.findOneAndUpdate({ uniqueId: taskId }, { status: 'completed' }, { new: true });
    if (!task) {
      console.log(`Task with ID ${taskId} not found or already completed.`);
      return res.status(404).json({ message: 'Task not found or already completed.' });
    }
    console.log(`Task ID ${taskId} submitted successfully.`);
    res.json({ message: 'Task submitted successfully.', task });
  } catch (error) {
    console.error(`Error submitting task ID ${req.body.taskId}:`, error);
    res.status(500).json({ message: 'Server error while submitting task.' });
  }
});

module.exports = router;