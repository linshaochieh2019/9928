const { setGlobalOptions } = require("firebase-functions/v2");
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");

setGlobalOptions({ region: "us-central1", maxInstances: 10 });

// Load .env for local dev (safe to do; prod ignores if file absent)
require("dotenv").config();

// ---- Secrets (v2) ----
const MONGODB_URI = defineSecret("MONGODB_URI");
const JWT_SECRET = defineSecret("JWT_SECRET");
const FRONTEND_URL = defineSecret("FRONTEND_URL");
const BACKEND_URL = defineSecret("BACKEND_URL");
const GOOGLE_CLIENT_ID = defineSecret("GOOGLE_CLIENT_ID");
const SENDGRID_API_KEY = defineSecret("SENDGRID_API_KEY");
const SPGATEWAY_ENV = defineSecret("SPGATEWAY_ENV");
const SPGATEWAY_SANDBOX_MERCHANT_ID = defineSecret("SPGATEWAY_SANDBOX_MERCHANT_ID");
const SPGATEWAY_SANDBOX_HASH_KEY = defineSecret("SPGATEWAY_SANDBOX_HASH_KEY");
const SPGATEWAY_SANDBOX_HASH_IV = defineSecret("SPGATEWAY_SANDBOX_HASH_IV");

// Mongo DB
const { connectToDatabase } = require("./mongo");

// Lazy connect once on cold start
let dbInitPromise;
function initDB() {
  if (!dbInitPromise) {
    const uri = MONGODB_URI.value() || process.env.MONGODB_URI;
    dbInitPromise = connectToDatabase(uri);
  }
  return dbInitPromise;
}

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
const employerRoutes = require("./routes/employers");
const emailRoutes = require("./routes/email");
const paymentRoutes = require("./routes/payment");
const pointsRoutes = require("./routes/points");

// Use routes
app.use("/auth", authRoutes);
app.use("/teachers", teacherRoutes);
app.use("/employers", employerRoutes);
app.use("/email", emailRoutes);
app.use("/payments", paymentRoutes);
app.use("/points", pointsRoutes);

// Simple test route
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

// // Export function with secret wired in
// exports.api = onRequest(
//   { secrets: [MONGODB_URI, JWT_SECRET, FRONTEND_URL, GOOGLE_CLIENT_ID, SPGATEWAY_ENV, SPGATEWAY_SANDBOX_MERCHANT_ID, SPGATEWAY_SANDBOX_HASH_KEY, SPGATEWAY_SANDBOX_HASH_IV] },
//   async (req, res) => {
//     try {
//       await initDB(); // <-- ensure DB is ready before handling any route
//       if (req.path.startsWith("/api")) req.url = req.url.replace("/api", "");
//       return app(req, res);
//     } catch (err) {
//       logger.error("DB init failed", err);
//       res.status(500).json({ error: "Database connection failed" });
//     }
//   }
// );

// ✅ Export function with secrets wired in
exports.api = onRequest(
  {
    secrets: [
      MONGODB_URI,
      JWT_SECRET,
      FRONTEND_URL,
      BACKEND_URL,
      GOOGLE_CLIENT_ID,
      SENDGRID_API_KEY,
      SPGATEWAY_ENV,
      SPGATEWAY_SANDBOX_MERCHANT_ID,
      SPGATEWAY_SANDBOX_HASH_KEY,
      SPGATEWAY_SANDBOX_HASH_IV,
    ],
  },
  async (req, res) => {
    try {
      // Ensure DB is ready before handling any route
      await initDB();

      // Strip `/api` prefix so Express routes match correctly
      if (req.path.startsWith("/api")) {
        req.url = req.url.replace("/api", "");
      }

      return app(req, res);
    } catch (err) {
      logger.error("DB init failed", err);
      res.status(500).json({ error: "Database connection failed" });
    }
  }
);
