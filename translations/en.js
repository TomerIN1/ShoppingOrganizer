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
    },
    
    // Privacy Policy
    privacyPolicy: {
        title: "Privacy Policy — Shopping List Organizer",
        section1: {
            title: "1. Information We Collect",
            content: [
                "Account and Authentication Info: If you log in with your Google account, we may receive and store your email address and username (based on permissions).",
                "Usage Information: Actions like creating, editing, deleting, or sharing lists.",
                "Directly Provided Information: Items you entered in lists, categories, shared content, etc."
            ]
        },
        section2: {
            title: "2. Use of Information",
            content: [
                "Storage & Synchronization: To allow saving, syncing, and sharing lists across devices.",
                "User Experience Optimization: For example, smart display layouts and automatic categorization.",
                "Technical Support and Service: To help with requests and solve issues when needed.",
                "System Communications: Password reset links, service updates, reminders, and more."
            ]
        },
        section3: {
            title: "3. Sharing Information with Third Parties",
            content: [
                "Google Services Only: This is used only for sync purposes and limited to what you've permitted.",
                "No sharing with external entities: We do not sell, rent, or expose your personal info to others."
            ]
        },
        section4: {
            title: "4. Information Security",
            content: [
                "Security Measures: Data is encrypted during transfer (https) and securely stored.",
                "Authorized Access Only: Only limited authorized staff can access info (support purposes only).",
                "Backups and Incident Handling: We maintain backups and quick response to ensure continuity."
            ]
        },
        section5: {
            title: "5. Cookies and Similar Technologies",
            content: [
                "We may use cookies to remember preferences and improve user navigation.",
                "You can disable or delete cookies via your browser settings, though some functionality may be affected."
            ]
        },
        section6: {
            title: "6. Your Rights",
            content: [
                "Access: You may request a copy of the data associated with your account.",
                "Correction or Deletion: You can update or delete information when needed.",
                "Inquiry or Complaint: We welcome your input and will assist with any requests."
            ]
        },
        section7: {
            title: "7. Policy Updates",
            content: [
                "We may update this policy from time to time. Changes will be posted with the update date.",
                "It is recommended to check periodically to stay informed."
            ]
        },
        section8: {
            title: "8. Contact",
            content: [
                "If you have any questions or requests, please contact us via the [Contact] page or at support@[domain]."
            ]
        }
    }
};

// Export for ES6 modules - uncomment when using as module
// export default englishTranslations;

// Export as global for script tag usage
window.EnglishTranslations = englishTranslations;