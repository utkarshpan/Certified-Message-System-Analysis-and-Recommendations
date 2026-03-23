// This file tells your website where to find the backend
// If you're testing on your computer → use localhost
// If website is live → use your render backend URL

const API_URL = 'https://cms-backend-1kyr.onrender.com';  // When website is live

// Make it available to all pages
window.API_URL = API_URL;

console.log('🌐 Backend API URL:', API_URL);