const app = require('./src/app');
const connectDB = require('./src/config/db');

// Connect to MongoDB when the serverless function initializes.
// connectDB() is idempotent — it checks mongoose.connection.readyState
// so it won't create duplicate connections across warm invocations.
connectDB().catch((err) => {
  console.error('Failed to connect to MongoDB:', err.message);
});

module.exports = app;
