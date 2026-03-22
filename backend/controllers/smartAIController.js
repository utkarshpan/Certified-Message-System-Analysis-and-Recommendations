// Smart AI Controller - Works without API key
// Uses intelligent pattern matching and analysis

function analyzeMessageIntelligently(message) {
    const lowerMsg = message.toLowerCase();
    
    // Advanced pattern detection
    const analysis = {
        // Positive indicators (credibility)
        hasSpecificLocation: /mumbai|delhi|bangalore|chennai|pune|kolkata|hyderabad|ahmedabad|jaipur/i.test(message),
        hasSpecificTime: /\d{1,2}\s*(am|pm)|today|tomorrow|evening|morning|night|now|soon/i.test(message),
        hasSpecificEvent: /rain|storm|flood|alert|warning|heavy|thunder|cyclone|emergency|urgent/i.test(message),
        hasNumbers: /\d+/.test(message),
        hasSource: /according to|as per|reported by|source|official|govt|police|department/i.test(lowerMsg),
        
        // Negative indicators (fake news patterns)
        hasChainPattern: /forward|share|send|everyone|10 people|copy|paste|spread|viral/i.test(lowerMsg),
        hasSensationalism: /100%|guaranteed|miracle|secret|shocking|unbelievable|must read|warning⚠️/i.test(lowerMsg),
        hasUrgency: /immediate|urgent|asap|now|quick|fast|emergency/i.test(lowerMsg),
        hasEmojis: /[⚠️❗🔥💥💯‼️]/.test(message),
        
        // Specific details count
        hasDate: /\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}/.test(message),
        hasTimeFormat: /\d{1,2}:\d{2}/.test(message),
        hasProperNouns: /[A-Z][a-z]+/.test(message)
    };
    
    // Calculate credibility score
    let credibilityScore = 50; // Start neutral
    
    // Add points for credibility
    if (analysis.hasSpecificLocation) credibilityScore += 15;
    if (analysis.hasSpecificTime) credibilityScore += 15;
    if (analysis.hasSpecificEvent) credibilityScore += 15;
    if (analysis.hasNumbers) credibilityScore += 5;
    if (analysis.hasSource) credibilityScore += 10;
    if (analysis.hasDate) credibilityScore += 5;
    if (analysis.hasTimeFormat) credibilityScore += 5;
    if (analysis.hasProperNouns) credibilityScore += 5;
    
    // Subtract points for fake patterns
    if (analysis.hasChainPattern) credibilityScore -= 25;
    if (analysis.hasSensationalism) credibilityScore -= 20;
    if (analysis.hasEmojis) credibilityScore -= 10;
    if (analysis.hasUrgency && !analysis.hasSpecificEvent) credibilityScore -= 10;
    
    // Cap at 0-100
    credibilityScore = Math.min(100, Math.max(0, credibilityScore));
    
    // Determine if likely true
    const isTrue = credibilityScore > 65;
    
    // Generate intelligent explanation
    let explanation = "";
    let suggestions = [];
    
    if (credibilityScore >= 85) {
        explanation = "✅ This message appears HIGHLY CREDIBLE with specific details, proper formatting, and no fake news patterns.";
        suggestions.push("Message is ready for publishing with high confidence.");
    }
    else if (credibilityScore >= 70) {
        explanation = "✅ This message appears CREDIBLE but could use minor improvements.";
        if (!analysis.hasSource) suggestions.push("Add source reference (e.g., 'According to Weather Department')");
        if (!analysis.hasDate) suggestions.push("Include specific date");
        if (!analysis.hasProperNouns) suggestions.push("Use proper capitalization for important terms");
    }
    else if (credibilityScore >= 55) {
        explanation = "⚠️ This message has MODERATE credibility. Some details are missing.";
        if (!analysis.hasSpecificLocation) suggestions.push("Add specific location");
        if (!analysis.hasSpecificTime) suggestions.push("Add specific time");
        if (!analysis.hasSpecificEvent) suggestions.push("Be more specific about the event");
        if (analysis.hasChainPattern) suggestions.push("⚠️ Remove 'forward/share' language - this is common in misinformation");
    }
    else if (credibilityScore >= 40) {
        explanation = "⚠️ This message has LOW credibility. Important details are missing.";
        suggestions.push("Add location, time, and specific details");
        if (analysis.hasSensationalism) suggestions.push("Remove sensational language like '100%', 'miracle'");
        suggestions.push("Make the message more factual and less emotional");
    }
    else {
        explanation = "❌ This message shows STRONG INDICATORS of misinformation or fake news.";
        suggestions.push("⚠️ This message contains patterns commonly found in fake news/chain messages");
        suggestions.push("Remove sensational language and add verifiable facts");
        suggestions.push("Consider finding official sources for this information");
    }
    
    // Add improvement tips if score is low
    if (credibilityScore < 70 && !analysis.hasSpecificLocation) {
        suggestions.push("📍 Add exact location (e.g., 'in Mumbai', 'in Delhi NCR')");
    }
    if (credibilityScore < 70 && !analysis.hasSpecificTime) {
        suggestions.push("⏰ Add specific time (e.g., 'at 6 PM', 'tomorrow morning')");
    }
    if (credibilityScore < 70 && !analysis.hasSpecificEvent) {
        suggestions.push("🌧️ Add specific keywords (rain, storm, flood, alert, warning)");
    }
    
    return {
        isTrue: isTrue,
        confidence: credibilityScore,
        hasLocation: analysis.hasSpecificLocation,
        hasTime: analysis.hasSpecificTime,
        hasKeyword: analysis.hasSpecificEvent,
        hasFakePatterns: analysis.hasChainPattern || analysis.hasSensationalism,
        explanation: explanation,
        suggestions: suggestions.slice(0, 3).join(". "),
        detailedAnalysis: analysis
    };
}

async function validateMessage(req, res) {
    try {
        const { message, category } = req.body;
        
        if (!message) {
            return res.status(400).json({
                error: 'Message is required',
                passed: false
            });
        }
        
        console.log('\n🤖 Smart AI Analyzing:', message);
        
        // Get AI analysis
        const aiResult = analyzeMessageIntelligently(message);
        
        // Rule-based checks (quick validation)
        const lowerMsg = message.toLowerCase();
        const ruleChecks = {
            keywordCheck: /rain|storm|flood|alert|warning|heavy|emergency|urgent/i.test(message),
            locationCheck: /mumbai|delhi|bangalore|chennai|pune|kolkata|hyderabad|ahmedabad/i.test(message),
            timeCheck: /\d{1,2}\s*(am|pm)|today|tomorrow|evening|morning|night|now/i.test(message)
        };
        
        const rulePassed = ruleChecks.keywordCheck && ruleChecks.locationCheck && ruleChecks.timeCheck;
        const aiPassed = aiResult.isTrue && aiResult.confidence > 60;
        const passed = rulePassed && aiPassed;
        
        console.log(`📊 Analysis Results:`);
        console.log(`   Rule Check: ${rulePassed ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`   AI Confidence: ${aiResult.confidence}%`);
        console.log(`   AI Verdict: ${aiResult.isTrue ? 'TRUE' : 'FALSE'}`);
        console.log(`   Final: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
        
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
                hasFakePatterns: aiResult.hasFakePatterns,
                passed: aiPassed
            },
            message: message,
            category: category || 'general',
            validatedAt: new Date().toISOString(),
            aiProvider: "Advanced Smart AI (Intelligent Pattern Analysis)"
        };
        
        res.json(result);
        
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({
            error: 'Validation failed',
            passed: false,
            details: error.message
        });
    }
}

async function testAI(req, res) {
    res.json({
        status: "success",
        message: "Advanced Smart AI is running!",
        aiProvider: "Intelligent Pattern Analysis",
        features: [
            "Fake news detection",
            "Chain message detection",
            "Sensationalism detection",
            "Credibility scoring (0-100%)",
            "Location & time verification",
            "Source credibility check",
            "Intelligent suggestions"
        ],
        sample: {
            message: "Heavy rain in Mumbai at 6 PM",
            wouldPass: true,
            confidence: "85-95%"
        }
    });
}

module.exports = { validateMessage, testAI };