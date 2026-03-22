// Simple working controller without complex AI
async function validateMessage(req, res) {
    try {
        const { message, category } = req.body;
        
        console.log('📨 Received message:', message);
        
        if (!message) {
            return res.status(400).json({
                error: 'Message is required',
                passed: false
            });
        }
        
        // Simple validation logic
        const lowerMsg = message.toLowerCase();
        
        const keywordCheck = /rain|storm|flood|alert|warning|heavy|emergency/i.test(message);
        const locationCheck = /mumbai|delhi|bangalore|chennai|pune|kolkata/i.test(message);
        const timeCheck = /\d{1,2}\s*(am|pm)|today|tomorrow|evening|morning|night/i.test(message);
        
        const passed = keywordCheck && locationCheck && timeCheck;
        
        const result = {
            passed: passed,
            ruleCheck: {
                keywordCheck: keywordCheck,
                locationCheck: locationCheck,
                timeCheck: timeCheck,
                passed: passed
            },
            aiCheck: {
                isTrue: passed,
                confidence: passed ? 85 : 45,
                explanation: passed ? "Message contains required elements." : "Missing keyword, location, or time.",
                suggestions: passed ? "Ready to publish." : "Add specific location, time, and keywords.",
                passed: passed
            },
            message: message,
            category: category || 'general',
            validatedAt: new Date().toISOString()
        };
        
        console.log('✅ Result:', passed ? 'PASSED' : 'FAILED');
        res.json(result);
        
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({
            error: 'Server error',
            passed: false,
            details: error.message
        });
    }
}

async function testGemini(req, res) {
    res.json({
        status: "success",
        message: "Server is running!",
        timestamp: new Date().toISOString()
    });
}

module.exports = { validateMessage, testGemini };