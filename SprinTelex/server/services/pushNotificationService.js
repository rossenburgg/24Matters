const { Expo } = require('expo-server-sdk');

// Create a new Expo SDK client
let expo = new Expo();

const sendPushNotification = async (expoPushToken, messageData) => {
  if (!Expo.isExpoPushToken(expoPushToken)) {
    console.error(`Push token ${expoPushToken} is not a valid Expo push token`);
    return;
  }

  // Create the messages that you want to send to clients
  let messages = [{
    to: expoPushToken,
    sound: 'default',
    title: messageData.title,
    body: messageData.body,
    data: { withSome: 'data' },
  }];

  // Send the messages through the Expo push notification service
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log('Push notification ticket', ticketChunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error('Error sending push notification:', error);
      console.error('Error details:', error.message, error.stack);
    }
  }

  // Log the status of push notifications
  let receiptIds = [];
  for (let ticket of tickets) {
    // Check tickets for an error
    if (ticket.status === 'error') {
      console.error(`Error sending push notification: ${ticket.message}`);
      if (ticket.details && ticket.details.error) {
        // The error codes are listed in the Expo documentation
        console.error(`The error code is ${ticket.details.error}`);
      }
    } else {
      receiptIds.push(ticket.id);
    }
  }

  // If there are receipt IDs, you can check for the receipt status to further validate the notifications
  if (receiptIds.length > 0) {
    let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    for (let chunk of receiptIdChunks) {
      try {
        let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
        console.log('Receipts for push notifications:', receipts);

        for (let receiptId in receipts) {
          let { status, message, details } = receipts[receiptId];
          if (status === 'error') {
            console.error(`There was an error sending a notification: ${message}`);
            if (details && details.error) {
              console.error(`The error code is ${details.error}`);
            }
          }
        }
      } catch (error) {
        console.error('Error getting receipt statuses for push notifications:', error);
        console.error('Error details:', error.message, error.stack);
      }
    }
  }
};

module.exports = sendPushNotification;