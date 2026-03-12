const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// ============================================
// CONFIGURATION
// ============================================
dotenv.config();
connectDB();

// Passport strategies need env vars loaded
const passport = require('./config/passport');

const app = express();

// ============================================
// CORS CONFIGURATION
// ============================================
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'https://todo-app-frontend-henna-psi.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// ============================================
// MIDDLEWARE
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(passport.initialize());

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.get('origin')}`);
  next();
});

// ============================================
// ROUTES
// ============================================
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Todo API',
    status: 'running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'API is operational',
    endpoints: {
      auth: '/api/auth',
      tasks: '/api/tasks'
    }
  });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
// app.use('/api/auth', require('./routes/oauthRoutes')); // ADD THIS

// ============================================
// ERROR HANDLING
// ============================================
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📅 Started: ${new Date().toLocaleString()}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Allowed Origins:`);
  allowedOrigins.forEach(origin => console.log(`   - ${origin}`));
  console.log('=================================');
});
