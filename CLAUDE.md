# Shopping List Organizer - Project Memory

## Project Overview
**Name**: Shopping List Organizer  
**Purpose**: Collaborative family shopping list app with real-time editing and smart categorization  
**Tech Stack**: Vanilla JS, Supabase (PostgreSQL), Google OAuth, Vercel deployment, OpenAI API integration  
**Deployment**: Automatic deployment via Vercel from `master` branch to production  
**Current Status**: Production-ready with full collaboration features, AI-enhanced categorization, and email notifications

## Recent Major Features (Latest First)

### 🤖 **AI-Enhanced Categorization System** (LATEST)
- ✅ **OpenAI Integration**: GPT-3.5-turbo for intelligent item categorization
- ✅ **Hybrid Approach**: Rule-based categorization first, AI for "Other" items
- ✅ **Smart Validation**: Automatic correction of AI responses to valid categories
- ✅ **Fallback Strategy**: Graceful degradation when OpenAI API unavailable
- ✅ **Environment-Aware**: Configuration through Vercel environment variables

### 📧 **Email Notification System**
- ✅ **Resend Integration**: Professional email notifications via Edge Functions
- ✅ **Invitation Emails**: Automatic notifications when lists are shared
- ✅ **Branded Templates**: HTML email templates with app branding
- ✅ **Error Handling**: Sharing continues even if email delivery fails
- ✅ **Production URLs**: Correct callback URLs for production environment

### 🎯 **Compact Header Bar & UX Overhaul**
- ✅ **Space-Efficient Design**: Reduced header height by ~60% for more content space
- ✅ **Professional User Dropdown**: Avatar + name + dropdown with "My Lists" and "Sign Out"
- ✅ **Responsive Layout**: Desktop horizontal, mobile stacked with centered elements
- ✅ **Modern UI Pattern**: Follows contemporary web app standards
- ✅ **Smooth Interactions**: Click-to-toggle dropdown with rotation animations

### 🗂️ **Advanced Item Management System**
- ✅ **Table Structure**: Item name | Amount | Unit | Delete icon
- ✅ **Rich Data Model**: Items as objects {name, amount, unit} vs old string format
- ✅ **Unit Support**: g, kg, pcs, L, ml with dropdown selection
- ✅ **Mobile Optimized**: Responsive grid layout with proper touch targets
- ✅ **Backward Compatible**: Automatic conversion from old string items

### 📱 **Mobile-First Responsive Design**
- ✅ **Optimized Layouts**: All sections properly stacked and sized for mobile
- ✅ **Touch-Friendly Buttons**: Consistent sizing, proper gaps, full-width where needed
- ✅ **Icon Integration**: Shopping cart (🛒) and trash (🗑️) icons for better UX
- ✅ **Category Header Layout**: Title top row, assignment + count bottom row

### 🤝 **Category Assignment System**
- ✅ **Collaborative Assignment**: Users can assign shopping categories to specific collaborators
- ✅ **Interactive Assignment UI**: Dropdown selection with visual indicators
- ✅ **Visual Feedback**: Assigned (green) vs unassigned (gray) categories
- ✅ **Real-time Updates**: Assignment changes sync instantly across devices
- ✅ **Owner Integration**: List owners automatically included as collaborators
- ✅ **Profile Resolution**: Rich user profile display with names and avatars

## Code Architecture

### Data Structure Evolution

**Legacy Format (String Arrays):**
```javascript
{
  "Fruits & Vegetables": ["apple", "banana", "carrot"]
}
```

**Current Format (Rich Item Objects with Assignments):**
```javascript
{
  "Fruits & Vegetables": {
    "items": [
      { "name": "apple", "amount": "6", "unit": "pcs" },
      { "name": "banana", "amount": "2", "unit": "kg" },
      { "name": "carrot", "amount": "500", "unit": "g" }
    ],
    "assigned_to": "user-uuid-here"
  }
}
```

**Item Object Structure:**
```javascript
{
  "name": string,     // Item name (required)
  "amount": string,   // Quantity (optional, can be empty)
  "unit": string      // Unit type: "g", "kg", "pcs", "L", "ml"
}
```

### Key JavaScript Classes & Methods

#### Core Class: `ShoppingListOrganizer`

**Item Management:**
- `createItemHTML(category, item)` - Creates rich item UI with name/amount/unit/delete
- `updateItemData(category, itemId, field, value)` - Updates specific item fields
- `addItem(category, buttonElement)` - Adds new items as objects
- `deleteItem(category, itemId)` - Removes items from categories

**Assignment Features:**
- `createAssignmentUI(category, assignedTo)` - Renders assignment dropdown UI
- `showAssignmentDropdown(category, element)` - Interactive assignment selection
- `assignCategory(category, userId, dropdown)` - Updates category assignments
- `loadListCollaborators()` - Fetches list collaborators for assignments

**Authentication & UI:**
- `toggleUserDropdown()` - Shows/hides user menu in compact header
- `closeUserDropdown()` - Closes user dropdown with proper cleanup
- `switchToAuthenticatedMode(user)` - Updates compact header with user info
- `switchToGuestMode()` - Switches to guest mode with dropdown cleanup

**Core Functions:**
- `autoSaveCurrentList()` - Auto-saves changes to Supabase
- `categorizeItems(items)` - Rule-based categorization with fuzzy matching
- `categorizeWithAI(items)` - AI-enhanced categorization system
- `aiCategorizeItems(items)` - OpenAI API integration for smart categorization
- `validateAndCorrectCategories()` - Ensures AI responses match valid categories

#### Assignment Feature Integration
- Only shows for authenticated users with collaborators
- Visual indicators: assigned (green) vs unassigned (gray)
- Backward compatibility with existing data structures
- Real-time updates with auto-save

### UI Architecture

**Compact Header Design:**
```html
<header class="app-header">
  <div class="header-left">
    <h1>Shopping List Organizer</h1>
  </div>
  <div class="header-right">
    <div class="user-profile" onclick="toggleDropdown">
      <img class="user-avatar-compact">
      <span class="user-name-compact">John Doe</span>
      <span class="dropdown-arrow">▼</span>
    </div>
    <div class="user-dropdown">
      <button>📋 My Lists</button>
      <button>🚪 Sign Out</button>
    </div>
  </div>
</header>
```

**Mobile Responsive Strategy:**
- Desktop: Horizontal header with title left, user right
- Mobile: Stacked layout with centered elements
- Dropdown: Centered positioning with proper touch targets

### Database Schema
- **shopping_lists**: Main list storage with JSONB categories supporting rich item objects
- **list_collaborators**: User permissions and sharing relationships  
- **profiles**: User profile data for assignment display and compact header

## Development Guidelines

### Code Style
- Use `const` for immutable variables, `let` for mutable
- Async/await for all database operations
- Error handling with try/catch blocks
- Console logging for debugging (keep comprehensive logs)
- Environment-based configuration loading
- Graceful API degradation for optional features

### Current Development Patterns

**Item Management:**
- Always create items as objects: `{name, amount, unit}`
- Handle backward compatibility: convert strings to objects automatically
- Use `updateItemData()` for field-specific updates vs `updateItem()` for full replacement
- Default unit is "pcs", amount can be empty string

**Mobile-First Design:**
- Use CSS Grid for table-like layouts with responsive breakpoints
- Full-width buttons on mobile with max-width constraints
- Icon-first approach: 🛒 for count, 🗑️ for delete, + for add
- Consistent 48px min-height for touch targets

**Assignment Features:**
- Always check `this.mode === 'authenticated'` before showing assignment UI  
- Convert legacy data formats automatically when encountered
- Use `this.currentCollaborators` array for dropdown options
- Auto-save after any assignment changes

**Authentication & UI:**
- Safe element access with null checks before event listeners
- Dropdown state management with proper cleanup on mode switches
- Compact header maintains all auth functionality with space efficiency

### Data Validation
- Handle three data formats: strings, arrays, and rich objects
- Graceful degradation when fields are missing or null
- Automatic migration preserves user data integrity
- Permission validation before any collaborative operations

## Common Operations

### Adding Assignment Features to New Components
1. Check authentication status
2. Load collaborators with `loadListCollaborators()`
3. Store in `this.currentCollaborators`
4. Use `createAssignmentUI()` for rendering
5. Handle assignment changes with `assignCategory()`

### Debugging Assignment Issues
- Check `this.currentCollaborators` array population
- Verify `assigned_to` field in category data
- Ensure user permissions in database
- Check console logs for profile fetching errors

## Integration Points

### Supabase Database
- Row Level Security (RLS) policies control access
- Real-time subscriptions for live collaboration
- Database functions for user profile lookups
- JSONB field manipulation for category assignments

### Email System (Resend)
- Edge function: `supabase/functions/send-invitation-email/index.ts`
- Professional HTML email templates with app branding
- Handles invitation notifications with list details
- Uses Resend API for reliable delivery
- CORS-enabled for cross-origin requests
- Error logging and graceful failure handling
- Production URL integration for proper callbacks

### Authentication (Google OAuth)
- Production OAuth redirect URLs configured
- Token handling through Supabase Auth
- User profile creation triggers

## Testing & Deployment

### Local Development
- Use `.env` file for environment variables
- Test assignment features with multiple users
- Verify backward compatibility with old list formats

### Production Deployment (Vercel)
- **Platform**: Vercel for serverless deployment and hosting
- **Auto-Deploy**: Automatic deployment from `master` branch to production
- **Preview Deployments**: Every push to `dev` branch creates preview deployment
- **Environment Variables** configured in Vercel dashboard:
  - `SUPABASE_URL` - Supabase project URL
  - `SUPABASE_ANON_KEY` - Supabase anonymous/public key
  - `GOOGLE_CLIENT_ID` - Google OAuth client ID
  - `OPENAI_API_KEY` - OpenAI API key for AI categorization
  - `RESEND_API_KEY` - Resend API key for email notifications
- **Custom Domain**: Production URL with SSL/TLS termination
- **OAuth Configuration**: Redirect URLs must match production domain
- **API Endpoints**: Serverless functions at `/api/config.js` serve environment configuration
- **Edge Functions**: Supabase Edge Functions for email notifications
- **Build Process**: Zero-config deployment with automatic optimization

## File Structure Context
```
ShoppingOrganizer/
├── index.html             # Compact header structure with user dropdown + env config loader
├── script.js              # Core app logic: items, assignments, auth, AI categorization
├── styles.css             # Responsive CSS: compact header, item table, mobile-first
├── supabase-config.js     # Database config, auth, and profile management
├── database-schema.sql    # Schema supporting rich item objects & assignments  
├── database-functions.sql # User profile lookup and email resolution functions
├── vercel.json           # Vercel deployment configuration
├── package.json          # Project metadata and dependencies
├── api/
│   └── config.js         # Serverless function for environment variables
└── supabase/functions/
    └── send-invitation-email/
        └── index.ts      # Email notification edge function
```

## Current State & Stability
✅ **Production Ready Features:**
- Compact header with professional user dropdown
- Rich item management with amounts and units
- Mobile-optimized responsive design throughout
- Category assignment system with real-time sync
- AI-enhanced categorization with OpenAI integration
- Email notification system via Resend
- Backward compatibility with all legacy data formats
- Comprehensive authentication flow with OAuth
- Environment-based configuration system
- Serverless deployment on Vercel

## Next Development Priorities
1. **Enhanced Shopping Experience**
   - Item completion/checking off functionality
   - Shopping mode with streamlined interface
   - Category-based shopping workflow
   - Barcode scanning for quick item addition

2. **Advanced AI Features**
   - Shopping history analysis and suggestions
   - Seasonal item recommendations
   - Price estimation and budget tracking
   - Smart quantity suggestions based on household size

3. **Enhanced Collaboration**
   - Assignment notifications and alerts
   - Category-level permissions and restrictions
   - Assignment history and audit trail
   - Real-time collaborative editing indicators

4. **Mobile App Features**
   - PWA implementation for app-like experience
   - Offline mode with sync when connected
   - Push notifications for list updates
   - Voice input for hands-free list building

5. **Store Integration**
   - Location-based store integration
   - Store layout optimization
   - Price comparison across stores
   - Digital receipt integration

## AI Integration Details

### OpenAI Categorization Pipeline
1. **Hybrid Approach**: Rule-based categorization first for speed
2. **AI Processing**: Uncategorized items sent to OpenAI API
3. **Strict Prompting**: Constrains AI to predefined category list
4. **Response Validation**: Corrects invalid category names automatically
5. **Error Handling**: Graceful fallback to rule-based system
6. **Caching**: Environment config cached for performance

### Email Notification System
1. **Edge Function Architecture**: Deno-based Supabase function
2. **Template System**: Professional HTML email templates
3. **Recipient Resolution**: Database lookup of user emails
4. **Error Recovery**: Sharing succeeds even if email fails
5. **Production Integration**: Correct URLs for production environment

### Environment Configuration
- **Development**: `.env` file support for local testing
- **Production**: Vercel environment variables
- **API Endpoint**: `/api/config.js` serves configuration securely
- **Fallback Handling**: Graceful degradation when configs missing

---
**Last Updated**: AI-Enhanced Categorization & Email Notification System  
**Current Phase**: Production-ready app with AI integration and email notifications  
**Next Phase**: Enhanced shopping experience with advanced AI features  
**Maintained by**: Claude Code collaborative development