// Environment Configuration Loader
// This file loads environment variables for client-side JavaScript

class EnvironmentConfig {
    constructor() {
        this.config = {};
        this.loaded = false;
    }

    async load() {
        if (this.loaded) return this.config;

        try {
            // In development, load from .env file
            const response = await fetch('.env');
            if (response.ok) {
                const envText = await response.text();
                this.parseEnvFile(envText);
                console.log('✅ Environment variables loaded from .env file');
            } else {
                // Fallback to hardcoded values for production
                this.loadFallbackConfig();
                console.log('⚠️ Using fallback configuration (production mode)');
            }
        } catch (error) {
            console.warn('Unable to load .env file, using fallback configuration');
            this.loadFallbackConfig();
        }

        this.loaded = true;
        return this.config;
    }

    parseEnvFile(envText) {
        const lines = envText.split('\n');
        
        lines.forEach(line => {
            line = line.trim();
            
            // Skip empty lines and comments
            if (!line || line.startsWith('#')) return;
            
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                this.config[key.trim()] = valueParts.join('=').trim();
            }
        });
    }

    loadFallbackConfig() {
        // In production, these would come from environment variables set on the server
        // For now, we'll use placeholders that need to be replaced during deployment
        this.config = {
            SUPABASE_URL: process.env?.SUPABASE_URL || 'YOUR_SUPABASE_URL_HERE',
            SUPABASE_ANON_KEY: process.env?.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE',
            GOOGLE_CLIENT_ID: process.env?.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE',
            GOOGLE_CLIENT_SECRET: process.env?.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET_HERE',
            NODE_ENV: 'production'
        };
    }

    get(key) {
        return this.config[key];
    }

    getAll() {
        return { ...this.config };
    }
}

// Create global instance
window.EnvironmentConfig = new EnvironmentConfig();