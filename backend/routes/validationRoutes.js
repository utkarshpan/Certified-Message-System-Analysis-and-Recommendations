const express = require('express');
const router = express.Router();

const weatherValidation = require('../controllers/weatherValidationController');

console.log('🌤️ Weather Validation controller functions:', Object.keys(weatherValidation));

// ✅ FIXED ROUTE
router.post('/', weatherValidation.validateMessageWithWeather);

// Optional test route
router.get('/test-weather', weatherValidation.testWeatherAPI);

module.exports = router;