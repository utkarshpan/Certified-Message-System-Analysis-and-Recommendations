require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

console.log('🔍 Testing New API Key...');
console.log('Key starts with:', API_KEY ? API_KEY.substring(0, 10) + '...' : 'NOT FOUND');

async function testKey() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: "Say 'API key is working!' in one sentence." }]
                }]
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('\n✅✅✅ API KEY IS WORKING! ✅✅✅');
            console.log('Response:', data.candidates[0].content.parts[0].text);
            return true;
        } else {
            console.log('\n❌ API KEY IS INVALID');
            console.log('Error:', data.error?.message);
            console.log('\n💡 Check:');
            console.log('1. Did you copy the entire key?');
            console.log('2. Is Gemini API enabled?');
            console.log('3. Try creating a new key at: https://makersuite.google.com/app/apikey');
            return false;
        }
    } catch (error) {
        console.error('\n❌ Connection error:', error.message);
        return false;
    }
}

testKey();