// Simple working message controller

async function saveMessage(req, res) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const supabase = req.app.locals.supabase;
        
        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        
        // Get user
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);
        if (userError) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        const { 
            message, 
            passed, 
            confidence, 
            explanation, 
            suggestions,
            keywordCheck, 
            locationCheck, 
            timeCheck,
            category 
        } = req.body;
        
        console.log('💾 Saving message for:', user.email);
        
        // Save to database
        const { data, error } = await supabase
            .from('messages')
            .insert([{
                user_id: user.id,
                content: message,
                category: category || 'general',
                passed: passed || false,
                confidence: confidence || 0,
                explanation: explanation || '',
                suggestions: suggestions || '',
                keyword_check: keywordCheck || false,
                location_check: locationCheck || false,
                time_check: timeCheck || false,
                validated_at: new Date().toISOString()
            }])
            .select();
        
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ error: error.message });
        }
        
        res.json({
            success: true,
            savedMessage: data[0]
        });
        
    } catch (error) {
        console.error('Save error:', error.message);
        res.status(500).json({ error: error.message });
    }
}

async function getMessages(req, res) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const supabase = req.app.locals.supabase;
        
        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);
        if (userError) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(50);
        
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        
        res.json({
            success: true,
            messages: data || [],
            total: data?.length || 0
        });
        
    } catch (error) {
        console.error('Get error:', error.message);
        res.status(500).json({ error: error.message });
    }
}

async function deleteMessage(req, res) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const supabase = req.app.locals.supabase;
        const { messageId } = req.params;
        
        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);
        if (userError) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', messageId)
            .eq('user_id', user.id);
        
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        
        res.json({ success: true });
        
    } catch (error) {
        console.error('Delete error:', error.message);
        res.status(500).json({ error: error.message });
    }
}

async function getUserStats(req, res) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const supabase = req.app.locals.supabase;
        
        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);
        if (userError) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        const { data: messages } = await supabase
            .from('messages')
            .select('passed, confidence')
            .eq('user_id', user.id);
        
        const total = messages?.length || 0;
        const verified = messages?.filter(m => m.passed).length || 0;
        
        res.json({
            success: true,
            stats: {
                totalMessages: total,
                verifiedMessages: verified,
                rejectedMessages: total - verified,
                avgConfidence: 0
            }
        });
        
    } catch (error) {
        console.error('Stats error:', error.message);
        res.status(500).json({ error: error.message });
    }
}

// Export all functions
module.exports = {
    saveMessage,
    getMessages,
    deleteMessage,
    getUserStats
};