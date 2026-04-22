const express = require('express');
const router = express.Router();

// Import controller
const messageController = require('../controllers/messageController');

console.log('📦 Message controller functions:', Object.keys(messageController));

// Define routes - IMPORTANT: /stats MUST come before /:messageId
if (messageController.saveMessage) {
    router.post('/save', messageController.saveMessage);
} else {
    console.error('❌ saveMessage function missing!');
}

// /stats MUST be before /:messageId (otherwise 'stats' is treated as a messageId)
if (messageController.getUserStats) {
    router.get('/stats', messageController.getUserStats);
} else {
    console.error('❌ getUserStats function missing!');
}

if (messageController.getMessages) {
    router.get('/', messageController.getMessages);
} else {
    console.error('❌ getMessages function missing!');
}

if (messageController.deleteMessage) {
    router.delete('/:messageId', messageController.deleteMessage);
} else {
    console.error('❌ deleteMessage function missing!');
}

module.exports = router;