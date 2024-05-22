const WebSocket = require('ws');
const clients = require('../server').clients; // Assuming this is the Map object storing WebSocket clients from 'server.js'

/**
 * Broadcasts a user update event to all connected clients.
 * @param {Object} userData - The user data to broadcast.
 */
const broadcastUserUpdate = (userData) => {
    const message = JSON.stringify({
        type: 'USER_UPDATE',
        payload: userData,
    });

    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};

/**
 * Broadcasts a new message event to all connected clients.
 * @param {Object} messageData - The message data to broadcast.
 */
const broadcastNewMessage = (messageData) => {
    const message = JSON.stringify({
        type: 'NEW_MESSAGE',
        payload: messageData,
    });

    clients.forEach((client, userId) => {
        // Assuming messageData.receiverId exists and it's the ID of the message receiver
        // Only send the message to the receiver and the sender
        if (client.readyState === WebSocket.OPEN && (userId === messageData.receiverId.toString() || userId === messageData.senderId.toString())) {
            client.send(message);
        }
    });
};

module.exports = { broadcastUserUpdate, broadcastNewMessage };