const db = require('../database');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'cms-demo-secret-key-2024';

// Get user ID from token
function getUserIdFromToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded.id;
    } catch (error) {
        return null;
    }
}

async function saveMessage(req, res) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        
        const userId = getUserIdFromToken(token);
        if (!userId) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        const { 
            message, 
            passed, 
            confidence, 
            explanation, 
            suggestions,
            keywordCheck, 
            locationCheck, 
            timeCheck,
            category 
        } = req.body;
        
        console.log('💾 Saving message for user:', userId);
        
        db.run(
            `INSERT INTO messages (
                user_id, content, category, passed, confidence, 
                explanation, suggestions, keyword_check, location_check, time_check
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, message, category || 'general', passed ? 1 : 0, confidence, 
             explanation || '', suggestions || '', keywordCheck ? 1 : 0, locationCheck ? 1 : 0, timeCheck ? 1 : 0],
            function(err) {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: err.message });
                }
                
                res.json({
                    success: true,
                    savedMessage: {
                        id: this.lastID,
                        content: message,
                        passed: passed,
                        confidence: confidence
                    }
                });
            }
        );
        
    } catch (error) {
        console.error('Save error:', error.message);
        res.status(500).json({ error: error.message });
    }
}

async function getMessages(req, res) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        
        const userId = getUserIdFromToken(token);
        if (!userId) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        db.all(
            `SELECT * FROM messages WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`,
            [userId],
            (err, messages) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                
                res.json({
                    success: true,
                    messages: messages || [],
                    total: messages?.length || 0,
                    verified: messages?.filter(m => m.passed === 1).length || 0
                });
            }
        );
        
    } catch (error) {
        console.error('Get messages error:', error.message);
        res.status(500).json({ error: error.message });
    }
}

async function deleteMessage(req, res) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const { messageId } = req.params;
        
        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        
        const userId = getUserIdFromToken(token);
        if (!userId) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        db.run(
            `DELETE FROM messages WHERE id = ? AND user_id = ?`,
            [messageId, userId],
            function(err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                
                res.json({ success: true, message: 'Message deleted' });
            }
        );
        
    } catch (error) {
        console.error('Delete error:', error.message);
        res.status(500).json({ error: error.message });
    }
}

async function getUserStats(req, res) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        
        const userId = getUserIdFromToken(token);
        if (!userId) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        db.get(
            `SELECT 
                COUNT(*) as totalMessages,
                SUM(CASE WHEN passed = 1 THEN 1 ELSE 0 END) as verifiedMessages,
                AVG(confidence) as avgConfidence
             FROM messages WHERE user_id = ?`,
            [userId],
            (err, stats) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                
                const total = stats?.totalMessages || 0;
                const verified = stats?.verifiedMessages || 0;
                
                res.json({
                    success: true,
                    stats: {
                        totalMessages: total,
                        verifiedMessages: verified,
                        rejectedMessages: total - verified,
                        avgConfidence: Math.round(stats?.avgConfidence || 0),
                        accuracy: total > 0 ? Math.round((verified / total) * 100) : 0
                    }
                });
            }
        );
        
    } catch (error) {
        console.error('Stats error:', error.message);
        res.status(500).json({ error: error.message });
    }
}

module.exports = { saveMessage, getMessages, deleteMessage, getUserStats };