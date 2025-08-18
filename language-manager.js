// Language Management System for Shopping List Organizer
// Handles language detection, switching, and persistence

class LanguageManager {
    constructor() {
        this.supportedLanguages = ['en', 'he'];
        this.defaultLanguage = 'en';
        this.currentLanguage = this.detectLanguage();
        this.translations = {};
        this.rtlLanguages = ['he', 'ar']; // Right-to-left languages
        
        // Language metadata
        this.languageInfo = {
            en: {
                name: 'English',
                nativeName: 'English',
                flag: '🇺🇸',
                direction: 'ltr'
            },
            he: {
                name: 'Hebrew',
                nativeName: 'עברית',
                flag: '🇮🇱',
                direction: 'rtl'
            }
        };
        
        console.log(`🌍 LanguageManager initialized. Current language: ${this.currentLanguage}`);
    }
    
    /**
     * Detect user's preferred language
     * Priority: localStorage > URL parameter > browser language > default
     */
    detectLanguage() {
        // 1. Check localStorage for saved preference
        const savedLanguage = localStorage.getItem('app_language');
        if (savedLanguage && this.supportedLanguages.includes(savedLanguage)) {
            console.log(`🔍 Language detected from localStorage: ${savedLanguage}`);
            return savedLanguage;
        }
        
        // 2. Check URL parameter (?lang=he)
        const urlParams = new URLSearchParams(window.location.search);
        const urlLanguage = urlParams.get('lang');
        if (urlLanguage && this.supportedLanguages.includes(urlLanguage)) {
            console.log(`🔍 Language detected from URL: ${urlLanguage}`);
            this.saveLanguagePreference(urlLanguage);
            return urlLanguage;
        }
        
        // 3. Check browser language
        const browserLanguage = this.getBrowserLanguage();
        if (browserLanguage) {
            console.log(`🔍 Language detected from browser: ${browserLanguage}`);
            this.saveLanguagePreference(browserLanguage);
            return browserLanguage;
        }
        
        // 4. Fallback to default
        console.log(`🔍 Using default language: ${this.defaultLanguage}`);
        return this.defaultLanguage;
    }
    
    /**
     * Get browser language preference
     */
    getBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        
        // Check exact match first (e.g., 'he')
        if (this.supportedLanguages.includes(browserLang)) {
            return browserLang;
        }
        
        // Check language code only (e.g., 'he-IL' -> 'he')
        const langCode = browserLang.split('-')[0];
        if (this.supportedLanguages.includes(langCode)) {
            return langCode;
        }
        
        return null;
    }
    
    /**
     * Switch to a new language
     */
    async switchLanguage(newLanguage) {
        if (!this.supportedLanguages.includes(newLanguage)) {
            console.error(`❌ Unsupported language: ${newLanguage}`);
            return false;
        }
        
        if (this.currentLanguage === newLanguage) {
            console.log(`✅ Already using language: ${newLanguage}`);
            return true;
        }
        
        console.log(`🔄 Switching language from ${this.currentLanguage} to ${newLanguage}`);
        
        const previousLanguage = this.currentLanguage;
        this.currentLanguage = newLanguage;
        
        try {
            // Save preference
            this.saveLanguagePreference(newLanguage);
            
            // Load translations for new language
            await this.loadTranslations(newLanguage);
            
            // Update document direction and language
            this.updateDocumentLanguage();
            
            // Trigger language change event
            this.triggerLanguageChangeEvent(previousLanguage, newLanguage);
            
            console.log(`✅ Successfully switched to ${newLanguage}`);
            return true;
            
        } catch (error) {
            console.error(`❌ Failed to switch language to ${newLanguage}:`, error);
            // Revert on error
            this.currentLanguage = previousLanguage;
            return false;
        }
    }
    
    /**
     * Save language preference to localStorage
     */
    saveLanguagePreference(language) {
        try {
            localStorage.setItem('app_language', language);
            console.log(`💾 Language preference saved: ${language}`);
        } catch (error) {
            console.warn(`⚠️ Failed to save language preference:`, error);
        }
    }
    
    /**
     * Load translations for a specific language
     */
    async loadTranslations(language = this.currentLanguage) {
        if (this.translations[language]) {
            console.log(`✅ Translations already loaded for ${language}`);
            return this.translations[language];
        }
        
        try {
            console.log(`📥 Loading translations for ${language}...`);
            
            // Use I18nLoader if available, otherwise try direct import
            if (window.I18nLoader) {
                const loader = new window.I18nLoader();
                this.translations[language] = await loader.loadTranslation(language);
            } else {
                // Fallback: try dynamic import
                const translationModule = await import(`./translations/${language}.js`);
                this.translations[language] = translationModule.default || translationModule;
            }
            
            console.log(`✅ Translations loaded for ${language}`);
            return this.translations[language];
            
        } catch (error) {
            console.error(`❌ Failed to load translations for ${language}:`, error);
            
            // Fallback to English if not already trying English
            if (language !== 'en') {
                console.log(`🔄 Falling back to English translations...`);
                return await this.loadTranslations('en');
            }
            
            throw error;
        }
    }
    
    /**
     * Get translation for a key
     * Supports nested keys like "header.title"
     */
    t(key, fallback = null) {
        try {
            const translation = this.getNestedTranslation(key, this.currentLanguage);
            
            if (translation !== null) {
                return translation;
            }
            
            // Fallback to English if current language is not English
            if (this.currentLanguage !== 'en') {
                const englishTranslation = this.getNestedTranslation(key, 'en');
                if (englishTranslation !== null) {
                    console.warn(`⚠️ Using English fallback for key: ${key}`);
                    return englishTranslation;
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
     * Get nested translation using dot notation
     */
    getNestedTranslation(key, language) {
        const translations = this.translations[language];
        if (!translations) {
            return null;
        }
        
        return key.split('.').reduce((obj, prop) => {
            return obj && obj[prop] !== undefined ? obj[prop] : null;
        }, translations);
    }
    
    /**
     * Update document language and direction
     */
    updateDocumentLanguage() {
        const html = document.documentElement;
        const langInfo = this.languageInfo[this.currentLanguage];
        
        // Set language attribute
        html.setAttribute('lang', this.currentLanguage);
        
        // Set direction attribute
        html.setAttribute('dir', langInfo.direction);
        
        // Add language-specific CSS class
        html.className = html.className.replace(/\blang-\w+\b/g, '');
        html.classList.add(`lang-${this.currentLanguage}`);
        
        console.log(`📝 Document updated: lang="${this.currentLanguage}", dir="${langInfo.direction}"`);
    }
    
    /**
     * Trigger custom language change event
     */
    triggerLanguageChangeEvent(previousLanguage, newLanguage) {
        const event = new CustomEvent('languageChanged', {
            detail: {
                previousLanguage,
                newLanguage,
                languageInfo: this.languageInfo[newLanguage]
            }
        });
        
        document.dispatchEvent(event);
        console.log(`📡 Language change event triggered: ${previousLanguage} -> ${newLanguage}`);
    }
    
    /**
     * Check if current language is RTL
     */
    isRTL() {
        return this.rtlLanguages.includes(this.currentLanguage);
    }
    
    /**
     * Get current language info
     */
    getCurrentLanguageInfo() {
        return this.languageInfo[this.currentLanguage];
    }
    
    /**
     * Get all supported languages with metadata
     */
    getSupportedLanguages() {
        return this.supportedLanguages.map(lang => ({
            code: lang,
            ...this.languageInfo[lang]
        }));
    }
    
    /**
     * Initialize language manager (call after DOM is ready)
     */
    async init() {
        try {
            console.log(`🚀 Initializing LanguageManager...`);
            
            // Load initial translations
            await this.loadTranslations();
            
            // Update document
            this.updateDocumentLanguage();
            
            console.log(`✅ LanguageManager initialized successfully`);
            return true;
            
        } catch (error) {
            console.error(`❌ Failed to initialize LanguageManager:`, error);
            return false;
        }
    }
}

// Export for use in other modules
window.LanguageManager = LanguageManager;