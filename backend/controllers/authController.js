const db = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'cms-demo-secret-key-2024';

async function signup(req, res) {
    try {
        const { name, email, password } = req.body;
        
        console.log('📝 Signup:', email);
        
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields required' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.run(
            `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
            [name, email, hashedPassword],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) {
                        return res.status(400).json({ error: 'Email already exists' });
                    }
                    return res.status(400).json({ error: err.message });
                }
                
                const token = jwt.sign({ id: this.lastID, email, name }, JWT_SECRET, { expiresIn: '7d' });
                
                res.json({
                    success: true,
                    token,
                    user: {
                        id: this.lastID,
                        name: name,
                        email: email
                    }
                });
            }
        );
        
    } catch (error) {
        console.error('Signup error:', error.message);
        res.status(400).json({ error: error.message });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        
        console.log('🔐 Login:', email);
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }
        
        db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
            if (err || !user) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }
            
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }
            
            const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
            
            res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        });
        
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(400).json({ error: error.message });
    }
}

async function verifyToken(req, res) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ valid: false });
        }
        
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ valid: true, user: decoded });
        
    } catch (error) {
        res.status(401).json({ valid: false });
    }
}

module.exports = { signup, login, verifyToken };