// Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const authRoutes = require("./routes/authRoutes");
const homeRoutes = require('./routes/homeRoutes'); // Added homeRoutes
const walletInfoRoutes = require('./routes/walletInfoRoutes'); // Import walletInfoRoutes
const depositRoutes = require('./routes/depositRoutes'); // Import depositRoutes
const taskRoutes = require('./routes/taskRoutes'); // Import taskRoutes
const historyRoutes = require('./routes/historyRoutes'); // Import historyRoutes
const supportRoutes = require('./routes/supportRoutes'); // Import supportRoutes
const analyticsRoutes = require('./routes/analyticsRoutes'); // Import analyticsRoutes
const apiRoutes = require('./routes/apiRoutes'); // Import apiRoutes for analytics data
const User = require('./models/User'); // Import User model
const http = require('http');
const { Server } = require("socket.io");

if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET) {
  console.error("Error: config environment variables not set. Please create/edit .env configuration file.");
  process.exit(-1);
}

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setting the templating engine to EJS
app.set("view engine", "ejs");

// Serve static files
app.use(express.static("public"));

// Database connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error(`Database connection error: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  });

// Session configuration with connect-mongo
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
  }),
);

app.on("error", (error) => {
  console.error(`Server error: ${error.message}`);
  console.error(error.stack);
});

// Logging session creation and destruction
app.use((req, res, next) => {
  const sess = req.session;
  // Make session available to all views
  res.locals.session = sess;
  if (!sess.views) {
    sess.views = 1;
    console.log("Session created at: ", new Date().toISOString());
  } else {
    sess.views++;
    console.log(
      `Session accessed again at: ${new Date().toISOString()}, Views: ${sess.views}, User ID: ${sess.userId || '(unauthenticated)'}`,
    );
  }
  next();
});

// Socket.io for real-time communication
io.on('connection', (socket) => {
  console.log('A user connected to the support chat');
  socket.on('disconnect', () => {
    console.log('User disconnected from the support chat');
  });

  socket.on('support message', (msg) => {
    console.log(`Message received: ${msg}`);
    io.emit('support message', msg);
  });

  // User-Socket mapping for targeted balance updates
  socket.on('register', userId => {
    // Associate the user ID with the socket ID
    socket.join(userId); // Using rooms to manage user sessions
    console.log(`User ${userId} registered with socket ID ${socket.id}`);
  });

  // Listen for balance update requests and emit updates to the specific user
  socket.on('request balance update', (data) => {
    console.log(`Balance update requested for user: ${data.userId}`);
    // Emit the balance update only to sockets in the user's room
    io.to(data.userId).emit('balance update', { newBalance: data.newBalance });
  });

  // Set up to emit events for balance and task updates
  app.set('socketio', io); // Make io accessible in route handlers
});

// Authentication Routes
app.use(authRoutes);

// Home Routes - Adjusted to serve User Greeting and Status feature at root '/'
app.use(homeRoutes);

// Wallet Info Routes - Serve wallet information
app.use(walletInfoRoutes);

// Deposit Routes - Serve deposit page and functionality
app.use(depositRoutes);

// Task Routes - Serve task management functionality
app.use(taskRoutes);

// History Routes - Serve transaction history page and functionality
app.use(historyRoutes);

// Support Routes - Serve customer support page and functionality
app.use(supportRoutes);

// Analytics Routes - Serve analytics dashboard and functionality
app.use(analyticsRoutes);

// API Routes - Serve API requests for analytics data
app.use('/api', apiRoutes); // Correctly prefix API routes with '/api'

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  res.status(404).send("Page not found.");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`Unhandled application error: ${err.message}`);
  console.error(err.stack);
  res.status(500).send("There was an error serving your request.");
});

// Change the listen method to use the http server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});