const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const isAdminMiddleware = require('../middleware/isAdminMiddleware'); // Assume isAdminMiddleware is implemented to check if the user is an admin
const VerificationRequest = require('../models/VerificationRequest');

// POST /api/verification/request - Create a new verification request
router.post('/request', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `authMiddleware` attaches `user` to `req`

    // Check for an existing pending verification request
    const existingRequest = await VerificationRequest.findOne({ userId, status: 'pending' });
    if (existingRequest) {
      return res.status(400).json({ message: 'A pending verification request already exists for this user.' });
    }

    // Create a new verification request with 'pending' status
    const newRequest = new VerificationRequest({
      userId,
      status: 'pending', // Default status is 'pending'
    });

    await newRequest.save();

    res.status(201).json({
      message: 'Verification request created successfully',
      request: newRequest,
    });
  } catch (error) {
    console.error('Verification Request Error:', error);
    res.status(500).json({ message: 'Server error while creating verification request', error: error.toString() });
  }
});

router.patch('/manage/:requestId', [authMiddleware, isAdminMiddleware, check('status').isIn(['approved', 'declined'])], async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const request = await VerificationRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Verification request not found.' });
    }

    request.status = status;
    await request.save();

    res.json({ message: `Verification request ${status}.`, request });
  } catch (error) {
    console.error(`Error updating verification request: ${error}`);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
});

module.exports = router;