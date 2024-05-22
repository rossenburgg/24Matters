// Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // Added for nonce generation
const WebSocket = require('ws');
const authRoutes = require("./routes/authRoutes");
const gameRoutes = require('./routes/gameRoutes');
const { isAuthenticated } = require('./routes/middleware/authMiddleware');
const http = require('http');

if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET) {
  console.error("Error: config environment variables not set. Please create/edit .env configuration file.");
  process.exit(-1);
}

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Generate a nonce for each request and add it to the locals
app.use((req, res, next) => {
  res.locals.nonce = uuidv4();
  console.log("Nonce generated for CSP:", res.locals.nonce); // Logging nonce generation
  next();
});

// Use helmet for security with customized CSP to include nonce
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`], // Include nonce in scriptSrc
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));

// Configure CORS
app.use(cors({
  origin: ['http://localhost:3000'], // Adjust according to your needs
  optionsSuccessStatus: 200
}));

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
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Dynamically set based on the environment
      sameSite: 'strict',
    },
  }),
);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('WebSocket received message:', message);
  });

  ws.on('error', function error(error) {
    console.error('WebSocket error:', error.message, error.stack);
  });
});

function broadcast(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data), (error) => {
              if (error) {
                console.error('Broadcast error:', error.message, error.stack);
              }
            });
        }
    });
}

app.locals.broadcast = broadcast;

server.on("error", (error) => {
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

// Game Routes - Adjusted to not apply isAuthenticated globally
app.use('/game', gameRoutes);

// New route handlers for game and dashboard, applying isAuthenticated middleware
app.get("/game", isAuthenticated, (req, res) => {
  res.render("diceGame");
});

app.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard");
});

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

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = { app, server };