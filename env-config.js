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
            // First try to load from .env file (development)
            const envResponse = await fetch('.env');
            if (envResponse.ok) {
                const envText = await envResponse.text();
                this.parseEnvFile(envText);
                console.log('✅ Environment variables loaded from .env file (development)');
                this.loaded = true;
                return this.config;
            }
        } catch (error) {
            // .env not available, try production API
        }

        try {
            // Try to load from Vercel API endpoint (production)
            const apiResponse = await fetch('/api/config');
            if (apiResponse.ok) {
                this.config = await apiResponse.json();
                console.log('✅ Environment variables loaded from API (production)');
                this.loaded = true;
                return this.config;
            }
        } catch (error) {
            console.warn('Unable to load from API:', error.message);
        }

        // Final fallback - configuration error
        console.error('❌ Unable to load environment variables');
        this.config = {
            SUPABASE_URL: '',
            SUPABASE_ANON_KEY: '',
            GOOGLE_CLIENT_ID: '',
            NODE_ENV: 'production'
        };

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

    // This method is no longer used - configuration comes from API in production
    loadFallbackConfig() {
        console.error('Environment configuration failed - please check Vercel environment variables');
        this.config = {
            SUPABASE_URL: '',
            SUPABASE_ANON_KEY: '',
            GOOGLE_CLIENT_ID: '',
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