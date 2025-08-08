// mongo.js
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// In the Firebase Emulator, the FUNCTIONS_EMULATOR env var is set to 'true'.
// We can use this to determine if we are running locally or deployed.
const isEmulated = process.env.FUNCTIONS_EMULATOR === 'true';

let functions;
if (isEmulated) {
  // Use fs.readFileSync to have more control over file loading and encoding.
  // This avoids issues with file encodings like UTF-16 BOM that `require` can't handle.
  const configPath = path.join(__dirname, '.runtimeconfig.json');
  try {
    const rawdata = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(rawdata);
    functions = {config: () => config};
  } catch (error) {
    console.error(`DEBUG: Failed to load or parse .runtimeconfig.json from ${configPath}`, error);
    // Set an empty config to allow the URI check below to fail gracefully.
    functions = {config: () => ({})};
  }
} else {
  functions = require('firebase-functions');
}

const uri = functions.config()?.mongodb?.uri;
 
if (!uri) {
  console.error("MongoDB URI not found. Make sure you have set the configuration by running: firebase functions:config:set mongodb.uri=\"...\" and then fetched it locally with: firebase functions:config:get > .runtimeconfig.json");
  throw new Error("❌ MongoDB URI not found in Firebase config.");
}

/**
 * A singleton for the Mongoose connection.
 * This prevents creating a new connection for every function invocation.
 */
const connectToDatabase = async () => {
  // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connection.readyState === 1) {
    console.log("✅ Using existing MongoDB connection.");
    return mongoose;
  }
 
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected successfully.");
    return mongoose;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error("Could not connect to MongoDB.");
  }
};

module.exports = connectToDatabase;
