// Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const path = require("path");
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

// Import routes and middleware
const authRoutes = require("./routes/authRoutes");
const homeRoutes = require('./routes/homeRoutes');
const walletInfoRoutes = require('./routes/walletInfoRoutes');
const depositRoutes = require('./routes/depositRoutes');
const taskRoutes = require('./routes/taskRoutes');
const historyRoutes = require('./routes/historyRoutes');
const supportRoutes = require('./routes/supportRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const apiRoutes = require('./routes/apiRoutes');
const userSettingsRoutes = require('./routes/userSettingsRoutes');
const referralRoutes = require('./routes/referralRoutes');
const adminRoutes = require('./routes/adminRoutes');
const loyaltyPointsRoutes = require('./routes/loyaltyPointsRoutes');
const dailyRewardRoutes = require('./routes/dailyRewardRoutes');
const themeRoutes = require('./routes/themeRoutes');
const startingRoutes = require('./routes/startingRoutes');
const notificationMiddleware = require('./routes/middleware/notificationMiddleware');
const themeMiddleware = require('./routes/middleware/themeMiddleware');
const User = require('./models/User');
const Notification = require('./models/Notification');

require('./scheduler');

if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET) {
  console.error("Error: config environment variables not set. Please create/edit .env configuration file.");
  process.exit(-1);
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust the origin as per your requirements
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }
});

const port = process.env.PORT || 3000;

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // Enable CORS

// Setting the templating engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Set the views directory

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Database connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error(`Database connection error: ${err.message}`);
    process.exit(1);
  });

// Session configuration with connect-mongo
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
  })
);

// Logging session creation and destruction
app.use((req, res, next) => {
  const sess = req.session;
  res.locals.session = sess;
  if (!sess.views) {
    sess.views = 1;
    console.log("Session created at: ", new Date().toISOString());
  } else {
    sess.views++;
    console.log(`Session accessed again at: ${new Date().toISOString()}, Views: ${sess.views}, User ID: ${sess.userId || '(unauthenticated)'}`);
  }
  next();
});

// Make appBaseUrl available to all views
app.locals.appBaseUrl = process.env.APP_BASE_URL;

// Apply the themeMiddleware globally
app.use(themeMiddleware);

// Socket.io for real-time communication
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('register', async (userId) => {
    if (!userId) {
      console.error("Attempt to register socket without userId");
      return;
    }
    socket.join(userId);
    console.log(`User ${userId} registered with socket ID ${socket.id}`);
    try {
      const unreadCount = await Notification.countDocuments({ userId: new mongoose.Types.ObjectId(userId), read: false });
      io.to(userId).emit('notification count', unreadCount);
      console.log(`Emitted initial notification count ${unreadCount} for user ${userId}`);
    } catch (error) {
      console.error(`Error fetching initial unread notifications for user ${userId}: ${error}`);
    }
  });

  socket.on('request balance update', (data) => {
    if (!data.userId) {
      console.error("Balance update request without userId");
      return;
    }
    console.log(`Balance update requested for user: ${data.userId}`);
    io.to(data.userId).emit('balance update', { newBalance: data.newBalance });
  });

  socket.on('new-notification', async (userId) => {
    if (!userId) {
      console.error("New notification event received without userId");
      return;
    }
    try {
      const unreadNotifications = await Notification.countDocuments({ userId: userId, read: false });
      io.to(userId).emit('notification count', unreadNotifications);
      console.log(`Emitted notification count update for user ${userId}`);
    } catch (error) {
      console.error(`Error fetching unread notifications for user ${userId}: ${error}`);
    }
  });

  app.set('socketio', io);
});

app.use(startingRoutes);

// Apply the notificationMiddleware globally
app.use(notificationMiddleware);

// Register routes
app.use('/auth', authRoutes);
app.use('/', homeRoutes);
app.use('/wallet', walletInfoRoutes);
app.use('/deposit', depositRoutes);
app.use('/task', taskRoutes);
app.use('/history', historyRoutes);
app.use('/support', supportRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/api', apiRoutes);
app.use('/settings', userSettingsRoutes);
app.use('/referral', referralRoutes);
app.use('/admin', adminRoutes);
app.use('/loyalty', loyaltyPointsRoutes);
app.use('/daily', dailyRewardRoutes);
app.use('/theme', themeRoutes);

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  res.status(404).send("Page not found.");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`Unhandled application error: ${err.message}`);
  res.status(500).send("There was an error serving your request.");
});

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Export the server instance
module.exports = server;
