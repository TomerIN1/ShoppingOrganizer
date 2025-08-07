// Vercel serverless function to provide environment configuration
export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    // Return environment configuration
    const config = {
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        NODE_ENV: process.env.NODE_ENV || 'production'
    };

    // Validate required environment variables
    if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
        res.status(500).json({ 
            error: 'Server configuration error',
            message: 'Required environment variables not set'
        });
        return;
    }

    res.status(200).json(config);
}