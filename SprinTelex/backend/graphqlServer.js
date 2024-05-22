const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { mergeTypeDefs } = require('@graphql-tools/merge');
const { mergeResolvers } = require('@graphql-tools/merge');
const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { PubSub } = require('graphql-subscriptions');
const baseSchema = require('./graphql/baseSchema');
const userSchema = require('./graphql/userSchema');
const messageSchema = require('./graphql/messageSchema');
const userResolvers = require('./graphql/resolvers/userResolvers');
const messageResolvers = require('./graphql/resolvers/messageResolvers');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const UserModel = require('./models/userModel');
const cors = require('cors');

const pubsub = new PubSub();

// Combine schemas using mergeTypeDefs
const typeDefs = mergeTypeDefs([baseSchema, userSchema, messageSchema]);

// Combine resolvers using mergeResolvers
const resolvers = mergeResolvers([
  userResolvers,
  messageResolvers,
  {
    Query: {
      hello: () => 'Hello, world!',
      user: async (_, { id }) => {
        try {
          const user = await UserModel.findById(id);
          console.log(`Fetching user by ID: ${id}`);
          if (!user) {
            throw new Error('User not found');
          }
          return user;
        } catch (error) {
          console.error(`Error fetching user by ID: ${error.message}`, error);
          throw new Error('Failed to fetch user by ID');
        }
      },
    },
    Subscription: {
      messageSent: {
        subscribe: () => pubsub.asyncIterator(['MESSAGE_SENT']),
      },
    },
  },
]);

// Create executable schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();

// Apply CORS middleware to allow cross-origin requests
app.use(cors());

// MongoDB connection check middleware
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    console.error('MongoDB connection is not established.');
    return res.status(500).send('Internal server error due to DB connection.');
  }
  console.log('MongoDB connection established successfully');
  next();
});

const httpServer = createServer(app);

const server = new ApolloServer({
  schema,
  formatError: (error) => {
    console.error(`[GraphQL Error]: Message: ${error.message}, Location: ${error.locations}, Path: ${error.path}`);
    return error;
  },
  context: async ({ req }) => {
    const token = req.headers.authorization || '';
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(`Token decoded: ${decoded}`);
        const user = await UserModel.findById(decoded.id);
        if (!user) {
          throw new Error('User not found');
        }
        return { userId: decoded.id, user };
      } catch (error) {
        console.error(`Error decoding token or fetching user: ${error.message}`, error);
        throw new Error('Failed to authenticate token or fetch user');
      }
    } else {
      console.log('No token provided');
    }
    console.log(`Request received: ${req.method} ${req.path}`);
    return {};
  }
});

server.applyMiddleware({ app });

SubscriptionServer.create({
  schema,
  execute,
  subscribe,
  onConnect: (connectionParams, webSocket, context) => {
    console.log('Connected to WebSocket for subscriptions');
    if (connectionParams.authToken) {
      try {
        const decoded = jwt.verify(connectionParams.authToken, process.env.JWT_SECRET);
        console.log(`WebSocket connection authenticated for user ID: ${decoded.id}`);
        return { userId: decoded.id };
      } catch (error) {
        console.error(`WebSocket connection authentication failed: ${error.message}`, error);
      }
    }
    return {}; // Allow unauthenticated connections for certain subscriptions if needed
  },
  onDisconnect: (webSocket, context) => {
    console.log('Disconnected from WebSocket');
  },
}, {
  server: httpServer,
  path: server.graphqlPath,
});

httpServer.listen(3001, () => {
  console.log(`Server is now running on http://localhost:3001${server.graphqlPath}`);
});

module.exports = { app, server };