const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create data folder if it doesn't exist
const fs = require('fs');
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const dbPath = path.join(dataDir, 'cms.db');
const db = new sqlite3.Database(dbPath);

// Create tables
db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // Messages table
    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        category TEXT DEFAULT 'general',
        passed BOOLEAN DEFAULT 0,
        confidence INTEGER DEFAULT 0,
        explanation TEXT,
        suggestions TEXT,
        keyword_check BOOLEAN DEFAULT 0,
        location_check BOOLEAN DEFAULT 0,
        time_check BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);
    
    console.log('✅ SQLite database initialized');
});

module.exports = db;