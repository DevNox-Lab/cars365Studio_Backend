const app = require('./app');
const connectDB = require('./config/db');
const seedAdmin = require('./scripts/seedAdmin');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Connecting to database...`);
    await connectDB();
    console.log(`[${timestamp}] Database connected successfully`);

    console.log(`[${timestamp}] Running admin seed script...`);
    await seedAdmin();
    console.log(`[${timestamp}] Admin seed completed`);

    app.listen(PORT, () => {
      console.log(`[${timestamp}] Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] Failed to start server:`, error.message);
    process.exit(1);
  }
};

startServer();
