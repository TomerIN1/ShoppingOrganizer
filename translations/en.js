// English translations for Shopping List Organizer
const englishTranslations = {
    // Header section
    header: {
        title: "Shopping List Organizer",
        tagline: "Smart AI organization for shopping and beyond",
        signIn: "Sign In with Google",
        signOut: "Sign Out",
        myLists: "My Lists",
        guestMode: "Guest Mode",
        authMessage: "Never lose your shopping lists again - sign in to save, sync, and share with others"
    },
    
    // Navigation and main actions
    navigation: {
        backToMain: "← Back to Main",
        refresh: "Refresh",
        organizeList: "Organize List",
        clear: "Clear",
        newList: "New List"
    },
    
    // List actions
    actions: {
        addCategory: "Add Category",
        copyForWhatsApp: "📋 Copy for WhatsApp",
        shareList: "Share List",
        deleteList: "🗑️ Delete List",
        saveList: "Save List",
        loadList: "Load List"
    },
    
    // Input section
    input: {
        listNamePlaceholder: "List name (e.g., Weekly Shopping, Travel Packing, DIY Project...)",
        itemsPlaceholder: "Enter your items here (e.g., milk, bread, apples, chicken breast, toothpaste, camera, etc.)",
        enterItems: "Enter Your List Items",
        subtitle: "Perfect for shopping, travel packing, DIY projects, and more!"
    },
    
    // Categories
    categories: {
        "Fruits & Vegetables": "Fruits & Vegetables",
        "Meat & Seafood": "Meat & Seafood", 
        "Dairy & Eggs": "Dairy & Eggs",
        "Bakery & Bread": "Bakery & Bread",
        "Pantry & Canned Goods": "Pantry & Canned Goods",
        "Frozen Foods": "Frozen Foods",
        "Beverages": "Beverages",
        "Snacks & Sweets": "Snacks & Sweets",
        "Health & Beauty": "Health & Beauty",
        "Household & Cleaning": "Household & Cleaning",
        "Other": "Other"
    },
    
    // Examples section
    examples: {
        title: "Use Cases & Examples",
        shopping: {
            title: "Shopping Lists",
            example: "milk, bread, apples, chicken breast, yogurt",
            description: "Auto-categorized into Dairy, Bakery, Fruits, Meat"
        },
        travel: {
            title: "Travel Packing",
            example: "passport, sunscreen, camera, medications, swimsuit",
            description: "Organized by Travel Docs, Health, Electronics"
        },
        diy: {
            title: "DIY Projects", 
            example: "screws, paint, brushes, sandpaper, gloves",
            description: "Sorted into Hardware, Supplies, Safety"
        },
        events: {
            title: "Event Planning",
            example: "balloons, cake, music playlist, invitations",
            description: "Categorized by Decorations, Food, Entertainment"
        }
    },
    
    // Sharing and collaboration
    sharing: {
        shareWith: "Share with Someone",
        shareInstructions: "Enter the email address of the person you want to share this list with:",
        emailPlaceholder: "Enter email address...",
        viewOnly: "View Only",
        canEdit: "Can Edit",
        sendInvite: "Send Invite",
        sharedWith: "Shared With",
        sharedLists: "Shared Shopping Lists",
        collaborators: "collaborator",
        collaboratorsPlural: "collaborators",
        unassigned: "Unassigned",
        unknownUser: "Unknown User"
    },
    
    // Item management
    items: {
        name: "Item",
        amount: "Amount", 
        unit: "Unit",
        delete: "Delete",
        add: "Add Item",
        addNew: "Add New Item",
        units: {
            g: "g",
            kg: "kg", 
            pcs: "pcs",
            L: "L",
            ml: "ml"
        }
    },
    
    // Status messages
    status: {
        loading: "Loading...",
        saving: "Saving...",
        saved: "Saved",
        error: "Error",
        success: "Success",
        loadingLists: "Loading your lists...",
        loadingSharedLists: "Loading shared lists...",
        noLists: "No lists found",
        processing: "Processing..."
    },
    
    // Validation and error messages
    validation: {
        invalidInput: "Content appears to be narrative text rather than a list",
        inappropriateLanguage: "Inappropriate language detected. Please keep your lists family-friendly and revise your text.",
        warning1: "🚨 Warning 1/3: Inappropriate language detected. Please keep your lists family-friendly and revise your text.",
        warning2: "🚨 Warning 2/3: Second violation detected. Please use appropriate language only. One more violation will temporarily block your access.",
        warning3: "🚨 Final Warning 3/3: This is your last chance. Please use appropriate language only. Next violation will block your access to the app.",
        blocked: "🔒 Access temporarily restricted. Please refresh the page to reset and use appropriate language only.",
        detectedWords: "Detected words:",
        enterSomeItems: "Please enter some items to organize",
        listNameRequired: "Please enter a list name"
    },
    
    // Notifications
    notifications: {
        listCopied: "List copied to clipboard!",
        listSaved: "List saved successfully",
        listDeleted: "List deleted successfully", 
        listShared: "List shared successfully",
        inviteSent: "Invitation sent successfully",
        errorOccurred: "An error occurred",
        tryAgain: "Please try again"
    },
    
    // Confirmation dialogs
    confirmations: {
        deleteList: "Are you sure you want to delete this list?",
        deleteListWarning: "This action cannot be undone. The list will be permanently deleted.",
        confirm: "Confirm",
        cancel: "Cancel",
        yes: "Yes",
        no: "No"
    },
    
    // Language switcher
    language: {
        current: "English",
        switch: "Switch Language",
        english: "English",
        hebrew: "עברית"
    },
    
    // Time and dates
    time: {
        created: "Created",
        updated: "Updated",
        items: "items",
        categories: "categories"
    },
    
    // Footer
    footer: {
        privacyPolicy: "Privacy Policy",
        termsOfService: "Terms of Service",
        accessibility: "Accessibility",
        copyright: "© 2025 Shopping List Organizer. All rights reserved."
    }
};

// Export for ES6 modules - uncomment when using as module
// export default englishTranslations;

// Export as global for script tag usage
window.EnglishTranslations = englishTranslations;