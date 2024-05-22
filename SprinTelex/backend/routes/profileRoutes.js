const express = require('express');
const ProfileService = require('../services/ProfileService'); // Ensure correct import of ProfileService
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose'); // Import mongoose to validate ObjectId
const router = express.Router();

// Instantiate ProfileService
const profileService = new ProfileService();

// Middleware to verify token and set user ID in request
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Assuming Bearer token is used
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.userId = decoded.id; // Assuming the token contains the user ID as 'id'
        next();
      } catch (error) {
        console.error('Authentication error: Token verification failed', error.message, error.stack);
        res.status(403).json({ message: 'Forbidden', error: 'Token verification failed' });
      }
    } else {
      console.error('Authentication error: Token not found in Authorization header');
      res.status(401).json({ message: 'Unauthorized', error: 'Token not found' });
    }
  } else {
    console.error('Authentication error: Authorization header is missing');
    res.status(401).json({ message: 'Unauthorized', error: 'Authorization header is missing' });
  }
};

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads');
fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir) // Specify the directory to store uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)) // Ensure unique file names
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 1024 * 1024 * 5 } });

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const profileData = await profileService.getProfileData(req.userId); // Correct usage of ProfileService
    if (profileData) {
      res.status(200).json(profileData);
    } else {
      console.error('Error fetching profile data: Profile not found');
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    console.error('Error fetching profile data:', error.message, error.stack);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// PATCH route to update user profile picture
router.patch('/profile/update', authenticateToken, upload.single('profileImage'), async (req, res) => {
  try {
    const profileData = { profileImage: req.file.path }; // Updated to use profileImage field
    const updateResult = await profileService.updateProfile(req.userId, profileData); // Correct usage of ProfileService
    if (updateResult) {
      res.status(200).json({ message: 'Profile picture updated successfully', data: updateResult });
    } else {
      console.error('Error updating profile picture: Profile not found');
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    console.error('Error updating profile picture:', error.message, error.stack);
    res.status(500).json({ message: 'Profile update operation failed', error: error.message });
  }
});

// New route to fetch user profile by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error('Error fetching user profile: Invalid user ID', userId);
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const userProfile = await profileService.getProfileById(userId); // Assuming getProfileById method exists in ProfileService
    if (userProfile) {
      res.status(200).json(userProfile);
    } else {
      console.error('Error fetching user profile: Profile not found for ID', userId);
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    console.error('Error fetching user profile:', error.message, error.stack);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;