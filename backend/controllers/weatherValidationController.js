const axios = require('axios');
require('dotenv').config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// Indian cities mapping
const cityMapping = {
    'mumbai': 'Mumbai',
    'delhi': 'Delhi',
    'bangalore': 'Bangalore',
    'chennai': 'Chennai',
    'kolkata': 'Kolkata',
    'pune': 'Pune',
    'hyderabad': 'Hyderabad',
    'ahmedabad': 'Ahmedabad',
    'jaipur': 'Jaipur',
    'lucknow': 'Lucknow',
    'surat': 'Surat',
    'kanpur': 'Kanpur',
    'nagpur': 'Nagpur',
    'indore': 'Indore',
    'bhopal': 'Bhopal'
};

// Extract location from message
function extractLocation(message) {
    const lowerMsg = message.toLowerCase();
    for (const [key, city] of Object.entries(cityMapping)) {
        if (lowerMsg.includes(key)) {
            return city;
        }
    }
    return null;
}

// Get real weather data
async function getRealWeather(city) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${WEATHER_API_KEY}&units=metric`;
        const response = await axios.get(url);
        return {
            success: true,
            city: response.data.name,
            temperature: response.data.main.temp,
            feelsLike: response.data.main.feels_like,
            condition: response.data.weather[0].main.toLowerCase(),
            description: response.data.weather[0].description,
            humidity: response.data.main.humidity,
            windSpeed: response.data.wind.speed
        };
    } catch (error) {
        console.error('Weather API error:', error.message);
        return { success: false, error: error.message };
    }
}

// Check if message matches weather - STRICT VERSION
function doesMessageMatchWeather(message, weatherData) {
    const lowerMsg = message.toLowerCase();
    const condition = weatherData.condition;
    const temp = weatherData.temperature;
    
    // Check what the message is claiming
    const mentionsRain = /rain|rainfall|shower|drizzle|downpour|wet/i.test(lowerMsg);
    const mentionsStorm = /storm|thunder|lightning|cyclone|typhoon|hurricane/i.test(lowerMsg);
    const mentionsClear = /clear|sunny|sun|bright|sunshine/i.test(lowerMsg);
    const mentionsClouds = /cloud|cloudy|overcast|grey|gray/i.test(lowerMsg);
    const mentionsFog = /fog|foggy|mist|haze/i.test(lowerMsg);
    const mentionsHeat = /heat|hot|heatwave|scorching|boiling/i.test(lowerMsg);
    const mentionsCold = /cold|chilly|cool|freezing|cold wave/i.test(lowerMsg);
    
    // What is actually happening
    const actualRain = condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower');
    const actualStorm = condition.includes('thunder') || condition.includes('storm') || condition.includes('cyclone');
    const actualClear = condition.includes('clear') || condition.includes('sun');
    const actualClouds = condition.includes('cloud') || condition.includes('overcast') || condition.includes('mist');
    const actualFog = condition.includes('mist') || condition.includes('fog') || condition.includes('haze');
    const actualHeat = temp > 35;
    const actualCold = temp < 15;
    
    // Track claims and accuracy
    let claims = [];
    let conflicts = [];
    
    // Check each claim
    if (mentionsRain) {
        claims.push({ claim: 'rain', actual: actualRain });
        if (!actualRain) conflicts.push(`❌ Rain claimed but actual weather: ${condition}`);
    }
    
    if (mentionsStorm) {
        claims.push({ claim: 'storm', actual: actualStorm });
        if (!actualStorm) conflicts.push(`❌ Storm claimed but actual weather: ${condition}`);
    }
    
    if (mentionsClear) {
        claims.push({ claim: 'clear sky', actual: actualClear });
        if (!actualClear) conflicts.push(`❌ Clear sky claimed but actual weather: ${condition}`);
    }
    
    if (mentionsClouds) {
        claims.push({ claim: 'clouds', actual: actualClouds });
        if (!actualClouds) conflicts.push(`❌ Clouds claimed but actual weather: ${condition}`);
    }
    
    if (mentionsFog) {
        claims.push({ claim: 'fog', actual: actualFog });
        if (!actualFog) conflicts.push(`❌ Fog claimed but actual weather: ${condition}`);
    }
    
    if (mentionsHeat) {
        claims.push({ claim: 'heat', actual: actualHeat });
        if (!actualHeat) conflicts.push(`❌ Heat wave claimed but actual temperature: ${temp}°C`);
    }
    
    if (mentionsCold) {
        claims.push({ claim: 'cold', actual: actualCold });
        if (!actualCold) conflicts.push(`❌ Cold weather claimed but actual temperature: ${temp}°C`);
    }
    
    // Check temperature claims
    let tempMatch = null;
    let tempConflict = null;
    const tempClaimMatch = message.match(/(\d{1,2})\s*°?\s*c/i);
    if (tempClaimMatch) {
        const claimedTemp = parseInt(tempClaimMatch[1]);
        const actualTemp = Math.round(temp);
        tempMatch = Math.abs(claimedTemp - actualTemp) <= 3; // Within 3 degrees is acceptable
        if (!tempMatch) {
            tempConflict = `❌ Temperature ${claimedTemp}°C claimed but actual is ${actualTemp}°C`;
            conflicts.push(tempConflict);
        }
    }
    
    // Calculate accuracy
    let totalClaims = claims.length;
    let accurateClaims = claims.filter(c => c.actual).length;
    
    // Also count temperature claim if present
    if (tempClaimMatch) {
        totalClaims++;
        if (tempMatch) accurateClaims++;
    }
    
    const isAccurate = totalClaims > 0 ? (accurateClaims === totalClaims) : null;
    const conflictMessage = conflicts.length > 0 ? conflicts.join('. ') : null;
    
    return {
        claims: claims,
        totalClaims: totalClaims,
        accurateClaims: accurateClaims,
        isAccurate: isAccurate,
        conflictMessage: conflictMessage,
        actualWeather: {
            condition: condition,
            temperature: temp,
            description: weatherData.description
        }
    };
}

// Enhanced validation with weather API
async function validateMessageWithWeather(req, res) {
    try {
        const { message, category } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message required', passed: false });
        }
        
        console.log('\n' + '='.repeat(50));
        console.log('🌤️ Weather-Enhanced Validation');
        console.log('📝 Message:', message);
        
        // Step 1: Basic rule checks
        const ruleChecks = {
            keywordCheck: /rain|storm|flood|alert|warning|heavy|emergency|weather|temperature|heat|cold/i.test(message),
            locationCheck: /mumbai|delhi|bangalore|chennai|pune|kolkata|hyderabad|ahmedabad|jaipur/i.test(message),
            timeCheck: /\d{1,2}\s*(am|pm)|today|tomorrow|evening|morning|night|now/i.test(message)
        };
        
        // Step 2: Extract location and get real weather
        const location = extractLocation(message);
        let weatherData = null;
        let weatherMatch = null;
        
        if (location && WEATHER_API_KEY && WEATHER_API_KEY !== 'your_openweather_api_key_here') {
            console.log(`📍 Getting weather for: ${location}`);
            weatherData = await getRealWeather(location);
            
            if (weatherData.success) {
                console.log(`☁️ Real weather: ${weatherData.condition}, ${weatherData.temperature}°C, ${weatherData.description}`);
                weatherMatch = doesMessageMatchWeather(message, weatherData);
                console.log('📊 Weather analysis:', weatherMatch);
            }
        }
        
        // Step 3: Calculate credibility score
        let credibilityScore = 40; // Start at neutral
        
        // Rule-based scoring
        if (ruleChecks.keywordCheck) credibilityScore += 10;
        if (ruleChecks.locationCheck) credibilityScore += 10;
        if (ruleChecks.timeCheck) credibilityScore += 10;
        
        // Weather-based scoring (STRICT)
        if (weatherMatch) {
            if (weatherMatch.isAccurate === true) {
                // Perfect match!
                credibilityScore += 35;
                console.log('✅✅✅ PERFECT MATCH! Message matches actual weather!');
            } 
            else if (weatherMatch.isAccurate === false) {
                // Wrong weather claim - BIG penalty
                credibilityScore -= 50;
                console.log('❌❌❌ WEATHER MISMATCH! Message does not match actual weather!');
                if (weatherMatch.conflictMessage) {
                    console.log('Conflicts:', weatherMatch.conflictMessage);
                }
            }
            else if (weatherMatch.isAccurate === null) {
                // No specific weather claims - neutral
                credibilityScore += 5;
                console.log('📝 No specific weather claims to verify');
            }
        } else if (location && (!WEATHER_API_KEY || WEATHER_API_KEY === 'your_openweather_api_key_here')) {
            console.log('⚠️ Weather API not configured');
        } else if (!location) {
            console.log('📍 No location found in message');
        }
        
        // Cap score
        credibilityScore = Math.min(100, Math.max(0, credibilityScore));
        const passed = credibilityScore > 60;
        
        // Step 4: Generate explanation
        let explanation = "";
        let suggestions = [];
        
        if (weatherMatch) {
            if (weatherMatch.isAccurate === true) {
                explanation = `✅ Weather data CONFIRMS your message! Actual ${location} weather: ${weatherData.description}, ${Math.round(weatherData.temperature)}°C. Your description is accurate!`;
                suggestions.push("Your weather information is accurate!");
            } 
            else if (weatherMatch.isAccurate === false) {
                if (weatherMatch.conflictMessage) {
                    explanation = `❌ ${weatherMatch.conflictMessage}. Actual ${location} weather: ${weatherData.description}, ${Math.round(weatherData.temperature)}°C.`;
                } else {
                    explanation = `❌ Weather data does NOT match your message. Actual ${location} weather: ${weatherData.description}, ${Math.round(weatherData.temperature)}°C.`;
                }
                suggestions.push("Please check actual weather forecast before sharing.");
                suggestions.push(`Current conditions: ${weatherData.description}, ${Math.round(weatherData.temperature)}°C`);
            }
            else if (weatherMatch.isAccurate === null) {
                explanation = `📍 Current ${location} weather: ${weatherData.description}, ${Math.round(weatherData.temperature)}°C. Your message doesn't make specific weather claims.`;
                suggestions.push("Add specific weather details (rain, storm, clear sky, etc.) for verification.");
            }
        } 
        else if (!location) {
            explanation = "Message missing location. Add specific city for weather verification.";
            suggestions.push("Add location like Mumbai, Delhi, Bangalore, etc.");
        } 
        else if (!WEATHER_API_KEY || WEATHER_API_KEY === 'your_openweather_api_key_here') {
            explanation = "Weather API not configured. Using rule-based validation only.";
            suggestions.push("Add OpenWeatherMap API key for real weather verification.");
        } 
        else if (weatherData && !weatherData.success) {
            explanation = `Could not fetch weather for ${location}. API error.`;
            suggestions.push("Check your API key or internet connection.");
        }
        
        // Add rule-based suggestions if needed
        if (!ruleChecks.keywordCheck) {
            suggestions.push("Add weather keywords like 'rain', 'storm', 'heat', etc.");
        }
        if (!ruleChecks.locationCheck) {
            suggestions.push("Add specific location (Mumbai, Delhi, etc.)");
        }
        if (!ruleChecks.timeCheck) {
            suggestions.push("Add time reference (today, tomorrow, 6 PM, etc.)");
        }
        
        const result = {
            passed: passed,
            ruleCheck: {
                keywordCheck: ruleChecks.keywordCheck,
                locationCheck: ruleChecks.locationCheck,
                timeCheck: ruleChecks.timeCheck,
                passed: ruleChecks.keywordCheck && ruleChecks.locationCheck && ruleChecks.timeCheck
            },
            weatherCheck: weatherData ? {
                enabled: true,
                location: location,
                realCondition: weatherData.condition,
                realTemperature: Math.round(weatherData.temperature),
                realDescription: weatherData.description,
                matchesMessage: weatherMatch?.isAccurate || false,
                conflicts: weatherMatch?.conflictMessage || null,
                details: weatherMatch
            } : {
                enabled: false,
                message: !location ? "Location not found in message" : "Weather API not configured"
            },
            aiCheck: {
                isTrue: passed,
                confidence: credibilityScore,
                explanation: explanation,
                suggestions: suggestions.slice(0, 3).join(". "),
                passed: passed
            },
            message: message,
            category: category || 'general',
            validatedAt: new Date().toISOString()
        };
        
        console.log(`\n📊 Final Score: ${credibilityScore}%`);
        console.log(`✅ Final Verdict: ${passed ? 'PASSED' : 'FAILED'}`);
        console.log('='.repeat(50) + '\n');
        
        res.json(result);
        
    } catch (error) {
        console.error('Validation error:', error);
        res.status(500).json({ error: error.message, passed: false });
    }
}

async function testWeatherAPI(req, res) {
    if (!WEATHER_API_KEY || WEATHER_API_KEY === 'your_openweather_api_key_here') {
        return res.json({
            status: "error",
            message: "Weather API not configured. Add WEATHER_API_KEY to .env file",
            howToGet: "Get free API key from https://openweathermap.org/api"
        });
    }
    
    try {
        const testCity = "Mumbai";
        const weather = await getRealWeather(testCity);
        res.json({
            status: "success",
            message: "Weather API is working!",
            testResult: weather
        });
    } catch (error) {
        res.json({
            status: "error",
            message: error.message
        });
    }
}

module.exports = { validateMessageWithWeather, testWeatherAPI };