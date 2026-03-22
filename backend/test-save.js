require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSave() {
    console.log('🔍 Testing save to messages table...\n');
    
    // First, get a user from profiles
    console.log('1. Checking profiles table...');
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
    
    if (profileError) {
        console.error('❌ Error getting profiles:', profileError.message);
        return;
    }
    
    if (!profiles || profiles.length === 0) {
        console.log('⚠️ No users found in profiles table!');
        console.log('Please sign up first through the app at: frontend/login.html\n');
        return;
    }
    
    const user = profiles[0];
    console.log('✅ Found user:', user.email);
    console.log('   User ID:', user.id);
    
    // Try to insert a test message
    console.log('\n2. Inserting test message...');
    const { data, error } = await supabase
        .from('messages')
        .insert([{
            user_id: user.id,
            content: "Test message from script",
            category: "test",
            passed: true,
            confidence: 85,
            explanation: "This is a test message",
            suggestions: "Test suggestions",
            keyword_check: true,
            location_check: true,
            time_check: true
        }])
        .select();
    
    if (error) {
        console.error('❌ Error inserting message:', error.message);
        console.log('\n🔍 Checking if messages table exists and has correct columns...');
        
        // Check if messages table exists
        const { data: tables, error: tableError } = await supabase
            .from('messages')
            .select('*')
            .limit(1);
        
        if (tableError && tableError.message.includes('relation') && tableError.message.includes('does not exist')) {
            console.log('❌ messages table does not exist!');
            console.log('\nPlease run this SQL in Supabase SQL Editor:\n');
            console.log(`CREATE TABLE public.messages (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    passed BOOLEAN DEFAULT false,
    confidence INTEGER DEFAULT 0,
    explanation TEXT,
    suggestions TEXT,
    keyword_check BOOLEAN DEFAULT false,
    location_check BOOLEAN DEFAULT false,
    time_check BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    validated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`);
        }
        return;
    }
    
    console.log('✅ Message inserted successfully!');
    console.log('   Message ID:', data[0].id);
    console.log('   Content:', data[0].content);
    
    // Get all messages
    console.log('\n3. Fetching all messages...');
    const { data: messages, error: getError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
    
    if (getError) {
        console.error('❌ Error getting messages:', getError.message);
    } else {
        console.log(`\n📊 Total messages in table: ${messages?.length || 0}`);
        if (messages && messages.length > 0) {
            console.log('\nRecent messages:');
            messages.forEach(msg => {
                console.log(`   - ${msg.content.substring(0, 50)}... (${msg.passed ? '✅ PASSED' : '❌ FAILED'})`);
            });
        }
    }
}

testSave();