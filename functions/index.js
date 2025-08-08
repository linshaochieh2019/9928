/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions/v2");
const {onRequest} = require("firebase-functions/v2/https");
const {logger} = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({maxInstances: 10});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Mongo DB
const connectToDatabase = require('./mongo');


// Main code
const express = require("express");
const cors = require("cors");

const app = express();
// app.use(cors());
app.use(cors({
  origin: true,             // allow all origins (or specify domain here)
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true
}));
app.use(express.json());
 
// === API Routes ===
// Define routes directly on the app. This makes the code cleaner and
// independent of the "/api" prefix used in firebase.json.
 
// Test endpoint: Handles GET /ping
app.get("/ping", (req, res) => {
  res.json({message: "pong from Firebase Function"});
});
 
// Test endpoint: MongoDB connection
app.get("/mongodb", async (req, res, next) => {
  try {
    await connectToDatabase(); // using mongoose + uri from config
    res.json({message: "Connected to MongoDB"});
  } catch (error) {
    // Pass errors from async routes to the global error handler
    next(error);
  }
});

// Example POST endpoint: Handles POST /hello
app.post("/hello", (req, res) => {
  const name = req.body.name || "guest";
  res.json({message: `Hello, ${name}!`});
});
 
// A catch-all 404 handler for any routes that don't exist.
app.use((req, res) => {
  res.status(404).json({error: "Route not found"});
});

// Global error handler. This must be the last `app.use()` and must have 4 arguments.
app.use((err, req, res, next) => {
  logger.error("An unhandled error occurred:", err);

  // Respond with a generic 500 error
  res.status(500).json({
    error: "Internal Server Error",
    message: "An unexpected error occurred on the server.",
  });
});


 
// === Export function ===
// This is the magic. It intercepts the request and removes the "/api" prefix
// if it exists. This makes the Express app's routing consistent whether
// it's called from Hosting or directly.
exports.api = onRequest((req, res) => {
  if (req.path.startsWith("/api")) {
    req.url = req.url.replace("/api", ""); // or req.url.substring(4)
  }
  return app(req, res);
});
