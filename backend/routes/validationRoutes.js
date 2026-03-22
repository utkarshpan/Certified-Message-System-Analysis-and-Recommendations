const express = require('express');
const router = express.Router();

// Change this line to use weather validation controller
const weatherValidation = require('../controllers/weatherValidationController');

console.log('🌤️ Weather Validation controller functions:', Object.keys(weatherValidation));

if (weatherValidation.validateMessageWithWeather) {
    router.post('/', weatherValidation.validateMessageWithWeather);
} else {
    console.error('❌ validateMessageWithWeather function missing!');
}

if (weatherValidation.testWeatherAPI) {
    router.get('/test-weather', weatherValidation.testWeatherAPI);
} else {
    console.error('❌ testWeatherAPI function missing!');
}

module.exports = router;