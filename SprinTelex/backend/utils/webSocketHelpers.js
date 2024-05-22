// Import the clients Map from server.js or adjust to use a shared instance
// Assuming clients Map is exported from server.js and can be imported here
const WebSocket = require('ws');
const clients = require('../server').clients; 

function sendMessageToUser(userID, message) {
  const client = clients.get(userID);
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(message);
    console.log(`Message sent to user ${userID}: ${message}`);
  } else {
    console.log(`Cannot send message, connection with user ${userID} not established or closed.`);
  }
}

module.exports = { sendMessageToUser };