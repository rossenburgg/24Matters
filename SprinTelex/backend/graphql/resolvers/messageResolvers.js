const Message = require('../../models/messageModel');
const jwt = require('jsonwebtoken'); // For token decoding
const mongoose = require('mongoose'); // For MongoDB connection check
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();
const MESSAGE_SENT = 'MESSAGE_SENT';

const messageResolvers = {
  Query: {
    message: async (_, { id }, context) => {
      if (!context.userId) {
        throw new Error('Unauthorized access');
      }
      try {
        const message = await Message.findById(id);
        if (!message) {
          throw new Error('Message not found');
        }
        return message;
      } catch (error) {
        console.error(`Error fetching message with ID ${id}:`, error);
        throw new Error('Internal server error');
      }
    },
    messagesBySender: async (_, { senderId }, context) => {
      if (!context.userId) {
        throw new Error('Unauthorized access');
      }
      try {
        const messages = await Message.find({ sender: senderId });
        return messages;
      } catch (error) {
        console.error(`Error fetching messages by sender with ID ${senderId}:`, error);
        throw new Error('Internal server error');
      }
    },
    messagesByReceiver: async (_, { receiverId }, context) => {
      if (!context.userId) {
        throw new Error('Unauthorized access');
      }
      try {
        const messages = await Message.find({ receiver: receiverId });
        return messages;
      } catch (error) {
        console.error(`Error fetching messages by receiver with ID ${receiverId}:`, error);
        throw new Error('Internal server error');
      }
    },
  },
  Mutation: {
    sendMessage: async (_, { messageInput }, context) => {
      if (!context.userId) {
        throw new Error('Unauthorized access');
      }
      try {
        const newMessage = new Message({
          ...messageInput,
          sender: context.userId // Assuming the sender ID is stored in context.userId
        });
        const result = await newMessage.save();
        pubsub.publish(MESSAGE_SENT, { messageSent: result });
        return result;
      } catch (error) {
        console.error("Error sending message:", error);
        throw new Error('Internal server error');
      }
    },
  },
  Subscription: {
    messageSent: {
      subscribe: () => pubsub.asyncIterator([MESSAGE_SENT]),
    },
  },
};

module.exports = messageResolvers;