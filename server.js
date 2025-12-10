// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/AuthRouter');
const taskRoutes = require('./routes/TaskRoutes');
const groupRoutes = require('./routes/GroupRouter');
const userRoutes = require('./routes/UserRouter');

// Middlewares
const errorHandler = require('./middlewares/ErrorHandler');
const { connectDB } = require('./configs/database');

const app = express();

// ========== Middlewares ==========
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ========== Routes ==========
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/users', userRoutes);

// Root
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Task Manager API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      tasks: '/api/tasks',
      groups: '/api/groups',
      users: '/api/users'
    }
  });
});

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// ========== 404 Handler (CHUẨN EXPRESS V5) ==========
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot find ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
app.use(errorHandler);

// ========== Start Server ==========
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Test DB connection
    const connection = await connectDB();
    console.log('✅ Database connected');
    await connection.end();

    // Start server
    app.listen(PORT, () => {
      console.log("=".repeat(50));
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📌 API: http://localhost:${PORT}/api`);
      console.log(`📌 Health: http://localhost:${PORT}/health`);
      console.log("=".repeat(50));
    });

  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

// Run server
startServer();

module.exports = app;
