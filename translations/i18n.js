// Internationalization (i18n) loader for Shopping List Organizer
// Handles dynamic loading and management of translation files

class I18nLoader {
    constructor() {
        this.loadedTranslations = new Map();
        this.supportedLanguages = ['en', 'he'];
        this.fallbackLanguage = 'en';
        
        console.log('🌐 I18nLoader initialized');
    }
    
    /**
     * Load translation file for a specific language
     * @param {string} language - Language code (e.g., 'en', 'he')
     * @returns {Promise<Object>} Translation object
     */
    async loadTranslation(language) {
        if (!this.supportedLanguages.includes(language)) {
            throw new Error(`Unsupported language: ${language}`);
        }
        
        // Return cached translation if already loaded
        if (this.loadedTranslations.has(language)) {
            console.log(`✅ Using cached translation for ${language}`);
            return this.loadedTranslations.get(language);
        }
        
        try {
            console.log(`📥 Loading translation file for ${language}...`);
            
            let translation;
            
            // Dynamic import based on language
            switch (language) {
                case 'en':
                    const enModule = await import('./en.js');
                    translation = enModule.default;
                    break;
                    
                case 'he':
                    const heModule = await import('./he.js');
                    translation = heModule.default;
                    break;
                    
                default:
                    throw new Error(`No translation file found for language: ${language}`);
            }
            
            // Validate translation structure
            this.validateTranslation(translation, language);
            
            // Cache the translation
            this.loadedTranslations.set(language, translation);
            
            console.log(`✅ Translation loaded successfully for ${language}`);
            return translation;
            
        } catch (error) {
            console.error(`❌ Failed to load translation for ${language}:`, error);
            
            // Try fallback language if not already trying it
            if (language !== this.fallbackLanguage) {
                console.log(`🔄 Falling back to ${this.fallbackLanguage}...`);
                return await this.loadTranslation(this.fallbackLanguage);
            }
            
            throw error;
        }
    }
    
    /**
     * Validate translation object structure
     * @param {Object} translation - Translation object to validate
     * @param {string} language - Language code for logging
     */
    validateTranslation(translation, language) {
        const requiredSections = [
            'header',
            'navigation', 
            'actions',
            'input',
            'categories',
            'examples',
            'sharing',
            'items',
            'status',
            'validation',
            'notifications',
            'confirmations',
            'language',
            'time'
        ];
        
        const missingSections = requiredSections.filter(section => !translation[section]);
        
        if (missingSections.length > 0) {
            console.warn(`⚠️ Missing translation sections in ${language}:`, missingSections);
        }
        
        // Validate categories specifically (critical for app functionality)
        if (!translation.categories || Object.keys(translation.categories).length === 0) {
            throw new Error(`Categories section is missing or empty in ${language} translation`);
        }
        
        console.log(`✅ Translation structure validated for ${language}`);
    }
    
    /**
     * Preload translations for better performance
     * @param {Array<string>} languages - Array of language codes to preload
     */
    async preloadTranslations(languages = this.supportedLanguages) {
        console.log(`🚀 Preloading translations for:`, languages);
        
        const loadPromises = languages.map(async (language) => {
            try {
                await this.loadTranslation(language);
                return { language, success: true };
            } catch (error) {
                console.error(`❌ Failed to preload ${language}:`, error);
                return { language, success: false, error };
            }
        });
        
        const results = await Promise.all(loadPromises);
        const successful = results.filter(r => r.success).map(r => r.language);
        const failed = results.filter(r => !r.success).map(r => r.language);
        
        console.log(`✅ Successfully preloaded: ${successful.join(', ')}`);
        if (failed.length > 0) {
            console.warn(`⚠️ Failed to preload: ${failed.join(', ')}`);
        }
        
        return { successful, failed };
    }
    
    /**
     * Get translation by key with fallback support
     * @param {string} key - Translation key (supports dot notation)
     * @param {string} language - Target language
     * @param {string} fallback - Fallback text if translation not found
     * @returns {string} Translated text
     */
    async getTranslation(key, language, fallback = null) {
        try {
            const translation = await this.loadTranslation(language);
            const value = this.getNestedValue(translation, key);
            
            if (value !== null && value !== undefined) {
                return value;
            }
            
            // Try fallback language if current language didn't have the key
            if (language !== this.fallbackLanguage) {
                const fallbackTranslation = await this.loadTranslation(this.fallbackLanguage);
                const fallbackValue = this.getNestedValue(fallbackTranslation, key);
                
                if (fallbackValue !== null && fallbackValue !== undefined) {
                    console.warn(`⚠️ Using ${this.fallbackLanguage} fallback for key: ${key}`);
                    return fallbackValue;
                }
            }
            
            // Return fallback or key itself
            const result = fallback || key;
            console.warn(`⚠️ Translation not found for key: ${key}, using: ${result}`);
            return result;
            
        } catch (error) {
            console.error(`❌ Error getting translation for ${key}:`, error);
            return fallback || key;
        }
    }
    
    /**
     * Get nested value from object using dot notation
     * @param {Object} obj - Object to traverse
     * @param {string} key - Dot-notation key (e.g., 'header.title')
     * @returns {*} Value or null if not found
     */
    getNestedValue(obj, key) {
        return key.split('.').reduce((current, prop) => {
            return current && current[prop] !== undefined ? current[prop] : null;
        }, obj);
    }
    
    /**
     * Get all available languages with their metadata
     * @returns {Array<Object>} Array of language objects
     */
    getSupportedLanguages() {
        return [
            {
                code: 'en',
                name: 'English',
                nativeName: 'English',
                flag: '🇺🇸',
                direction: 'ltr'
            },
            {
                code: 'he', 
                name: 'Hebrew',
                nativeName: 'עברית',
                flag: '🇮🇱',
                direction: 'rtl'
            }
        ];
    }
    
    /**
     * Clear translation cache
     * @param {string} language - Specific language to clear, or null for all
     */
    clearCache(language = null) {
        if (language) {
            this.loadedTranslations.delete(language);
            console.log(`🗑️ Cleared translation cache for ${language}`);
        } else {
            this.loadedTranslations.clear();
            console.log('🗑️ Cleared all translation cache');
        }
    }
    
    /**
     * Get cache status
     * @returns {Object} Cache information
     */
    getCacheStatus() {
        return {
            loadedLanguages: Array.from(this.loadedTranslations.keys()),
            cacheSize: this.loadedTranslations.size,
            supportedLanguages: this.supportedLanguages
        };
    }
}

// Create global instance
window.I18nLoader = I18nLoader;

// Export for module usage
export default I18nLoader;