require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Initialize SQLite database
const db = require('./database');

// Middleware
app.use(cors());
app.use(express.json());

// Make db available to all routes
app.locals.db = db;

// Serve frontend static files
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const validationRoutes = require('./routes/validationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/validate', validationRoutes);

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ 
        status: 'success', 
        message: 'Server running with SQLite!',
        database: 'SQLite (local file)',
        timestamp: new Date().toISOString()
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        database: 'SQLite ✅ Connected',
        uptime: process.uptime()
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 CMS Server Running with SQLite!`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`🗄️  Database: SQLite (local file)`);
    console.log(`🔐 Auth: Ready (no email needed)`);
    console.log(`✅ API Ready\n`);
});