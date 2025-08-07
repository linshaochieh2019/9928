// dbTest.js
const mongoose = require('mongoose');

// Replace this with your actual connection string
const uri = 'mongodb+srv://linshaochieh2019:xK17MFUv2uk1LRv0@cluster-9928.fgw0lyr.mongodb.net/?retryWrites=true&w=majority&appName=cluster-9928';

mongoose.connect(uri)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB Atlas.');
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
});