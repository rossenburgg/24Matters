require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const connectDB = require('./config/db');
const testRoutes = require('./routes/testRoutes');
const profileRoutes = require('./routes/profileRoutes');
const searchRoutes = require('./routes/searchRoutes');
const User = require('./models/userModel');
const followRoutes = require('./routes/followRoutes');
const userRoutes = require('./routes/userRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const chatRoutes = require('./routes/chatRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const { ApolloServer, gql } = require('apollo-server-express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { mergeTypeDefs } = require('@graphql-tools/merge');
const userSchema = require('./graphql/userSchema');
const messageSchema = require('./graphql/messageSchema');
const baseSchema = require('./graphql/baseSchema');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

connectDB();

const PORT = process.env.PORT || 3001;

app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.fieldname === "profileImage" || file.fieldname === "coverImage") {
      cb(null, true);
    } else {
      cb(new Error("Unexpected field"), false);
    }
  }
});

app.use('/api', testRoutes);
app.use('/api', profileRoutes);
app.use('/api/users', searchRoutes);
app.use('/api/follow', authMiddleware, followRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/verification', verificationRoutes);

// Combine schemas
const typeDefs = mergeTypeDefs([baseSchema, userSchema, messageSchema]);

// Placeholder resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
  },
};

// Create executable schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Initialize Apollo Server
const apolloServer = new ApolloServer({ schema });

const startApolloServer = async () => {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });

  server.listen(PORT, () => {
    console.log(`Server and WebSocket server are running on http://localhost:${PORT}`);
    console.log(`GraphQL is available at http://localhost:${PORT}${apolloServer.graphqlPath}`);
  });
};

startApolloServer().catch(error => {
  console.error('Error starting Apollo Server:', error);
});

// WebSocket setup
const clients = new Map();

wss.on('connection', (ws, request) => {
  const userID = request.url.substring(1);

  if (clients.has(userID)) {
    console.log(`User ${userID} already has an open WebSocket connection. Closing the existing connection.`);
    clients.get(userID).close();
  }

  clients.set(userID, ws);

  ws.on('message', (message) => {
    console.log(`Received message from user ${userID}: ${message}`);
    clients.forEach((client, id) => {
      if (client.readyState === WebSocket.OPEN && id !== userID) {
        client.send(`Message from user ${userID}: ${message}`);
      }
    });
  });

  ws.on('close', () => {
    clients.delete(userID);
    console.log(`Connection closed for user ${userID}`);
  });

  console.log(`New WebSocket connection established with user ${userID}`);
});

module.exports.clients = clients;