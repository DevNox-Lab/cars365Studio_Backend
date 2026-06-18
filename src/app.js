const express = require('express');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { protect } = require('./middleware/authMiddleware');
require('dotenv').config();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    const frontendUrl = process.env.FRONTEND_URL;
    const allowedOrigins = [
      frontendUrl,
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
    ].filter(Boolean);

    // Log for debugging
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] CORS Request - Origin: ${origin || 'no-origin'}, Allowed: ${allowedOrigins.join(', ')}`);

    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) {
      return callback(null, true);
    }

    // Check if origin is allowed
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Log rejected origins for debugging
      console.warn(`[${timestamp}] CORS Rejected - Origin: ${origin}`);
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', protect, adminRoutes);
app.use('/api/orders', orderRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ message: 'Cars365 Studio API is running...' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found'
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] Error:`, err);

  const statusCode = err.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(isDevelopment && { stack: err.stack })
  });
});

module.exports = app;
