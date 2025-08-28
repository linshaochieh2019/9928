const { setGlobalOptions } = require("firebase-functions/v2");
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");

setGlobalOptions({ region: "us-central1", maxInstances: 10 });

// Load .env for local dev (safe to do; prod ignores if file absent)
require("dotenv").config();

// ---- Secrets (v2) ----
const MONGODB_URI = defineSecret("MONGODB_URI");

// Mongo DB
const { connectToDatabase } = require("./mongo");

// Middleware
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors({ origin: true, methods: ["GET", "POST", "OPTIONS"], credentials: true }));
app.use(express.json());


// Authentication and authorization
const authRoutes = require("./routes/auth");
const { authenticate, authorize } = require("./middleware/auth");

// === API Routes ===
const teacherRoutes = require("./routes/teacherRoutes");

// Mount teacher CRUD under /teachers
app.use("/auth", authRoutes);
app.use("/teachers", teacherRoutes);

// Routes
app.get("/ping", (req, res) => {
  res.json({ message: "pong from Firebase Function" });
});

app.get("/mongodb", async (req, res, next) => {
  try {
    const uri = MONGODB_URI.value() || process.env.MONGODB_URI;
    await connectToDatabase(uri); // connects inside this route
    res.json({ message: "Connected to MongoDB" });
  } catch (error) {
    next(error);
  }
});

app.post("/hello", (req, res) => {
  const name = req.body.name || "guest";
  res.json({ message: `Hello, ${name}!` });
});


// 404
app.use((_, res) => res.status(404).json({ error: "Route not found" }));

// Error handler
app.use((err, req, res, next) => {
  logger.error("An unhandled error occurred:", err);
  res.status(500).json({ error: "Internal Server Error", message: "An unexpected error occurred on the server." });
});

// Export function with secret wired in
exports.api = onRequest(
  { secrets: [MONGODB_URI] }, // <-- makes secret available in prod
  (req, res) => {
    if (req.path.startsWith("/api")) req.url = req.url.replace("/api", "");
    return app(req, res);
  }
);
