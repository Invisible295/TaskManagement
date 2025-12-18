require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/TaskRoutes');
const groupRoutes = require('./routes/GroupRouter');
const userRoutes = require('./routes/UserRouter');

// Middlewares
const errorHandler = require('./middlewares/ErrorHandler');

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security Headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// ===== Serve Static Files (Frontend) =====
app.use('/views', express.static(path.join(__dirname, 'views')));

// Redirect root to login
app.get('/', (req, res) => {
    res.redirect('/views/login.html');
});

// ===== API Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/users', userRoutes);

// Error handler
app.use(errorHandler);

// ===== Start Server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('=================================');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Open: http://localhost:${PORT}`);
    console.log(`📋 Frontend: http://localhost:${PORT}/views/login.html`);
    console.log(`🔌 API: http://localhost:${PORT}/api`);
    console.log('=================================');
});