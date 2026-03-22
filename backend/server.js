require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔌 Connecting to Supabase...');
console.log('📡 URL:', supabaseUrl);
console.log('🔑 Key:', supabaseKey ? '✅ Loaded' : '❌ Missing');

// Make supabase available to all routes
app.locals.supabase = supabase;

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
        message: 'Server running with Supabase!',
        database: 'PostgreSQL (Supabase)',
        timestamp: new Date().toISOString()
    });
});

// Health check
app.get('/api/health', async (req, res) => {
    try {
        // Test database connection
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        
        res.json({ 
            status: 'healthy',
            database: error ? '❌ Connection issue' : '✅ Connected',
            uptime: process.uptime()
        });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 CMS Server Running!`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`🗄️  Database: Supabase PostgreSQL`);
    console.log(`🔐 Auth: Ready`);
    console.log(`✅ API Ready\n`);
});