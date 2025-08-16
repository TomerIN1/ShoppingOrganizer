# Shopping List Organizer - Project Memory

## Project Overview
**Name**: Shopping List Organizer  
**Purpose**: Collaborative family shopping list app with real-time editing and smart categorization  
**Tech Stack**: Vanilla JS, Supabase (PostgreSQL), Google OAuth, Vercel deployment  
**Current Status**: Production-ready with full collaboration features including category assignments

## Recent Major Features
- ✅ **Category Assignment System**: Users can assign shopping categories to specific collaborators
- ✅ **Interactive Assignment UI**: Dropdown selection with visual indicators
- ✅ **Backward Compatible Data**: Supports both old array format and new object format with assignments
- ✅ **Real-time Collaboration**: Multiple users can edit lists simultaneously
- ✅ **Email Notifications**: Automatic invitations via Resend service

## Code Architecture

### Data Structure Evolution
**Old Format (Arrays):**
```javascript
{
  "Fruits & Vegetables": ["apple", "banana", "carrot"]
}
```

**New Format (Objects with Assignments):**
```javascript
{
  "Fruits & Vegetables": {
    "items": ["apple", "banana", "carrot"],
    "assigned_to": "user-uuid-here"
  }
}
```

### Key JavaScript Classes & Methods

#### Core Class: `ShoppingListOrganizer`
- `createAssignmentUI(category, assignedTo)` - Renders assignment dropdown UI
- `showAssignmentDropdown(category, element)` - Interactive assignment selection
- `assignCategory(category, userId, dropdown)` - Updates category assignments
- `loadListCollaborators()` - Fetches list collaborators for assignments
- `autoSaveCurrentList()` - Auto-saves changes to Supabase

#### Assignment Feature Integration
- Only shows for authenticated users with collaborators
- Visual indicators: assigned (green) vs unassigned (gray)
- Backward compatibility with existing data structures
- Real-time updates with auto-save

### Database Schema
- **shopping_lists**: Main list storage with JSONB categories supporting assignments
- **list_collaborators**: User permissions and sharing relationships
- **profiles**: User profile data for assignment display

## Development Guidelines

### Code Style
- Use `const` for immutable variables, `let` for mutable
- Async/await for all database operations
- Error handling with try/catch blocks
- Console logging for debugging (keep comprehensive logs)

### Assignment Feature Patterns
- Always check `this.mode === 'authenticated'` before showing assignment UI
- Convert old array format to new object format when needed
- Use `this.currentCollaborators` array for dropdown options
- Auto-save after any assignment changes

### Data Validation
- Prevent duplicate categories
- Handle undefined/null values gracefully
- Ensure backward compatibility when loading old lists
- Validate user permissions before allowing edits

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
- Edge function: `supabase/functions/send-invitation-email/`
- Handles invitation notifications
- Uses Resend API for reliable delivery

### Authentication (Google OAuth)
- Production OAuth redirect URLs configured
- Token handling through Supabase Auth
- User profile creation triggers

## Testing & Deployment

### Local Development
- Use `.env` file for environment variables
- Test assignment features with multiple users
- Verify backward compatibility with old list formats

### Production Deployment
- Vercel automatic deployment from `master` branch
- Environment variables configured in Vercel dashboard
- OAuth redirect URLs must match production domain

## File Structure Context
```
ShoppingOrganizer/
├── script.js              # Main app logic with assignment features
├── styles.css             # CSS including assignment UI styles
├── database-schema.sql    # Database schema with collaboration tables
├── database-functions.sql # Database functions for profile lookups
└── supabase/functions/    # Email notification edge functions
```

## Known Issues & Solutions
- **Profile Loading**: Using dual fallback (RPC + direct table query)
- **Assignment Display**: Email fallback when display_name unavailable
- **Data Migration**: Automatic conversion from old to new format

## Next Development Priorities
1. Enhanced assignment notifications
2. Category-level permissions
3. Assignment history tracking
4. Mobile app optimization

---
**Last Updated**: Latest assignment feature implementation  
**Maintained by**: Claude Code collaborative development