const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to validate message with Gemini AI
async function validateWithGemini(message) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `
        You are an advanced fake news detection AI. Analyze this message and return ONLY a valid JSON object.
        
        Message: "${message}"
        
        Analyze these aspects:
        1. Is this message likely TRUE or FALSE?
        2. What is your confidence score (0-100)?
        3. Does it contain specific location?
        4. Does it contain specific time?
        5. Is there any sensational/fake news language?
        6. What's your reasoning?
        7. How can it be improved?
        
        Return ONLY this exact JSON format (no markdown, no extra text):
        {
            "isTrue": boolean,
            "confidence": number,
            "hasLocation": boolean,
            "hasTime": boolean,
            "hasFakePatterns": boolean,
            "explanation": "string",
            "suggestions": "string"
        }
        `;
        
        console.log('🤖 Sending to Gemini AI...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Clean the response (remove any markdown formatting)
        let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        // Parse JSON
        const aiResult = JSON.parse(cleanText);
        console.log('✅ Gemini AI Response:', aiResult);
        
        return aiResult;
        
    } catch (error) {
        console.error('❌ Gemini AI Error:', error.message);
        
        // Fallback to smart validation if Gemini fails
        return fallbackValidation(message);
    }
}

// Fallback validation (if Gemini API fails)
function fallbackValidation(message) {
    const lowerMsg = message.toLowerCase();
    
    const hasKeyword = /rain|storm|flood|alert|warning|heavy|emergency/i.test(message);
    const hasLocation = /mumbai|delhi|bangalore|chennai|pune|kolkata/i.test(message);
    const hasTime = /\d{1,2}\s*(am|pm)|today|tomorrow|evening|morning/i.test(message);
    
    const fakePatterns = /forward|share.*everyone|100%.*guaranteed|miracle|secret revealed/i.test(lowerMsg);
    
    let confidence = 50;
    if (hasKeyword && hasLocation && hasTime && !fakePatterns) confidence = 85;
    else if (hasKeyword && hasLocation) confidence = 65;
    else if (hasKeyword) confidence = 45;
    else if (fakePatterns) confidence = 20;
    
    return {
        isTrue: confidence > 60,
        confidence: confidence,
        hasLocation: hasLocation,
        hasTime: hasTime,
        hasFakePatterns: fakePatterns,
        explanation: "Fallback validation - AI service unavailable",
        suggestions: "Add more specific details for better validation"
    };
}

// Main validation endpoint
async function validateMessageWithGemini(req, res) {
    try {
        const { message, category } = req.body;
        
        if (!message) {
            return res.status(400).json({
                error: 'Message is required',
                passed: false
            });
        }
        
        console.log('\n📨 New Validation Request:');
        console.log('Message:', message);
        console.log('Category:', category);
        
        // Step 1: Get AI analysis from Gemini
        const aiResult = await validateWithGemini(message);
        
        // Step 2: Rule-based validation (quick checks)
        const lowerMsg = message.toLowerCase();
        const ruleChecks = {
            keywordCheck: /rain|storm|flood|alert|warning|heavy|emergency/i.test(message),
            locationCheck: /mumbai|delhi|bangalore|chennai|pune|kolkata|hyderabad/i.test(message),
            timeCheck: /\d{1,2}\s*(am|pm)|today|tomorrow|evening|morning|night/i.test(message)
        };
        
        const rulePassed = ruleChecks.keywordCheck && ruleChecks.locationCheck && ruleChecks.timeCheck;
        
        // Step 3: Combine AI and Rule results
        const aiPassed = aiResult.isTrue && aiResult.confidence > 65;
        const passed = rulePassed && aiPassed;
        
        // Step 4: Prepare response
        const result = {
            passed: passed,
            ruleCheck: {
                keywordCheck: ruleChecks.keywordCheck,
                locationCheck: ruleChecks.locationCheck,
                timeCheck: ruleChecks.timeCheck,
                passed: rulePassed
            },
            aiCheck: {
                isTrue: aiResult.isTrue,
                confidence: aiResult.confidence,
                explanation: aiResult.explanation,
                suggestions: aiResult.suggestions,
                hasFakePatterns: aiResult.hasFakePatterns || false,
                passed: aiPassed
            },
            message: message,
            category: category || 'general',
            validatedAt: new Date().toISOString(),
            aiService: "Google Gemini AI"
        };
        
        console.log('\n✅ Final Result:');
        console.log('Passed:', passed);
        console.log('AI Confidence:', aiResult.confidence + '%');
        console.log('Explanation:', aiResult.explanation);
        
        res.json(result);
        
    } catch (error) {
        console.error('❌ Validation Error:', error);
        res.status(500).json({
            error: 'Validation failed',
            passed: false,
            details: error.message
        });
    }
}

// Test endpoint to verify Gemini is working
async function testGeminiConnection(req, res) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Say 'Gemini AI is working!' in JSON format: {\"status\":\"success\",\"message\":\"...\"}");
        const response = await result.response;
        const text = response.text();
        
        res.json({
            status: "success",
            message: "Gemini AI is connected and working!",
            response: text
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Gemini AI connection failed",
            error: error.message
        });
    }
}

module.exports = { validateMessageWithGemini, testGeminiConnection };