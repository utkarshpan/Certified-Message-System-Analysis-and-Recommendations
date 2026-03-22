async function signup(req, res) {
    try {
        const { name, email, password } = req.body;
        const supabase = req.app.locals.supabase;
        
        console.log('📝 Signup:', email);
        
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields required' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }
        
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name } }
        });
        
        if (authError) throw authError;
        
        res.json({
            success: true,
            token: authData.session?.access_token,
            user: {
                id: authData.user.id,
                name: name,
                email: email
            }
        });
        
    } catch (error) {
        console.error('Signup error:', error.message);
        res.status(400).json({ error: error.message });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const supabase = req.app.locals.supabase;
        
        console.log('🔐 Login:', email);
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;
        
        res.json({
            success: true,
            token: data.session.access_token,
            user: {
                id: data.user.id,
                email: data.user.email
            }
        });
        
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(400).json({ error: error.message });
    }
}

async function verifyToken(req, res) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const supabase = req.app.locals.supabase;
        
        if (!token) {
            return res.status(401).json({ valid: false });
        }
        
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error) throw error;
        
        res.json({ valid: true, user });
        
    } catch (error) {
        res.status(401).json({ valid: false });
    }
}

module.exports = { signup, login, verifyToken };