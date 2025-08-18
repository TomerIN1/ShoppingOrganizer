// Hebrew translations for Shopping List Organizer
const hebrewTranslations = {
    // Header section
    header: {
        title: "מארגן רשימת קניות",
        tagline: "ארגון חכם עם בינה מלאכותית לקניות ועוד",
        signIn: "התחבר עם Google",
        signOut: "התנתק",
        myLists: "הרשימות שלי",
        guestMode: "מצב אורח",
        authMessage: "אל תאבד את רשימות הקניות שלך - התחבר כדי לשמור, לסנכרן ולשתף עם אחרים"
    },
    
    // Navigation and main actions
    navigation: {
        backToMain: "← חזרה לעמוד הראשי",
        refresh: "רענן",
        organizeList: "ארגן רשימה",
        clear: "נקה",
        newList: "רשימה חדשה"
    },
    
    // List actions
    actions: {
        addCategory: "הוסף קטגוריה",
        copyForWhatsApp: "📋 העתק לוואטסאפ",
        shareList: "שתף רשימה",
        deleteList: "🗑️ מחק רשימה",
        saveList: "שמור רשימה",
        loadList: "טען רשימה"
    },
    
    // Input section
    input: {
        listNamePlaceholder: "שם הרשימה (למשל: קניות שבועיות, חפצים לטיול, פרויקט DIY...)",
        itemsPlaceholder: "הכנס את הפריטים שלך כאן (למשל: חלב, לחם, תפוחים, חזה עוף, משחת שיניים, מצלמה וכו')",
        enterItems: "הכנס את פריטי הרשימה שלך",
        subtitle: "מושלם לקניות, אריזה לטיולים, פרויקטי DIY ועוד!"
    },
    
    // Categories
    categories: {
        "Fruits & Vegetables": "פירות וירקות",
        "Meat & Seafood": "בשר ודגים", 
        "Dairy & Eggs": "חלב וביצים",
        "Bakery & Bread": "מאפייה ולחם",
        "Pantry & Canned Goods": "מזווה ושימורים",
        "Frozen Foods": "מזון קפוא",
        "Beverages": "משקאות",
        "Snacks & Sweets": "חטיפים וממתקים",
        "Health & Beauty": "בריאות ויופי",
        "Household & Cleaning": "בית וניקיון",
        "Other": "אחר"
    },
    
    // Examples section
    examples: {
        title: "דוגמאות לשימוש",
        shopping: {
            title: "רשימות קניות",
            example: "חלב, לחם, תפוחים, חזה עוף, יוגורט",
            description: "מסודר אוטומטית לחלב, מאפייה, פירות, בשר"
        },
        travel: {
            title: "אריזה לטיולים",
            example: "דרכון, קרם הגנה, מצלמה, תרופות, בגד ים",
            description: "מאורגן לפי מסמכי נסיעה, בריאות, אלקטרוניקה"
        },
        diy: {
            title: "פרויקטי DIY", 
            example: "ברגים, צבע, מברשות, נייר זכוכית, כפפות",
            description: "מסודר לחומרה, אביזרים, בטיחות"
        },
        events: {
            title: "תכנון אירועים",
            example: "בלונים, עוגה, רשימת השמעה, הזמנות",
            description: "מקוטלג לפי קישוטים, אוכל, בידור"
        }
    },
    
    // Sharing and collaboration
    sharing: {
        shareWith: "שתף עם מישהו",
        shareInstructions: "הכנס את כתובת המייל של האדם שאיתו תרצה לשתף את הרשימה:",
        emailPlaceholder: "הכנס כתובת מייל...",
        viewOnly: "צפייה בלבד",
        canEdit: "יכול לערוך",
        sendInvite: "שלח הזמנה",
        sharedWith: "משותף עם",
        sharedLists: "רשימות קניות משותפות",
        collaborators: "משתתף",
        collaboratorsPlural: "משתתפים",
        unassigned: "לא משויך",
        unknownUser: "משתמש לא מוכר"
    },
    
    // Item management
    items: {
        name: "פריט",
        amount: "כמות", 
        unit: "יחידה",
        delete: "מחק",
        add: "הוסף פריט",
        addNew: "הוסף פריט חדש",
        units: {
            g: "גרם",
            kg: "ק\"ג", 
            pcs: "יח'",
            L: "ליטר",
            ml: "מ\"ל"
        }
    },
    
    // Status messages
    status: {
        loading: "טוען...",
        saving: "שומר...",
        saved: "נשמר",
        error: "שגיאה",
        success: "הצלחה",
        loadingLists: "טוען את הרשימות שלך...",
        loadingSharedLists: "טוען רשימות משותפות...",
        noLists: "לא נמצאו רשימות",
        processing: "מעבד..."
    },
    
    // Validation and error messages
    validation: {
        invalidInput: "התוכן נראה כטקסט נרטיבי ולא כרשימה",
        inappropriateLanguage: "זוהתה שפה לא הולמת. אנא שמור על רשימות ידידותיות למשפחה ותקן את הטקסט.",
        warning1: "🚨 אזהרה 1/3: זוהתה שפה לא הולמת. אנא שמור על רשימות ידידותיות למשפחה ותקן את הטקסט.",
        warning2: "🚨 אזהרה 2/3: הפרה שנייה זוהתה. אנא השתמש בשפה הולמת בלבד. הפרה נוספת תחסום זמנית את הגישה שלך.",
        warning3: "🚨 אזהרה אחרונה 3/3: זה הסיכוי האחרון שלך. אנא השתמש בשפה הולמת בלבד. הפרה הבאה תחסום את הגישה שלך לאפליקציה.",
        blocked: "🔒 הגישה חסומה זמנית. אנא רענן את הדף כדי לאפס והשתמש בשפה הולמת בלבד.",
        detectedWords: "מילים שזוהו:",
        enterSomeItems: "אנא הכנס כמה פריטים לארגון",
        listNameRequired: "אנא הכנס שם לרשימה"
    },
    
    // Notifications
    notifications: {
        listCopied: "הרשימה הועתקה ללוח!",
        listSaved: "הרשימה נשמרה בהצלחה",
        listDeleted: "הרשימה נמחקה בהצלחה", 
        listShared: "הרשימה שותפה בהצלחה",
        inviteSent: "ההזמנה נשלחה בהצלחה",
        errorOccurred: "אירעה שגיאה",
        tryAgain: "אנא נסה שוב"
    },
    
    // Confirmation dialogs
    confirmations: {
        deleteList: "האם אתה בטוח שברצונך למחוק את הרשימה הזו?",
        deleteListWarning: "פעולה זו לא ניתנת לביטול. הרשימה תימחק לצמיתות.",
        confirm: "אשר",
        cancel: "ביטול",
        yes: "כן",
        no: "לא"
    },
    
    // Language switcher
    language: {
        current: "עברית",
        switch: "החלף שפה",
        english: "English",
        hebrew: "עברית"
    },
    
    // Time and dates
    time: {
        created: "נוצר",
        updated: "עודכן",
        items: "פריטים",
        categories: "קטגוריות"
    }
};

// Export for ES6 modules - uncomment when using as module
// export default hebrewTranslations;

// Export as global for script tag usage
window.HebrewTranslations = hebrewTranslations;