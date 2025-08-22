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
            console.log(`🔍 Available globals: EnglishTranslations=${!!window.EnglishTranslations}, HebrewTranslations=${!!window.HebrewTranslations}, I18nLoader=${!!window.I18nLoader}`);
            
            // Debug: Log actual global objects
            if (language === 'he' && window.HebrewTranslations) {
                console.log(`🔍 HebrewTranslations keys:`, Object.keys(window.HebrewTranslations));
                console.log(`🔍 HebrewTranslations.header:`, window.HebrewTranslations.header);
            }
            
            // Try global variables first (for file:// and non-module environments)
            if (language === 'en' && window.EnglishTranslations) {
                this.translations[language] = window.EnglishTranslations;
                console.log(`✅ English translations loaded from global variable`);
            } else if (language === 'he' && window.HebrewTranslations) {
                this.translations[language] = window.HebrewTranslations;
                console.log(`✅ Hebrew translations loaded from global variable`);
            } else if (window.I18nLoader) {
                // Use I18nLoader as secondary option
                console.log(`🔄 Using I18nLoader for ${language}...`);
                const loader = new window.I18nLoader();
                this.translations[language] = await loader.loadTranslation(language);
                console.log(`✅ Translations loaded via I18nLoader for ${language}`);
            } else {
                // Fallback: try dynamic import (may fail in file:// protocol)
                try {
                    console.log(`🔄 Attempting dynamic import for ${language}...`);
                    const translationModule = await import(`./translations/${language}.js`);
                    console.log(`🔍 Dynamic import returned:`, translationModule);
                    
                    // Extract the actual translation object from the module
                    let translationData = null;
                    
                    // First check for standard exports
                    if (translationModule.default) {
                        translationData = translationModule.default;
                        console.log(`📦 Found default export`);
                    } else if (translationModule[`${language === 'en' ? 'english' : 'hebrew'}Translations`]) {
                        // Check for named exports
                        translationData = translationModule[`${language === 'en' ? 'english' : 'hebrew'}Translations`];
                        console.log(`📦 Found named export`);
                    } else {
                        // Look for any object property that looks like translations
                        for (const key in translationModule) {
                            if (typeof translationModule[key] === 'object' && translationModule[key] !== null && translationModule[key].header) {
                                translationData = translationModule[key];
                                console.log(`📦 Found translation in property: ${key}`);
                                break;
                            }
                        }
                    }
                    
                    // If no translation found in module, check global after import
                    if (!translationData) {
                        console.log(`🔍 No module export found, checking global variables after import...`);
                        await new Promise(resolve => setTimeout(resolve, 50)); // Wait for global to be set
                        
                        if (language === 'en' && window.EnglishTranslations) {
                            translationData = window.EnglishTranslations;
                            console.log(`📦 Found English translations in global after import`);
                        } else if (language === 'he' && window.HebrewTranslations) {
                            translationData = window.HebrewTranslations;
                            console.log(`📦 Found Hebrew translations in global after import`);
                        }
                    }
                    
                    if (!translationData) {
                        throw new Error(`No translation data found in module or global for ${language}`);
                    }
                    
                    this.translations[language] = translationData;
                    console.log(`✅ Translations loaded via dynamic import for ${language}`);
                } catch (importError) {
                    console.warn(`⚠️ Dynamic import failed for ${language}:`, importError);
                    throw new Error(`Failed to load translations for ${language}. Ensure translation files are properly loaded as scripts.`);
                }
            }
            
            // Validate that translation object has required structure
            if (!this.translations[language] || !this.translations[language].header) {
                console.error(`❌ Invalid translation structure for ${language}:`, this.translations[language]);
                throw new Error(`Invalid translation structure for ${language} - missing required sections`);
            }
            
            console.log(`✅ Translations validated and loaded for ${language}`);
            return this.translations[language];
            
        } catch (error) {
            console.error(`❌ Failed to load translations for ${language}:`, error);
            
            // Fallback to English if not already trying English
            if (language !== 'en') {
                console.log(`🔄 Falling back to English translations...`);
                return await this.loadTranslations('en');
            }
            
            // Ultimate fallback: create basic translation structure to prevent crashes
            console.warn(`⚠️ Creating minimal translation structure for ${language} as ultimate fallback`);
            this.translations[language] = this.createMinimalTranslations(language);
            return this.translations[language];
        }
    }
    
    /**
     * Create minimal translation structure as ultimate fallback
     */
    createMinimalTranslations(language) {
        const isHebrew = language === 'he';
        return {
            header: {
                title: isHebrew ? "מארגן רשימת קניות" : "Shopping List Organizer",
                tagline: isHebrew ? "ארגון חכם עם בינה מלאכותית לקניות ועוד" : "Smart AI organization for shopping and beyond",
                signIn: isHebrew ? "התחבר עם Google" : "Sign In with Google",
                signOut: isHebrew ? "התנתק" : "Sign Out",
                myLists: isHebrew ? "הרשימות שלי" : "My Lists"
            },
            categories: {
                "Fruits & Vegetables": isHebrew ? "פירות וירקות" : "Fruits & Vegetables",
                "Meat & Seafood": isHebrew ? "בשר ודגים" : "Meat & Seafood",
                "Dairy & Eggs": isHebrew ? "חלב וביצים" : "Dairy & Eggs",
                "Other": isHebrew ? "אחר" : "Other"
            },
            actions: {
                organizeList: isHebrew ? "ארגן רשימה" : "Organize List",
                clear: isHebrew ? "נקה" : "Clear",
                newList: isHebrew ? "רשימה חדשה" : "New List"
            },
            status: {
                loading: isHebrew ? "טוען..." : "Loading...",
                noLists: isHebrew ? "אין פריטים להציג" : "No items to display"
            },
            // Add other minimal sections as needed
            navigation: {}, input: {}, examples: {}, sharing: {}, items: {}, 
            validation: {}, notifications: {}, confirmations: {}, language: {}, time: {}
        };
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
     * Format date according to current language
     * @param {Date} date - Date object to format
     * @param {string} style - 'short', 'medium', 'long', 'full'
     */
    formatDate(date, style = 'medium') {
        try {
            const options = this.getDateFormatOptions(style);
            const locale = this.currentLanguage === 'he' ? 'he-IL' : 'en-US';
            
            return new Intl.DateTimeFormat(locale, options).format(date);
        } catch (error) {
            console.warn(`⚠️ Date formatting failed, using fallback:`, error);
            return date.toLocaleDateString();
        }
    }
    
    /**
     * Format number according to current language
     * @param {number} number - Number to format
     * @param {object} options - Formatting options
     */
    formatNumber(number, options = {}) {
        try {
            const locale = this.currentLanguage === 'he' ? 'he-IL' : 'en-US';
            
            // Default options for Hebrew: RTL-friendly number formatting
            const defaultOptions = this.currentLanguage === 'he' ? 
                { style: 'decimal', useGrouping: true, minimumFractionDigits: 0 } : 
                { style: 'decimal' };
                
            const formatOptions = { ...defaultOptions, ...options };
            
            return new Intl.NumberFormat(locale, formatOptions).format(number);
        } catch (error) {
            console.warn(`⚠️ Number formatting failed, using fallback:`, error);
            return number.toString();
        }
    }
    
    /**
     * Format time according to current language
     * @param {Date} date - Date object to format time from
     * @param {boolean} includeSeconds - Whether to include seconds
     */
    formatTime(date, includeSeconds = false) {
        try {
            const locale = this.currentLanguage === 'he' ? 'he-IL' : 'en-US';
            const options = {
                hour: '2-digit',
                minute: '2-digit',
                ...(includeSeconds && { second: '2-digit' })
            };
            
            return new Intl.DateTimeFormat(locale, options).format(date);
        } catch (error) {
            console.warn(`⚠️ Time formatting failed, using fallback:`, error);
            const timeString = includeSeconds ? date.toLocaleTimeString() : date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            return timeString;
        }
    }
    
    /**
     * Format relative time (e.g., "2 minutes ago", "לפני 2 דקות")
     * @param {Date} date - Date to compare to now
     */
    formatRelativeTime(date) {
        try {
            const now = new Date();
            const diffMs = now - date;
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            
            if (this.currentLanguage === 'he') {
                if (diffMinutes < 1) return 'עכשיו';
                if (diffMinutes < 60) return `לפני ${diffMinutes} דקות`;
                if (diffHours < 24) return `לפני ${diffHours} שעות`;
                if (diffDays < 7) return `לפני ${diffDays} ימים`;
                return this.formatDate(date, 'short');
            } else {
                if (diffMinutes < 1) return 'just now';
                if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
                if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
                if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
                return this.formatDate(date, 'short');
            }
        } catch (error) {
            console.warn(`⚠️ Relative time formatting failed:`, error);
            return this.formatDate(date, 'short');
        }
    }
    
    /**
     * Get date format options based on style
     * @private
     */
    getDateFormatOptions(style) {
        const optionsMap = {
            short: { 
                year: '2-digit', 
                month: 'numeric', 
                day: 'numeric' 
            },
            medium: { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            },
            long: { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
            },
            full: { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long',
                hour: '2-digit',
                minute: '2-digit'
            }
        };
        
        return optionsMap[style] || optionsMap.medium;
    }
    
    /**
     * Format quantities with Hebrew-appropriate units
     * @param {string|number} amount - Quantity amount  
     * @param {string} unit - Unit type
     */
    formatQuantity(amount, unit) {
        if (!amount || amount === '') return '';
        
        try {
            const formattedAmount = this.formatNumber(parseFloat(amount));
            
            if (this.currentLanguage === 'he') {
                // Hebrew unit translations
                const hebrewUnits = {
                    'g': 'גרם',
                    'kg': 'ק"ג',
                    'pcs': 'יח\'',
                    'L': 'ליטר', 
                    'ml': 'מ"ל'
                };
                
                const hebrewUnit = hebrewUnits[unit] || unit;
                return `${formattedAmount} ${hebrewUnit}`;
            } else {
                return `${formattedAmount} ${unit}`;
            }
        } catch (error) {
            console.warn(`⚠️ Quantity formatting failed:`, error);
            return `${amount} ${unit}`;
        }
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