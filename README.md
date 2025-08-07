# Shopping List Organizer

A modern, intuitive web application that transforms unorganized shopping lists into categorized, manageable lists. Simply paste your shopping items in free text format, and the app intelligently organizes them into supermarket categories.

## 🚀 Features

### Core Functionality
- **Free Text Input**: Paste or type your shopping list in any format (comma-separated, line-separated, or semicolon-separated)
- **Smart Categorization**: Automatically sorts items into 10 predefined supermarket categories using fuzzy matching
- **Real-time Organization**: Instantly organizes your list with a single button click

### Category Management
- **Edit Categories**: Click on any category title to rename it
- **Delete Categories**: Remove entire categories with confirmation dialog
- **Add New Categories**: Create custom categories for personalized organization
- **Duplicate Prevention**: Prevents creation of categories with identical names

### Item Management
- **Add Items**: Add new items to any category
- **Edit Items**: Click on any item to edit its name inline
- **Delete Items**: Remove individual items from categories
- **Item Counter**: Real-time count of items in each category

### Data Persistence
- **Save Lists**: Export organized lists as JSON files
- **Load Lists**: Import previously saved lists
- **Auto-formatting**: Maintains list structure and organization

### User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface with hover effects and animations
- **Keyboard Shortcuts**: Ctrl+Enter to organize list, Enter to add items
- **Confirmation Dialogs**: Prevents accidental deletions

## 🛒 Default Categories

The app includes 10 predefined categories with over 200 common grocery items:

1. **Fruits & Vegetables** - Fresh produce, herbs, and vegetables
2. **Meat & Seafood** - All types of meat, poultry, and seafood
3. **Dairy & Eggs** - Milk products, cheese, eggs, and dairy alternatives
4. **Bakery & Bread** - Bread, pastries, and baked goods
5. **Pantry & Canned Goods** - Dry goods, canned items, condiments, and spices
6. **Frozen Foods** - Frozen meals, vegetables, and treats
7. **Beverages** - Drinks, juices, coffee, tea, and alcoholic beverages
8. **Snacks & Sweets** - Chips, candy, cookies, and sweet treats
9. **Health & Beauty** - Personal care items, vitamins, and medications
10. **Household & Cleaning** - Cleaning supplies, paper products, and household items

## 🎯 How to Use

### Getting Started
1. Open `index.html` in your web browser
2. Enter your shopping items in the large text area
3. Click "Organize List" or press Ctrl+Enter
4. Your items will automatically be sorted into categories

### Managing Categories
- **Rename**: Click on any category title to edit its name
- **Delete**: Click the "×" button in the category header to remove it
- **Add New**: Click "Add Category" button to create custom categories

### Managing Items
- **Add**: Type in the input field within any category and click "Add" or press Enter
- **Edit**: Click directly on any item text to edit it inline
- **Delete**: Click the "Delete" button next to any item

### Saving and Loading
- **Save**: Click "Save List" to download your organized list as a JSON file
- **Load**: Click "Load List" to import a previously saved list
- **New List**: Click "New List" to start fresh (with confirmation if unsaved changes exist)

## 🏗️ Project Structure

```
ShoppingOrganizer/
├── index.html          # Main HTML structure
├── styles.css          # Complete CSS styling and responsive design
├── script.js           # JavaScript functionality and logic
└── README.md          # This documentation file
```

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Grid, Flexbox, and CSS animations
- **Vanilla JavaScript**: No external dependencies, pure ES6+ JavaScript

### Key Components

#### ShoppingListOrganizer Class (script.js)
- **Categories Database**: Predefined categories with keyword matching
- **Text Parsing**: Handles multiple input formats (comma, line, semicolon separated)
- **Fuzzy Matching**: Levenshtein distance algorithm for intelligent categorization
- **DOM Manipulation**: Dynamic category and item rendering
- **Local Storage**: JSON-based save/load functionality

#### Responsive Design (styles.css)
- **Grid Layout**: Auto-fit grid for category cards
- **Mobile-First**: Responsive breakpoints for all device sizes
- **Modern UI**: Gradient backgrounds, hover effects, and smooth transitions
- **Accessibility**: High contrast colors and keyboard navigation support

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📱 Installation & Setup

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/TomerIN1/ShoppingOrganizer.git
   ```
2. Navigate to the project directory:
   ```bash
   cd ShoppingOrganizer
   ```
3. Open `index.html` in your web browser

### GitHub Pages (Live Demo)
1. Go to repository Settings
2. Navigate to Pages section
3. Select "Deploy from a branch"
4. Choose "main" branch and "/" (root) folder
5. Save and visit the provided URL

## 🤝 Contributing

This project was created with Claude Code. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly across different browsers
5. Submit a pull request

## 🔄 Version History

### v1.0.0 (Initial Release)
- Free text input and smart categorization
- 10 predefined categories with 200+ items
- Full CRUD operations for categories and items
- Save/load functionality
- Responsive design
- Category management (add/edit/delete)
- Confirmation dialogs for destructive actions

## 📋 Future Enhancements

Potential features for future versions:
- Dark mode toggle
- Multiple list management
- Recipe integration
- Barcode scanning (mobile)
- Store layout optimization
- Collaborative list sharing
- Price tracking integration

## 🛠️ Development Notes

### Smart Categorization Algorithm
The app uses a multi-step categorization process:
1. **Exact Match**: Direct keyword matching
2. **Partial Match**: Substring detection
3. **Fuzzy Match**: Levenshtein distance algorithm (70% similarity threshold)
4. **Fallback**: Items that don't match any category go to "Other"

### Data Structure
```javascript
currentLists = {
  "Category Name": ["item1", "item2", "item3"],
  "Another Category": ["item4", "item5"]
}
```

### Event Handling
- Uses event delegation for dynamic content
- Keyboard shortcuts for improved UX
- Confirmation dialogs prevent accidental data loss

---

**Built with ❤️ using Claude Code**

For issues or feature requests, please visit the [GitHub repository](https://github.com/TomerIN1/ShoppingOrganizer).