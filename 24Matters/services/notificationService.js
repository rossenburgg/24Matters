const Notification = require('../models/Notification');
const { getIo } = require('../socket.js'); // Corrected the path from './socket.js' to '../socket.js'

const createNotification = async (userId, message) => {
  try {
    const notification = new Notification({
      userId,
      message,
      read: false, // Default to false when creating a new notification
    });
    await notification.save();
    console.log("Notification created successfully for user:", userId);

    // Emit an event to update the notification count for the user
    const unreadCount = await Notification.countDocuments({ userId, read: false });
    const io = getIo();
    if (io) {
      io.to(userId.toString()).emit('notification count', unreadCount);
      console.log(`Notification count updated for user ${userId}`);
    }

    return notification;
  } catch (error) {
    console.error("Failed to create notification for user:", userId, error);
    throw error;
  }
};

module.exports = {
  createNotification,
};