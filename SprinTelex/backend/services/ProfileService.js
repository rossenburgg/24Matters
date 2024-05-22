const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

class ProfileService {
    constructor() {
        this.UserProfile = require('../models/userModel');
        this.fs = fs;
        this.path = path;
    }

    async updateProfile(userId, profileData, profileImage, coverImage) {
        try {
            // Ensure profileData includes profileImage field if image is provided
            if (profileImage && profileImage.originalname) {
                const profileImagePath = await this.storeProfileImage(userId, profileImage, 'profile');
                profileData.profileImage = profileImagePath; // Add or update profileImage path in profileData
            }
            // Ensure profileData includes coverImage field if image is provided
            if (coverImage && coverImage.originalname) {
                const coverImagePath = await this.storeProfileImage(userId, coverImage, 'cover');
                profileData.coverImage = coverImagePath; // Add or update coverImage path in profileData
            }

            const updatedProfile = await this.UserProfile.findByIdAndUpdate(userId, { $set: profileData }, { new: true });

            console.log("Profile updated successfully:", updatedProfile);
            return updatedProfile;
        } catch (error) {
            console.error("Error updating user profile:", error);
            throw error; // Rethrow the error for further handling
        }
    }

    async getProfileData(userId) {
        try {
            const userProfile = await this.UserProfile.findById(userId);
            if (!userProfile) {
                throw new Error(`User profile not found for ID: ${userId}`);
            }
            console.log("Profile data fetched successfully:", userProfile);
            return userProfile;
        } catch (error) {
            console.error("Error fetching user profile data:", error);
            throw error; // Rethrow the error for further handling
        }
    }

    async storeProfileImage(userId, imageFile, imageType) {
        // Assuming imageFile is the path to the image file
        const imageName = `${userId}-${imageType}-${Date.now()}${path.extname(imageFile.originalname)}`;
        const imagePath = path.join(__dirname, '..', 'uploads', imageName);

        // Move the image to the uploads directory using asynchronous operations
        try {
            await fs.promises.readFile(imageFile.path)
                .then(data => fs.promises.writeFile(imagePath, data))
                .then(() => fs.promises.unlink(imageFile.path)); // Remove the temp file
            console.log(`${imageType} image stored successfully:`, imagePath);
            return imagePath;
        } catch (error) {
            console.error(`Error storing ${imageType} image:`, error);
            throw error; // Rethrow the error for further handling
        }
    }

    async getProfileById(userId) {
        try {
            // Validate userId is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                console.error("Invalid user ID provided:", userId);
                throw new Error(`Invalid user ID: ${userId}`);
            }
            const userProfile = await this.UserProfile.findById(userId).exec();
            if (!userProfile) {
                console.error("User profile not found for ID:", userId);
                throw new Error(`Profile not found for user ID: ${userId}`);
            }
            console.log("Fetched user profile successfully:", userProfile);
            return userProfile;
        } catch (error) {
            console.error("Error fetching user profile by ID:", error);
            throw error;
        }
    }
}

module.exports = ProfileService;