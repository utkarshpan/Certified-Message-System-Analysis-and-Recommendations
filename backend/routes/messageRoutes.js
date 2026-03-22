const express = require('express');
const router = express.Router();

// Import controller
const messageController = require('../controllers/messageController');

console.log('📦 Message controller functions:', Object.keys(messageController));

// Define routes - make sure each function exists
if (messageController.saveMessage) {
    router.post('/save', messageController.saveMessage);
} else {
    console.error('❌ saveMessage function missing!');
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

if (messageController.getUserStats) {
    router.get('/stats', messageController.getUserStats);
} else {
    console.error('❌ getUserStats function missing!');
}

module.exports = router;