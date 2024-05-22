// Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const authRoutes = require("./routes/authRoutes");
const userRoutes = require('./routes/userRoutes'); // Added userRoutes
const depositRoutes = require('./routes/depositRoutes'); // Import depositRoutes
const taskRoutes = require('./routes/taskRoutes'); // Import taskRoutes
const supportRoutes = require('./routes/supportRoutes'); // Import supportRoutes
const securityRoutes = require('./routes/securityRoutes'); // Import securityRoutes
const http = require('http');
const { Server } = require("socket.io");

if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET) {
  console.error("Error: config environment variables not set. Please create/edit .env configuration file.");
  process.exit(-1);
}

const app = express();
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

// Authentication Routes
app.use(authRoutes);

// User Routes - Added for user profile API
app.use(userRoutes);

// Deposit Routes - Added for deposit functionality
app.use(depositRoutes);

// Task Routes - Added for task management functionality
app.use(taskRoutes);

// Support Routes - Added for customer support interaction
app.use(supportRoutes);

// Security Routes - Added for 2FA functionality
app.use(securityRoutes);

// Root path response
app.get("/", (req, res) => {
  res.render("index");
});

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

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for task updates
  socket.on('task update', (msg) => {
    console.log('Task update received:', msg);
    io.emit('task update', msg);
  });

  // Listen for balance updates
  socket.on('balance update', (msg) => {
    console.log('Balance update received:', msg);
    io.emit('balance update', msg);
  });

  // Listen for commission updates
  socket.on('commission update', (msg) => {
    console.log('Commission update received:', msg);
    io.emit('commission update', msg);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});