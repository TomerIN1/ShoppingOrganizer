class ShoppingListOrganizer {
    constructor() {
        this.categories = {
            'Fruits & Vegetables': [
                'apple', 'banana', 'orange', 'grape', 'strawberry', 'blueberry', 'raspberry', 'blackberry',
                'pineapple', 'mango', 'peach', 'pear', 'plum', 'cherry', 'kiwi', 'lemon', 'lime', 'avocado',
                'tomato', 'potato', 'onion', 'garlic', 'carrot', 'celery', 'lettuce', 'spinach', 'broccoli',
                'cauliflower', 'cabbage', 'bell pepper', 'cucumber', 'zucchini', 'mushroom', 'corn', 'peas',
                'green beans', 'asparagus', 'radish', 'beetroot', 'sweet potato', 'eggplant', 'squash',
                'parsley', 'cilantro', 'basil', 'mint', 'dill', 'rosemary', 'thyme', 'oregano'
            ],
            'Meat & Seafood': [
                'chicken', 'beef', 'pork', 'turkey', 'lamb', 'duck', 'bacon', 'ham', 'sausage', 'ground beef',
                'ground turkey', 'chicken breast', 'chicken thigh', 'steak', 'ribs', 'pork chops', 'salmon',
                'tuna', 'cod', 'shrimp', 'crab', 'lobster', 'mussels', 'clams', 'scallops', 'fish', 'seafood'
            ],
            'Dairy & Eggs': [
                'milk', 'cheese', 'butter', 'yogurt', 'cream', 'sour cream', 'cottage cheese', 'cream cheese',
                'mozzarella', 'cheddar', 'parmesan', 'swiss cheese', 'feta', 'goat cheese', 'eggs', 'egg whites',
                'heavy cream', 'half and half', 'buttermilk', 'whipped cream'
            ],
            'Bakery & Bread': [
                'bread', 'bagel', 'muffin', 'croissant', 'baguette', 'rolls', 'pita', 'tortilla', 'wrap',
                'sandwich bread', 'whole wheat bread', 'sourdough', 'rye bread', 'english muffin', 'naan',
                'crackers', 'breadcrumbs', 'cake', 'cookies', 'pastry', 'donut', 'danish'
            ],
            'Pantry & Canned Goods': [
                'rice', 'pasta', 'flour', 'sugar', 'salt', 'pepper', 'olive oil', 'vegetable oil', 'vinegar',
                'soy sauce', 'ketchup', 'mustard', 'mayonnaise', 'hot sauce', 'BBQ sauce', 'honey', 'maple syrup',
                'vanilla', 'baking powder', 'baking soda', 'spices', 'herbs', 'canned tomatoes', 'tomato sauce',
                'tomato paste', 'chicken broth', 'vegetable broth', 'beef broth', 'coconut milk', 'canned beans',
                'black beans', 'kidney beans', 'chickpeas', 'lentils', 'quinoa', 'oats', 'cereal', 'granola',
                'nuts', 'almonds', 'walnuts', 'peanut butter', 'jam', 'jelly', 'pickles', 'olives'
            ],
            'Frozen Foods': [
                'frozen vegetables', 'frozen fruit', 'frozen berries', 'ice cream', 'frozen yogurt', 'frozen pizza',
                'frozen meals', 'frozen chicken', 'frozen fish', 'frozen shrimp', 'frozen fries', 'frozen peas',
                'frozen corn', 'frozen spinach', 'frozen broccoli', 'popsicles', 'frozen waffles', 'frozen bagels'
            ],
            'Beverages': [
                'water', 'soda', 'juice', 'coffee', 'tea', 'beer', 'wine', 'sparkling water', 'energy drink',
                'sports drink', 'coconut water', 'almond milk', 'soy milk', 'oat milk', 'orange juice',
                'apple juice', 'cranberry juice', 'lemonade', 'iced tea', 'kombucha'
            ],
            'Snacks & Sweets': [
                'chips', 'popcorn', 'pretzels', 'crackers', 'cookies', 'candy', 'chocolate', 'gum', 'mints',
                'granola bars', 'protein bars', 'trail mix', 'dried fruit', 'jerky', 'ice cream', 'cake',
                'pie', 'donuts', 'candy bars', 'gummy bears', 'marshmallows'
            ],
            'Health & Beauty': [
                'shampoo', 'conditioner', 'body wash', 'soap', 'toothpaste', 'toothbrush', 'deodorant',
                'lotion', 'sunscreen', 'vitamins', 'medicine', 'bandages', 'tissues', 'toilet paper',
                'feminine products', 'razors', 'shaving cream', 'makeup', 'skincare', 'moisturizer'
            ],
            'Household & Cleaning': [
                'detergent', 'fabric softener', 'dish soap', 'sponges', 'paper towels', 'garbage bags',
                'aluminum foil', 'plastic wrap', 'parchment paper', 'cleaning supplies', 'disinfectant',
                'bleach', 'glass cleaner', 'all-purpose cleaner', 'laundry pods', 'dryer sheets',
                'air freshener', 'candles', 'matches', 'batteries', 'light bulbs'
            ]
        };

        this.currentLists = {};
        this.currentListId = null; // Track current list ID for updates
        this.currentUser = null;
        this.mode = 'guest'; // 'guest' or 'authenticated'
        
        this.initializeApp();
    }

    async initializeApp() {
        this.initializeEventListeners();
        
        // Wait for Supabase to initialize
        await this.waitForSupabase();
        
        // Check for existing authentication
        await this.checkAuthStatus();
    }

    async waitForSupabase() {
        return new Promise((resolve) => {
            // Check if Supabase is already ready
            if (window.SupabaseConfig && window.SupabaseConfig.client()) {
                console.log('✅ Supabase already loaded successfully');
                resolve();
                return;
            }
            
            // Wait for the supabaseReady event
            const handleSupabaseReady = () => {
                if (window.SupabaseConfig && window.SupabaseConfig.client()) {
                    console.log('✅ Supabase loaded successfully');
                    window.removeEventListener('supabaseReady', handleSupabaseReady);
                    resolve();
                } else {
                    console.warn('⚠️ Supabase ready event fired but client not available');
                    setTimeout(() => resolve(), 1000); // Fallback
                }
            };
            
            window.addEventListener('supabaseReady', handleSupabaseReady);
            
            // Fallback timeout
            setTimeout(() => {
                window.removeEventListener('supabaseReady', handleSupabaseReady);
                if (window.SupabaseConfig && window.SupabaseConfig.client()) {
                    console.log('✅ Supabase loaded via fallback');
                } else {
                    console.warn('⚠️ Supabase not loaded, running in guest mode only');
                }
                resolve();
            }, 3000);
        });
    }

    async checkAuthStatus() {
        if (!window.SupabaseConfig) return;
        
        try {
            // First, handle any OAuth redirect by getting session
            const supabaseClient = window.SupabaseConfig.client();
            if (supabaseClient) {
                // This will handle OAuth callback URLs
                const { data: { session }, error } = await supabaseClient.auth.getSession();
                
                if (error) {
                    console.warn('Session initialization error:', error.message);
                } else if (session?.user) {
                    await this.switchToAuthenticatedMode(session.user);
                }
            }
            
            // Then check for existing user
            const user = await window.SupabaseConfig.auth.getCurrentUser();
            if (user && !this.currentUser) {
                await this.switchToAuthenticatedMode(user);
            }
            
            // Listen for auth state changes
            window.SupabaseConfig.auth.onAuthStateChange(async (event, session) => {
                console.log('Auth state change:', event, !!session, session?.user?.email);
                
                if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && session?.user) {
                    await this.switchToAuthenticatedMode(session.user);
                } else if (event === 'SIGNED_OUT') {
                    this.switchToGuestMode();
                }
            });
        } catch (error) {
            console.error('Error checking auth status:', error);
        }
    }

    initializeEventListeners() {
        // Existing event listeners
        document.getElementById('organizeBtn').addEventListener('click', () => this.organizeList());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearInput());
        document.getElementById('addCategoryBtn').addEventListener('click', () => this.addNewCategory());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveList());
        document.getElementById('loadBtn').addEventListener('click', () => this.loadList());
        document.getElementById('newListBtn').addEventListener('click', () => this.newList());
        document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileLoad(e));

        // Authentication event listeners
        document.getElementById('signInBtn').addEventListener('click', () => this.signIn());
        document.getElementById('signOutBtn').addEventListener('click', () => this.signOut());
        document.getElementById('myListsBtn').addEventListener('click', () => this.showMyLists());
        document.getElementById('sharedListsBtn').addEventListener('click', () => this.showSharedLists());

        document.getElementById('freeTextInput').addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.organizeList();
            }
        });
    }

    async signIn() {
        if (!window.SupabaseConfig) {
            alert('Authentication not available. Please refresh the page.');
            return;
        }
        
        try {
            await window.SupabaseConfig.auth.signInWithGoogle();
        } catch (error) {
            console.error('Sign-in error:', error);
            alert('Sign-in failed. Please try again.');
        }
    }

    async signOut() {
        if (!window.SupabaseConfig) return;
        
        try {
            await window.SupabaseConfig.auth.signOut();
            this.switchToGuestMode();
        } catch (error) {
            console.error('Sign-out error:', error);
        }
    }

    async switchToAuthenticatedMode(user) {
        this.currentUser = user;
        this.mode = 'authenticated';
        
        // Update UI
        document.getElementById('guestMode').style.display = 'none';
        document.getElementById('authenticatedMode').style.display = 'flex';
        
        // Update user info
        document.getElementById('userName').textContent = user.user_metadata?.full_name || user.email;
        const avatar = document.getElementById('userAvatar');
        avatar.src = user.user_metadata?.avatar_url || 'https://via.placeholder.com/40';
        
        console.log('✅ Switched to authenticated mode');
    }

    switchToGuestMode() {
        this.currentUser = null;
        this.mode = 'guest';
        
        // Update UI
        document.getElementById('guestMode').style.display = 'flex';
        document.getElementById('authenticatedMode').style.display = 'none';
        
        console.log('ℹ️ Switched to guest mode');
    }

    async showMyLists() {
        // TODO: Implement cloud lists view
        alert('My Lists feature coming soon!');
    }

    async showSharedLists() {
        // TODO: Implement shared lists view
        alert('Shared Lists feature coming soon!');
    }

    // Auto-save functionality
    async autoSaveCurrentList() {
        console.log('🔍 autoSaveCurrentList called:', {
            hasSupabaseConfig: !!window.SupabaseConfig,
            currentUser: !!this.currentUser,
            mode: this.mode,
            currentListsCount: Object.keys(this.currentLists).length
        });

        if (!window.SupabaseConfig || !this.currentUser) {
            console.warn('❌ Auto-save skipped - missing SupabaseConfig or user');
            return;
        }

        this.showSaveIndicator('saving');
        
        try {
            // Generate a title based on the current date or items
            const now = new Date();
            const title = `Shopping List - ${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
            
            console.log('💾 Attempting to save list:', { title, currentListId: this.currentListId });
            
            // Save or update the current list
            if (this.currentListId) {
                // Update existing list
                await window.SupabaseConfig.database.updateList(this.currentListId, {
                    title: title,
                    categories: this.currentLists,
                    updated_at: new Date().toISOString()
                });
                console.log('📤 List auto-saved to cloud');
            } else {
                // Create new list
                const savedList = await window.SupabaseConfig.database.createList(title, this.currentLists);
                this.currentListId = savedList.id;
                console.log('📤 New list created and saved to cloud:', savedList.id);
            }

            // Show save indicator
            this.showSaveIndicator('saved');
        } catch (error) {
            console.error('❌ Failed to auto-save list:', error);
            this.showSaveIndicator('error');
        }
    }

    // Visual indicator for save status
    showSaveIndicator(status) {
        console.log('🎯 showSaveIndicator called with status:', status);
        
        // Create or update save indicator
        let indicator = document.getElementById('save-indicator');
        if (!indicator) {
            console.log('📝 Creating new save indicator element');
            indicator = document.createElement('div');
            indicator.id = 'save-indicator';
            indicator.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 14px;
                z-index: 1000;
                transition: opacity 0.3s ease;
                font-weight: bold;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            `;
            document.body.appendChild(indicator);
            console.log('✅ Save indicator element added to DOM');
        }

        if (status === 'saving') {
            indicator.textContent = '💾 Saving...';
            indicator.style.backgroundColor = '#f39c12';
            indicator.style.color = 'white';
        } else if (status === 'saved') {
            indicator.textContent = '✅ Saved to cloud';
            indicator.style.backgroundColor = '#27ae60';
            indicator.style.color = 'white';
        } else if (status === 'error') {
            indicator.textContent = '❌ Save failed';
            indicator.style.backgroundColor = '#e74c3c';
            indicator.style.color = 'white';
        }

        indicator.style.opacity = '1';
        console.log('📍 Indicator visible:', {
            text: indicator.textContent,
            position: indicator.style.position,
            top: indicator.style.top,
            right: indicator.style.right,
            opacity: indicator.style.opacity,
            zIndex: indicator.style.zIndex
        });
        
        // Hide after 3 seconds (increased for better visibility)
        setTimeout(() => {
            indicator.style.opacity = '0';
            console.log('👻 Indicator hidden');
        }, 3000);
    }

    parseTextInput(text) {
        const lines = text.split('\n');
        const items = [];

        lines.forEach(line => {
            line = line.trim();
            if (line) {
                if (line.includes(',')) {
                    const lineItems = line.split(',').map(item => item.trim()).filter(item => item);
                    items.push(...lineItems);
                } else if (line.includes(';')) {
                    const lineItems = line.split(';').map(item => item.trim()).filter(item => item);
                    items.push(...lineItems);
                } else {
                    items.push(line);
                }
            }
        });

        return items.filter(item => item.length > 0);
    }

    categorizeItems(items) {
        const categorizedItems = {};
        const uncategorized = [];

        items.forEach(item => {
            const normalizedItem = item.toLowerCase().trim();
            let categoryFound = false;

            for (const [category, keywords] of Object.entries(this.categories)) {
                if (keywords.some(keyword => 
                    normalizedItem.includes(keyword) || 
                    keyword.includes(normalizedItem) ||
                    this.fuzzyMatch(normalizedItem, keyword)
                )) {
                    if (!categorizedItems[category]) {
                        categorizedItems[category] = [];
                    }
                    categorizedItems[category].push(item);
                    categoryFound = true;
                    break;
                }
            }

            if (!categoryFound) {
                uncategorized.push(item);
            }
        });

        if (uncategorized.length > 0) {
            categorizedItems['Other'] = uncategorized;
        }

        return categorizedItems;
    }

    fuzzyMatch(str1, str2) {
        const maxLength = Math.max(str1.length, str2.length);
        const distance = this.levenshteinDistance(str1, str2);
        const similarity = 1 - distance / maxLength;
        return similarity > 0.7;
    }

    levenshteinDistance(str1, str2) {
        const matrix = [];

        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }

        return matrix[str2.length][str1.length];
    }

    async organizeList() {
        const inputText = document.getElementById('freeTextInput').value;
        if (!inputText.trim()) {
            alert('Please enter some shopping items first!');
            return;
        }

        const items = this.parseTextInput(inputText);
        this.currentLists = this.categorizeItems(items);
        this.renderCategorizedLists();
        document.getElementById('organizedSection').style.display = 'block';
        document.getElementById('freeTextInput').value = '';

        // Auto-save to cloud if authenticated
        if (this.mode === 'authenticated' && this.currentUser) {
            await this.autoSaveCurrentList();
        }
    }

    renderCategorizedLists() {
        const container = document.getElementById('categorizedLists');
        container.innerHTML = '';

        if (Object.keys(this.currentLists).length === 0) {
            container.innerHTML = '<div class="empty-state">No items to display</div>';
            return;
        }

        Object.entries(this.currentLists).forEach(([category, items]) => {
            const categoryCard = this.createCategoryCard(category, items);
            container.appendChild(categoryCard);
        });
    }

    createCategoryCard(category, items) {
        const card = document.createElement('div');
        card.className = 'category-card';
        const categoryId = category.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
        
        card.innerHTML = `
            <div class="category-header">
                <div class="category-header-left">
                    <h3 class="category-title" onclick="organizer.editCategoryName('${category}')" title="Click to edit category name">${category}</h3>
                </div>
                <div class="category-header-right">
                    <span class="item-count">${items.length} items</span>
                    <button class="btn-category-action btn-delete-category" onclick="organizer.deleteCategory('${category}')" title="Delete category">×</button>
                </div>
            </div>
            <div class="category-content">
                <div class="add-item-form">
                    <input type="text" class="add-item-input" placeholder="Add new item...">
                    <button class="btn-add" onclick="organizer.addItem('${category}', this).catch(console.error)">Add</button>
                </div>
                <ul class="items-list" id="list-${categoryId}">
                    ${items.map(item => this.createItemHTML(category, item)).join('')}
                </ul>
            </div>
        `;

        card.querySelector('.add-item-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addItem(category, e.target.nextElementSibling);
            }
        });

        return card;
    }

    createItemHTML(category, item) {
        const itemId = `${category}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        return `
            <li class="item-row" id="${itemId}">
                <input type="text" class="item-text" value="${item}" 
                       onblur="organizer.updateItem('${category}', '${itemId}', this.value).catch(console.error)"
                       onkeypress="if(event.key==='Enter') this.blur()">
                <div class="item-actions">
                    <button class="btn-delete" onclick="organizer.deleteItem('${category}', '${itemId}').catch(console.error)">Delete</button>
                </div>
            </li>
        `;
    }

    async addItem(category, buttonElement) {
        const input = buttonElement.previousElementSibling;
        const newItem = input.value.trim();
        
        if (newItem) {
            if (!this.currentLists[category]) {
                this.currentLists[category] = [];
            }
            
            this.currentLists[category].push(newItem);
            
            const categoryId = category.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
            const listElement = document.getElementById(`list-${categoryId}`);
            const itemHTML = this.createItemHTML(category, newItem);
            listElement.insertAdjacentHTML('beforeend', itemHTML);
            
            input.value = '';
            
            const categoryHeader = buttonElement.closest('.category-card').querySelector('.item-count');
            categoryHeader.textContent = `${this.currentLists[category].length} items`;

            // Auto-save to cloud if authenticated
            if (this.mode === 'authenticated' && this.currentUser) {
                await this.autoSaveCurrentList();
            }
        }
    }

    async updateItem(category, itemId, newValue) {
        const itemElement = document.getElementById(itemId);
        const itemIndex = Array.from(itemElement.parentNode.children).indexOf(itemElement);
        
        if (this.currentLists[category] && this.currentLists[category][itemIndex] !== undefined) {
            this.currentLists[category][itemIndex] = newValue.trim();

            // Auto-save to cloud if authenticated
            if (this.mode === 'authenticated' && this.currentUser) {
                await this.autoSaveCurrentList();
            }
        }
    }

    async deleteItem(category, itemId) {
        const itemElement = document.getElementById(itemId);
        const itemIndex = Array.from(itemElement.parentNode.children).indexOf(itemElement);
        
        if (this.currentLists[category] && this.currentLists[category][itemIndex] !== undefined) {
            this.currentLists[category].splice(itemIndex, 1);
            
            if (this.currentLists[category].length === 0) {
                delete this.currentLists[category];
            }
            
            itemElement.remove();
            
            const categoryId = category.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
            const categoryCard = document.querySelector(`#list-${categoryId}`).closest('.category-card');
            if (this.currentLists[category]) {
                const categoryHeader = categoryCard.querySelector('.item-count');
                categoryHeader.textContent = `${this.currentLists[category].length} items`;
            } else {
                categoryCard.remove();
            }
            
            if (Object.keys(this.currentLists).length === 0) {
                document.getElementById('organizedSection').style.display = 'none';
            }

            // Auto-save to cloud if authenticated
            if (this.mode === 'authenticated' && this.currentUser) {
                await this.autoSaveCurrentList();
            }
        }
    }

    clearInput() {
        document.getElementById('freeTextInput').value = '';
    }

    saveList() {
        if (Object.keys(this.currentLists).length === 0) {
            alert('No shopping list to save!');
            return;
        }

        const dataStr = JSON.stringify({
            lists: this.currentLists,
            timestamp: new Date().toISOString(),
            version: '1.0'
        }, null, 2);

        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `shopping-list-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    loadList() {
        document.getElementById('fileInput').click();
    }

    handleFileLoad(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.lists && typeof data.lists === 'object') {
                    this.currentLists = data.lists;
                    this.renderCategorizedLists();
                    document.getElementById('organizedSection').style.display = 'block';
                } else {
                    alert('Invalid file format. Please select a valid shopping list file.');
                }
            } catch (error) {
                alert('Error loading file. Please make sure it\'s a valid JSON file.');
            }
        };
        
        reader.readAsText(file);
        event.target.value = '';
    }

    newList() {
        if (Object.keys(this.currentLists).length > 0) {
            const message = this.mode === 'authenticated' 
                ? 'Are you sure you want to start a new list? Current list is already saved to cloud.' 
                : 'Are you sure you want to start a new list? Current list will be lost if not saved.';
                
            if (confirm(message)) {
                this.currentLists = {};
                this.currentListId = null; // Reset for new list
                document.getElementById('organizedSection').style.display = 'none';
                document.getElementById('freeTextInput').value = '';
            }
        }
    }

    async addNewCategory() {
        if (Object.keys(this.currentLists).length === 0) {
            alert('Please organize a shopping list first before adding categories!');
            return;
        }

        const categoryName = prompt('Enter the name for the new category:');
        if (categoryName && categoryName.trim()) {
            const trimmedName = categoryName.trim();
            
            if (this.currentLists[trimmedName]) {
                alert('A category with this name already exists!');
                return;
            }
            
            this.currentLists[trimmedName] = [];
            this.renderCategorizedLists();

            // Auto-save to cloud if authenticated
            if (this.mode === 'authenticated' && this.currentUser) {
                await this.autoSaveCurrentList();
            }
        }
    }

    async editCategoryName(oldCategoryName) {
        const categoryElement = event.target;
        const newCategoryName = prompt('Enter new category name:', oldCategoryName);
        
        if (newCategoryName && newCategoryName.trim() && newCategoryName.trim() !== oldCategoryName) {
            const trimmedName = newCategoryName.trim();
            
            if (this.currentLists[trimmedName]) {
                alert('A category with this name already exists!');
                return;
            }
            
            this.currentLists[trimmedName] = this.currentLists[oldCategoryName];
            delete this.currentLists[oldCategoryName];
            this.renderCategorizedLists();

            // Auto-save to cloud if authenticated
            if (this.mode === 'authenticated' && this.currentUser) {
                await this.autoSaveCurrentList();
            }
        }
    }

    async deleteCategory(categoryName) {
        if (confirm(`Are you sure you want to delete the "${categoryName}" category and all its items?`)) {
            delete this.currentLists[categoryName];
            
            if (Object.keys(this.currentLists).length === 0) {
                document.getElementById('organizedSection').style.display = 'none';
            } else {
                this.renderCategorizedLists();
            }

            // Auto-save to cloud if authenticated
            if (this.mode === 'authenticated' && this.currentUser) {
                await this.autoSaveCurrentList();
            }
        }
    }
}

const organizer = new ShoppingListOrganizer();