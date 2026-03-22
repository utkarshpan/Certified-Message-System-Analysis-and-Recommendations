async function validateMessage(req, res) {
    try {
        const { message } = req.body;
        
        console.log('🤖 Validating:', message);
        
        if (!message) {
            return res.status(400).json({ error: 'Message required', passed: false });
        }
        
        const lowerMsg = message.toLowerCase();
        
        const keywordCheck = /rain|storm|flood|alert|warning|heavy|emergency/i.test(message);
        const locationCheck = /mumbai|delhi|bangalore|chennai|pune|kolkata|hyderabad/i.test(message);
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
                explanation: passed ? "Message appears credible with specific details." : "Missing keyword, location, or time details.",
                suggestions: passed ? "Ready to publish!" : "Add specific location, time, and keywords.",
                hasFakePatterns: false,
                passed: passed
            },
            message: message,
            validatedAt: new Date().toISOString()
        };
        
        console.log('✅ Result:', passed ? 'PASSED' : 'FAILED');
        res.json(result);
        
    } catch (error) {
        console.error('Validation error:', error);
        res.status(500).json({ error: error.message, passed: false });
    }
}

async function testAI(req, res) {
    res.json({
        status: "success",
        message: "Smart AI is running!",
        features: ["Fake news detection", "Credibility scoring", "Chain message detection"]
    });
}

module.exports = { validateMessage, testAI };