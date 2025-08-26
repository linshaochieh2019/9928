const mongoose = require("mongoose");
const logger = require("firebase-functions/logger");

/**
 * Keep one connection per instance (serverless best practice).
 * readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
 */
let connectPromise = null;

async function connectToDatabase(uri) {
  if (!uri) {
    logger.error("❌ MONGODB_URI is missing. Provide via Secret (prod) or .env (local).");
    throw new Error("MONGODB_URI not provided");
  }

  if (mongoose.connection.readyState === 1) {
    logger.info("✅ Using existing MongoDB connection.");
    return mongoose;
  }

  if (!connectPromise) {
    logger.info("🔌 Connecting to MongoDB...");
    connectPromise = mongoose.connect(uri, {
      // Reasonable serverless defaults
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      maxIdleTimeMS: 60000,
      // You can add authSource/dbName if your URI doesn’t include them
    }).then(() => {
      logger.info("✅ MongoDB connected successfully.");
      return mongoose;
    }).catch(err => {
      // Reset promise so a later call can retry
      connectPromise = null;
      logger.error("❌ MongoDB connection error:", err);
      throw err;
    });
  }

  return connectPromise;
}

module.exports = { connectToDatabase };
