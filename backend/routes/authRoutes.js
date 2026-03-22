const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

console.log('🔐 Auth controller functions:', Object.keys(authController));

if (authController.signup) {
    router.post('/signup', authController.signup);
} else {
    console.error('❌ signup function missing!');
}

if (authController.login) {
    router.post('/login', authController.login);
} else {
    console.error('❌ login function missing!');
}

if (authController.verifyToken) {
    router.get('/verify', authController.verifyToken);
} else {
    console.error('❌ verifyToken function missing!');
}

module.exports = router;