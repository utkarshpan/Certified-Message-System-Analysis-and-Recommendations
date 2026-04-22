# 🛡️ Certified Message System

## AI-Powered Fake News Detection & Message Verification

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![SQLite](https://img.shields.io/badge/Database-SQLite-blue)

---

## 📌 Project Overview

**Certified Message System** is an AI-powered web application that validates messages before they can be published or shared on social media. It uses **Google Gemini AI** and **OpenWeatherMap API** to detect fake news patterns and verify weather claims in real-time.

### 🎯 Problem Statement

Every day, millions of fake news messages spread on social media platforms like WhatsApp, Twitter, and Facebook. Examples include:
- ❌ "Heavy rain in Mumbai at 6 PM" (when no rain exists)
- ❌ "Forward this message to 10 people or bad luck will come"
- ❌ "100% guaranteed cure for COVID-19"

### ✅ Our Solution

An AI-powered system that validates messages **BEFORE** publishing, providing:
- 🔍 Real-time fake news detection
- 🌤️ Weather claim verification using real API data
- 📊 Credibility scoring (0-100%)
- 📱 Social media sharing integration

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **User Authentication** | Secure signup/login with JWT tokens |
| 🤖 **AI Validation** | Google Gemini AI for fake news detection |
| 🌤️ **Weather API** | OpenWeatherMap for real-time verification |
| 📊 **Credibility Score** | 0-100% confidence rating |
| 📱 **Social Sharing** | Share to Twitter, WhatsApp, Facebook |
| 📈 **Dashboard** | Message history and analytics |
| 🗄️ **Local Database** | SQLite for fast, offline storage |

---

## 🏗️ System Architecture
─────────────────────────────────────────────────────────────┐
│ CERTIFIED MESSAGE SYSTEM │
├─────────────────────────────────────────────────────────────┤
│ │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │ Frontend │◄──►│ Backend │◄──►│ Database │ │
│ │ (HTML/CSS/ │ │ (Node.js/ │ │ (SQLite) │ │
│ │ JS) │ │ Express) │ │ │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ │
│ │ │ │ │
│ ▼ ▼ ▼ │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │ User Flow │ │ APIs │ │ Storage │ │
│ │ Login/Signup│ │ Weather API │ │ Messages │ │
│ │ Validation │ │ Gemini AI │ │ Users │ │
│ │ Publishing │ │ Validation │ │ History │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ │
│ │
└─────────────────────────────────────────────────────────────┘

text

---

## 🔄 User Flow
Signup → Login → Create Message → AI Validation → Publish → Share to Social Media → Dashboard

text

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| HTML5 | Page structure |
| CSS3 | Styling & animations |
| JavaScript | Dynamic content & API calls |
| LocalStorage | Session management |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime |
| Express.js | Web framework |
| JWT | Authentication |
| bcryptjs | Password hashing |

### APIs
| API | Purpose |
|-----|---------|
| Google Gemini AI | Fake news detection |
| OpenWeatherMap | Weather verification |

### Database
| Database | Purpose |
|----------|---------|
| SQLite | Local file-based storage |

---

## 📁 Project Structure
Certified message system/
│
├── backend/
│ ├── server.js # Main Express server
│ ├── database.js # SQLite connection
│ ├── .env # Environment variables
│ │
│ ├── controllers/
│ │ ├── authController.js # Login/Signup logic
│ │ ├── messageController.js # Message CRUD
│ │ └── validationController.js # AI + Weather validation
│ │
│ ├── routes/
│ │ ├── authRoutes.js # Auth endpoints
│ │ ├── messageRoutes.js # Message endpoints
│ │ └── validationRoutes.js # Validation endpoints
│ │
│ └── data/
│ └── cms.db # SQLite database
│
├── frontend/
│ ├── login.html # Login/Signup page
│ ├── dashboard.html # User dashboard
│ ├── submit-message.html # Create message
│ ├── validate.html # Validation result
│ ├── publish-status.html # Share page
│ ├── config.js # API configuration
│ │
│ └── css/
│ └── style.css # Global styles
│
├── package.json # Dependencies
└── README.md # Documentation

text

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v20 or higher)
- npm (v10 or higher)
- OpenWeatherMap API key (free)
- Google Gemini AI API key (free)

### Step 1: Clone the Repository
```bash
git clone https://github.com/utkarshpan/Certified-Message-System-Analysis-and-Recommendations.git
cd Certified-Message-System-Analysis-and-Recommendations
Step 2: Install Backend Dependencies
bash
cd backend
npm install
Step 3: Configure Environment Variables
Create a .env file in the backend folder:

env
PORT=5000
WEATHER_API_KEY=your_openweather_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
Step 4: Start the Backend Server
bash
node server.js
You should see:

text
🚀 CMS Server Running with SQLite!
📍 http://localhost:5000
✅ API Ready
Step 5: Open Frontend
Navigate to frontend/login.html

Double-click to open in browser

📡 API Endpoints
Endpoint	Method	Description
/api/auth/signup	POST	Create new user
/api/auth/login	POST	User login
/api/auth/verify	GET	Verify JWT token
/api/validate	POST	Validate message
/api/messages	GET	Get user messages
/api/messages/save	POST	Save message
/api/test	GET	Test server status
/api/health	GET	Health check
🧪 Test Messages
✅ Will Pass (Valid Messages)
Category	Message
Weather	"Haze in Mumbai at 6 PM"
News	"Traffic jam reported in Mumbai at 9 AM today"
Alert	"Emergency alert in Kolkata at 9 AM tomorrow"
General	"Meeting scheduled in Bangalore at 3 PM today"
❌ Will Fail (Invalid/Fake Messages)
Category	Message
Weather	"Heavy rain in Mumbai at 6 PM" (if no rain)
News	"Forward this news to 10 people..."
Alert	"URGENT! 100% guaranteed emergency..."
General	"Hello, how are you?"
📊 Validation Logic
Credibility Score Calculation
text
Credibility Score = (Rule Score × 0.4) + (AI Score × 0.4) + (Weather Score × 0.2)

Where:
- Rule Score: 0-100 based on keyword/location/time presence
- AI Score: 0-100 based on Gemini AI analysis
- Weather Score: 0-100 based on API match

Score Interpretation:
- 80-100%: ✅ Highly Credible - Publish recommended
- 60-79%:  ⚠️ Moderately Credible - Review before publish
- 40-59%:  ⚠️ Low Credibility - Not recommended
- 0-39%:   ❌ Very Low Credibility - Block publishing
Validation Checks
Check	What It Verifies	Example
Keyword	rain, storm, flood, alert, warning	"Heavy rain in Mumbai" ✅
Location	Mumbai, Delhi, Bangalore, Chennai	"Heavy rain in Mumbai" ✅
Time	6 PM, today, tomorrow, evening	"Heavy rain in Mumbai at 6 PM" ✅
Weather	Real-time API verification	Rain actually forecast?
Fake Patterns	Chain messages, sensationalism	"Forward to 10 people" ❌
🔑 API Keys Setup
OpenWeatherMap API (Free)
Go to: https://openweathermap.org/api

Sign up for a free account

Navigate to "API Keys" section

Copy your API key

Add to .env as WEATHER_API_KEY

Google Gemini AI API (Free)
Go to: https://makersuite.google.com/app/apikey

Sign in with Google account

Click "Create API Key"

Copy your API key

Add to .env as GEMINI_API_KEY

🎯 Live Demo
Frontend URL: https://certified-message-system-analysis-and-1fa8.onrender.com

Backend API: https://cms-backend-1kyr.onrender.com

⚠️ Note: Free tier services may take 30-50 seconds to wake up after inactivity.

📈 Future Enhancements
Add more social media platforms (Instagram, LinkedIn)

Implement password reset functionality

Add admin dashboard for monitoring

Support for multiple languages

Mobile app version (React Native)

Email notifications for verified messages

Export message history as CSV/PDF

🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit changes (git commit -m 'Add some AmazingFeature')

Push to branch (git push origin feature/AmazingFeature)

Open a Pull Request

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

👤 Author
Utkarsh Pandey

GitHub: @utkarshpan

Project Link: Certified Message System

🙏 Acknowledgments
Google Gemini AI for fake news detection

OpenWeatherMap for weather data API

Supabase for authentication (legacy)

SQLite for local database storage

⭐ Show Your Support
If you found this project helpful, please give it a ⭐ on GitHub!

Built with ❤️ for fighting misinformation

text

---

## 📋 **How to Add README to GitHub**

1. **Open your project folder**
2. **Create a new file called `README.md`**
3. **Copy and paste the entire content above**
4. **Save the file**
5. **Push to GitHub:**

```bash
git add README.md
git commit -m "Add detailed README documentation"
git push



