const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { mergeTypeDefs } = require('@graphql-tools/merge');
const { mergeResolvers } = require('@graphql-tools/merge');
const userSchema = require('./graphql/userSchema');
const messageSchema = require('./graphql/messageSchema');
const userResolvers = require('./graphql/resolvers/userResolvers');
const messageResolvers = require('./graphql/resolvers/messageResolvers');
const jwt = require('jsonwebtoken'); // Added for token decoding
const mongoose = require('mongoose'); // Added for MongoDB connection check
const UserModel = require('./models/userModel'); // Import UserModel for getUsers resolver
const bcrypt = require('bcryptjs'); // Added for password comparison

// Combine schemas using mergeTypeDefs
const typeDefs = mergeTypeDefs([userSchema, messageSchema]);

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
    Mutation: {
      signIn: async (_, { email, password }) => {
        try {
          const user = await UserModel.findOne({ email });
          if (!user) {
            throw new Error('User not found');
          }
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            throw new Error('Invalid credentials');
          }
          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
          console.log(`User signed in successfully: ${user.id}`);
          return { token, user };
        } catch (error) {
          console.error('Error signing in user', error);
          throw new Error('Internal server error');
        }
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

// Create an instance of ApolloServer
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
    return {}; // Return an empty context if no token or failed to decode
  }
});

// Apply Apollo GraphQL middleware and set the path to /graphql
server.applyMiddleware({ app, path: '/graphql' });

app.use((err, req, res, next) => {
  console.error(`[Express Error]: ${err.stack}`);
  res.status(500).send('Something broke!');
});

console.log('GraphQL Server setup complete and available at /graphql');

module.exports = { app, server };