const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Recommended for serverless (Vercel) environments:
      bufferCommands: false,          // Fail fast instead of buffering indefinitely
      serverSelectionTimeoutMS: 10000, // Give up connecting after 10s
      socketTimeoutMS: 45000,          // Close sockets after 45s of inactivity
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Do not use process.exit(1) in serverless environments
    throw error;
  }
};

module.exports = connectDB;
