const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Enable CORS for frontend communication
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Fitness Workout Log API is running',
  });
});

// Health Check API endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Fitness Workout Log API is running',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Stop the existing backend process before starting another one.`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
};

// Connect to MongoDB before accepting API requests.
connectDB().then(() => {
  startServer(Number(PORT));
});

