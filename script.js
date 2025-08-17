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
                'nuts', 'almonds', 'walnuts', 'peanut butter', 'jam', 'jelly', 'pickles', 'olives', 'tempeh'
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
        this.currentListName = null; // Track current list name
        this.currentUser = null;
        this.mode = 'guest'; // 'guest' or 'authenticated'
        this.currentCollaborators = []; // Track current list collaborators for assignments
        
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
        document.getElementById('newListBtn').addEventListener('click', () => this.newList());
        document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileLoad(e));

        // Authentication event listeners
        document.getElementById('signInBtn').addEventListener('click', () => this.signIn());
        document.getElementById('signOutBtn').addEventListener('click', () => this.signOut());
        document.getElementById('myListsBtn').addEventListener('click', () => this.showMyLists());
        
        // User dropdown functionality (safely handle if element doesn't exist)
        const userProfile = document.getElementById('userProfile');
        if (userProfile) {
            userProfile.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleUserDropdown();
            });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            this.closeUserDropdown();
        });

        // My Lists dashboard event listeners
        document.getElementById('backToMainBtn').addEventListener('click', () => this.backToMain());
        document.getElementById('refreshListsBtn').addEventListener('click', () => this.loadMyLists());

        // Shared Lists dashboard event listeners
        // Note: Shared lists are now integrated into My Lists page

        // Share and export functionality event listeners
        document.getElementById('downloadWhatsAppBtn').addEventListener('click', () => this.copyToWhatsApp());
        document.getElementById('shareListBtn').addEventListener('click', () => this.showShareModal());
        document.getElementById('shareModalClose').addEventListener('click', () => this.hideShareModal());
        document.getElementById('shareModalBackdrop').addEventListener('click', () => this.hideShareModal());
        document.getElementById('sendInviteBtn').addEventListener('click', () => this.sendListInvitation());

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
    
    toggleUserDropdown() {
        const dropdown = document.getElementById('userDropdown');
        const profile = document.getElementById('userProfile');
        
        if (dropdown.style.display === 'none' || !dropdown.style.display) {
            dropdown.style.display = 'block';
            profile.classList.add('active');
        } else {
            dropdown.style.display = 'none';
            profile.classList.remove('active');
        }
    }
    
    closeUserDropdown() {
        const dropdown = document.getElementById('userDropdown');
        const profile = document.getElementById('userProfile');
        
        if (dropdown) {
            dropdown.style.display = 'none';
        }
        if (profile) {
            profile.classList.remove('active');
        }
    }

    async switchToAuthenticatedMode(user) {
        this.currentUser = user;
        this.mode = 'authenticated';
        
        // Update UI - hide guest mode, show authenticated mode
        document.getElementById('guestMode').style.display = 'none';
        document.getElementById('authenticatedMode').style.display = 'flex';
        
        // Update user info in compact header
        const userName = user.user_metadata?.full_name || user.email;
        document.getElementById('userName').textContent = userName;
        
        const avatar = document.getElementById('userAvatar');
        avatar.src = user.user_metadata?.avatar_url || 'https://via.placeholder.com/32';
        avatar.alt = userName;
        
        console.log('✅ Switched to authenticated mode');
    }

    switchToGuestMode() {
        this.currentUser = null;
        this.mode = 'guest';
        
        // Update UI - show guest mode, hide authenticated mode
        document.getElementById('guestMode').style.display = 'flex';
        document.getElementById('authenticatedMode').style.display = 'none';
        
        // Close dropdown if open
        this.closeUserDropdown();
        
        console.log('ℹ️ Switched to guest mode');
    }

    async showMyLists() {
        if (!window.SupabaseConfig || !this.currentUser) {
            alert('Please sign in to view your lists.');
            return;
        }

        // Hide other sections and show My Lists
        document.getElementById('organizedSection').style.display = 'none';
        document.querySelector('.input-section').style.display = 'none';
        document.getElementById('myListsSection').style.display = 'block';

        // Load both personal and shared lists
        await this.loadMyLists();
        await this.loadSharedLists();
    }

    async showSharedLists() {
        // Shared lists are now integrated into My Lists page
        await this.showMyLists();
    }

    backToMain() {
        // Show main sections and hide My Lists
        document.getElementById('myListsSection').style.display = 'none';
        document.querySelector('.input-section').style.display = 'block';
        
        // Show organized section if there's a current list
        if (Object.keys(this.currentLists).length > 0) {
            document.getElementById('organizedSection').style.display = 'block';
        }
        
        this.updateOrganizeButtonText(); // Update button text based on current state
    }

    backToMainFromShared() {
        // Since shared lists are now integrated into My Lists page, this should behave like backToMain
        this.backToMain();
    }

    async loadSharedLists() {
        if (!window.SupabaseConfig || !this.currentUser) {
            console.error('Not authenticated for loading shared lists');
            return;
        }

        const container = document.getElementById('sharedListsContainer');
        const loadingIndicator = document.getElementById('sharedListsLoading');
        
        // Show loading state
        loadingIndicator.style.display = 'block';
        const existingGrid = container.querySelector('.lists-grid');
        if (existingGrid) {
            existingGrid.style.display = 'none';
        }

        try {
            console.log('Loading shared lists...');
            const sharedLists = await window.SupabaseConfig.database.getSharedLists();
            console.log('Loaded shared lists:', sharedLists.length);

            // Hide loading indicator
            loadingIndicator.style.display = 'none';

            // Render the shared lists
            this.renderSharedLists(sharedLists);

        } catch (error) {
            console.error('Failed to load shared lists:', error);
            loadingIndicator.textContent = 'Failed to load shared lists. Please try again.';
            
            // Add retry functionality
            setTimeout(() => {
                loadingIndicator.innerHTML = `
                    Failed to load shared lists. 
                    <button onclick="organizer.loadSharedLists()" class="btn-primary" style="margin-left: 10px; padding: 8px 16px; font-size: 14px;">
                        Retry
                    </button>
                `;
            }, 1000);
        }
    }

    renderSharedLists(sharedLists) {
        const container = document.getElementById('sharedListsContainer');
        
        // Remove existing content
        const existingGrid = container.querySelector('.lists-grid');
        if (existingGrid) {
            existingGrid.remove();
        }
        
        const existingEmpty = container.querySelector('.empty-lists-state');
        if (existingEmpty) {
            existingEmpty.remove();
        }

        if (sharedLists.length === 0) {
            // Show empty state
            container.innerHTML += `
                <div class="empty-lists-state">
                    <h3>No Shared Lists Yet</h3>
                    <p>When someone shares a shopping list with you, it will appear here!</p>
                    <button onclick="organizer.backToMainFromShared()" class="btn-primary">Back to Main</button>
                </div>
            `;
            return;
        }

        // Create shared lists grid
        const listsGrid = document.createElement('div');
        listsGrid.className = 'lists-grid';

        sharedLists.forEach(list => {
            const listCard = this.createSharedListCard(list);
            listsGrid.appendChild(listCard);
        });

        container.appendChild(listsGrid);
    }

    createSharedListCard(list) {
        const card = document.createElement('div');
        card.className = 'list-card';
        
        // Format dates
        const createdDate = new Date(list.created_at).toLocaleDateString();
        const updatedDate = new Date(list.updated_at).toLocaleDateString();
        const isRecent = updatedDate !== createdDate;
        
        // Get categories preview
        const categories = Object.keys(list.categories || {});
        const totalItems = Object.values(list.categories || {}).reduce((sum, categoryData) => {
            const items = Array.isArray(categoryData) ? categoryData : (categoryData.items || []);
            return sum + items.length;
        }, 0);
        
        // Get permission level
        const permission = list.list_collaborators?.[0]?.permission_level || 'view';
        
        card.innerHTML = `
            <div class="list-card-header">
                <h3 class="list-title">${list.title}</h3>
                <div class="list-actions-mini">
                    <button class="btn-mini" onclick="organizer.loadSharedListFromCloud('${list.id}')" title="Open this shared list">Open</button>
                    <span class="permission-badge ${permission}">${permission === 'edit' ? 'Can Edit' : 'View Only'}</span>
                </div>
            </div>
            
            <div class="list-metadata">
                <span>📝 ${totalItems} items</span>
                <span>📁 ${categories.length} categories</span>
                <span>📅 ${isRecent ? `Updated ${updatedDate}` : `Created ${createdDate}`}</span>
                <span>👥 Shared with you</span>
            </div>
            
            <div class="list-categories-preview">
                ${categories.slice(0, 4).map(cat => 
                    `<span class="category-tag">${cat}</span>`
                ).join('')}
                ${categories.length > 4 ? `<span class="category-tag">+${categories.length - 4} more</span>` : ''}
            </div>
        `;

        // Add click handler to the card (excluding buttons)
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('btn-mini') && !e.target.classList.contains('permission-badge')) {
                this.loadSharedListFromCloud(list.id);
            }
        });

        return card;
    }

    async loadSharedListFromCloud(listId) {
        if (!window.SupabaseConfig || !this.currentUser) {
            alert('Authentication required to load shared list.');
            return;
        }

        try {
            console.log('Loading shared list from cloud:', listId);
            
            // Get the shared list data
            const sharedLists = await window.SupabaseConfig.database.getSharedLists();
            const list = sharedLists.find(l => l.id === listId);
            
            if (!list) {
                alert('Shared list not found.');
                return;
            }

            // Load the list data into current state
            this.currentLists = list.categories || {};
            this.currentListId = list.id;
            this.currentListName = list.title;
            
            // Update the UI
            document.getElementById('listNameInput').value = this.currentListName + ' (Shared)';
            
            // Render the list and go back to main view
            this.renderCategorizedLists();
            this.updateListTitle();
            
            // Show the organized section and hide shared lists
            this.backToMainFromShared();
            document.getElementById('organizedSection').style.display = 'block';
            this.updateShareButtonVisibility();
            this.updateOrganizeButtonText(); // Update button text for loaded list
            
            // Load collaborators for assignment feature
            await this.loadListCollaborators();
            
            console.log('✅ Shared list loaded successfully from cloud');

        } catch (error) {
            console.error('Failed to load shared list:', error);
            alert('Failed to load shared list. Please try again.');
        }
    }

    async enrichListsWithProfiles(lists) {
        // Enrich lists with user profile information for collaborators
        const enrichedLists = await Promise.all(lists.map(async (list) => {
            if (list.list_collaborators && list.list_collaborators.length > 0) {
                // Fetch profile information for each collaborator using simple profile table query
                const enrichedCollaborators = await Promise.all(
                    list.list_collaborators.map(async (collab) => {
                        try {
                            // First try to use the database function if it exists
                            console.log('Trying to fetch profile for user:', collab.user_id);
                            
                            const { data: profileData, error: rpcError } = await window.SupabaseConfig.client()
                                .rpc('get_user_profile_with_email', { user_id: collab.user_id });
                            
                            if (!rpcError && profileData && profileData.length > 0) {
                                const profile = profileData[0];
                                console.log('Successfully fetched profile via RPC:', profile);
                                return {
                                    ...collab,
                                    profiles: {
                                        display_name: profile.display_name || profile.email || `User ${collab.user_id.slice(0, 8)}`,
                                        email: profile.email || `user-${collab.user_id.slice(0, 8)}@example.com`,
                                        avatar_url: profile.avatar_url
                                    }
                                };
                            } else {
                                console.log('RPC function failed or returned no data:', rpcError);
                                
                                // Fallback: try to get profile from profiles table
                                const { data: profile, error } = await window.SupabaseConfig.client()
                                    .from('profiles')
                                    .select('display_name, avatar_url')
                                    .eq('id', collab.user_id)
                                    .single();
                                
                                if (!error && profile && profile.display_name) {
                                    console.log('Got profile from profiles table:', profile);
                                    return {
                                        ...collab,
                                        profiles: {
                                            display_name: profile.display_name,
                                            email: `user-${collab.user_id.slice(0, 8)}@example.com`,
                                            avatar_url: profile.avatar_url
                                        }
                                    };
                                } else {
                                    console.log('No profile data found, using fallback');
                                    // Final fallback - use a more descriptive name with part of user ID
                                    return {
                                        ...collab,
                                        profiles: {
                                            display_name: `User ${collab.user_id.slice(0, 8)}`,
                                            email: `user-${collab.user_id.slice(0, 8)}@example.com`
                                        }
                                    };
                                }
                            }
                        } catch (err) {
                            console.warn('Error fetching profile for user:', collab.user_id, err);
                            return {
                                ...collab,
                                profiles: {
                                    display_name: `User ${collab.user_id.slice(0, 8)}`,
                                    email: `user-${collab.user_id.slice(0, 8)}@example.com`
                                }
                            };
                        }
                    })
                );
                
                return {
                    ...list,
                    list_collaborators: enrichedCollaborators
                };
            }
            
            return list;
        }));
        
        return enrichedLists;
    }

    async loadMyLists() {
        if (!window.SupabaseConfig || !this.currentUser) {
            console.error('Not authenticated for loading lists');
            return;
        }

        const container = document.getElementById('myListsContainer');
        const loadingIndicator = document.getElementById('listsLoading');
        
        // Show loading state
        loadingIndicator.style.display = 'block';
        const existingGrid = container.querySelector('.lists-grid');
        if (existingGrid) {
            existingGrid.style.display = 'none';
        }

        try {
            console.log('Loading user lists...');
            const lists = await window.SupabaseConfig.database.getMyLists();
            console.log('Loaded lists:', lists.length);

            // Enrich lists with collaborator profile information
            const enrichedLists = await this.enrichListsWithProfiles(lists);

            // Hide loading indicator
            loadingIndicator.style.display = 'none';

            // Render the lists
            this.renderMyLists(enrichedLists);

        } catch (error) {
            console.error('Failed to load lists:', error);
            loadingIndicator.textContent = 'Failed to load lists. Please try again.';
            
            // Add retry functionality
            setTimeout(() => {
                loadingIndicator.innerHTML = `
                    Failed to load lists. 
                    <button onclick="organizer.loadMyLists()" class="btn-primary" style="margin-left: 10px; padding: 8px 16px; font-size: 14px;">
                        Retry
                    </button>
                `;
            }, 1000);
        }
    }

    renderMyLists(lists) {
        const container = document.getElementById('myListsContainer');
        
        // Remove existing content
        const existingGrid = container.querySelector('.lists-grid');
        if (existingGrid) {
            existingGrid.remove();
        }
        
        const existingEmpty = container.querySelector('.empty-lists-state');
        if (existingEmpty) {
            existingEmpty.remove();
        }

        if (lists.length === 0) {
            // Show empty state
            container.innerHTML += `
                <div class="empty-lists-state">
                    <h3>No Shopping Lists Yet</h3>
                    <p>Create your first shopping list by going back to the main page and organizing some items!</p>
                    <button onclick="organizer.backToMain()" class="btn-primary">Create First List</button>
                </div>
            `;
            return;
        }

        // Create lists grid
        const listsGrid = document.createElement('div');
        listsGrid.className = 'lists-grid';

        lists.forEach(list => {
            const listCard = this.createListCard(list);
            listsGrid.appendChild(listCard);
        });

        container.appendChild(listsGrid);
    }

    createListCard(list) {
        const card = document.createElement('div');
        
        // Check if list has collaborators
        const collaborators = list.list_collaborators || [];
        const acceptedCollaborators = collaborators.filter(c => c.accepted_at !== null);
        const isShared = acceptedCollaborators.length > 0;
        
        card.className = `list-card${isShared ? ' shared' : ''}`;
        
        // Format dates
        const createdDate = new Date(list.created_at).toLocaleDateString();
        const updatedDate = new Date(list.updated_at).toLocaleDateString();
        const isRecent = updatedDate !== createdDate;
        
        // Get categories preview
        const categories = Object.keys(list.categories || {});
        const totalItems = Object.values(list.categories || {}).reduce((sum, categoryData) => {
            const items = Array.isArray(categoryData) ? categoryData : (categoryData.items || []);
            return sum + items.length;
        }, 0);
        
        // Create sharing badge
        const sharingBadge = isShared ? 
            `<span class="sharing-badge" title="${acceptedCollaborators.length} collaborator${acceptedCollaborators.length !== 1 ? 's' : ''}">👥 ${acceptedCollaborators.length}</span>` : '';
        
        card.innerHTML = `
            <div class="list-card-header">
                <h3 class="list-title">${list.title} ${sharingBadge}</h3>
                <div class="list-actions-mini">
                    <button class="btn-mini" onclick="organizer.loadListFromCloud('${list.id}')" title="Open this list">Open</button>
                    <button class="btn-mini" onclick="organizer.shareListFromCard('${list.id}')" title="Share this list">Share</button>
                    <button class="btn-mini delete" onclick="organizer.deleteCloudList('${list.id}')" title="Delete this list">Delete</button>
                </div>
            </div>
            
            <div class="list-metadata">
                <span>📝 ${totalItems} items</span>
                <span>📁 ${categories.length} categories</span>
                <span>📅 ${isRecent ? `Updated ${updatedDate}` : `Created ${createdDate}`}</span>
                ${isShared ? `<span class="sharing-info clickable" onclick="organizer.toggleSharedUsers('${list.id}')">🔗 Shared with ${acceptedCollaborators.length} user${acceptedCollaborators.length !== 1 ? 's' : ''} <span class="expand-icon">▼</span></span>` : ''}
            </div>
            
            ${isShared ? `<div class="shared-users-section" id="shared-users-${list.id}" style="display: none;">
                <div class="shared-users-list">
                    ${acceptedCollaborators.map(collab => {
                        const profile = collab.profiles || {};
                        const displayName = profile.display_name || profile.email || 'Unknown User';
                        const permission = collab.permission_level === 'edit' ? 'Can Edit' : 'View Only';
                        return `
                            <div class="shared-user-item">
                                <div class="shared-user-info">
                                    <span class="user-name">${displayName}</span>
                                    <span class="user-permission">${permission}</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>` : ''}
            
            <div class="list-categories-preview">
                ${categories.slice(0, 4).map(cat => 
                    `<span class="category-tag">${cat}</span>`
                ).join('')}
                ${categories.length > 4 ? `<span class="category-tag">+${categories.length - 4} more</span>` : ''}
            </div>
        `;

        // Add click handler to the card (excluding buttons and sharing info)
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('btn-mini') && 
                !e.target.classList.contains('clickable') && 
                !e.target.closest('.sharing-info')) {
                this.loadListFromCloud(list.id);
            }
        });

        return card;
    }

    async loadListFromCloud(listId) {
        if (!window.SupabaseConfig || !this.currentUser) {
            alert('Authentication required to load list.');
            return;
        }

        try {
            console.log('Loading list from cloud:', listId);
            
            // Get the list data - we'll need to fetch it from the database
            const lists = await window.SupabaseConfig.database.getMyLists();
            const list = lists.find(l => l.id === listId);
            
            if (!list) {
                alert('List not found.');
                return;
            }

            // Load the list data into current state and ensure proper format
            const categories = list.categories || {};
            this.currentLists = {};
            
            // Convert old format (arrays) to new format (objects with items and assignments)
            Object.entries(categories).forEach(([categoryName, categoryData]) => {
                if (Array.isArray(categoryData)) {
                    // Old format - convert to new format
                    this.currentLists[categoryName] = { items: categoryData };
                } else {
                    // New format - use as is
                    this.currentLists[categoryName] = categoryData;
                }
            });
            
            this.currentListId = list.id;
            this.currentListName = list.title;
            
            // Update the UI
            document.getElementById('listNameInput').value = this.currentListName;
            
            // Render the list and go back to main view
            this.renderCategorizedLists();
            this.updateListTitle();
            
            // Show the organized section and hide my lists
            this.backToMain();
            document.getElementById('organizedSection').style.display = 'block';
            this.updateShareButtonVisibility();
            this.updateOrganizeButtonText(); // Update button text for loaded list
            
            // Load collaborators for assignment feature
            await this.loadListCollaborators();
            
            console.log('✅ List loaded successfully from cloud');

        } catch (error) {
            console.error('Failed to load list:', error);
            alert('Failed to load list. Please try again.');
        }
    }

    async deleteCloudList(listId) {
        if (!window.SupabaseConfig || !this.currentUser) {
            alert('Authentication required to delete list.');
            return;
        }

        if (!confirm('Are you sure you want to delete this list? This action cannot be undone.')) {
            return;
        }

        try {
            console.log('Deleting list from cloud:', listId);
            
            await window.SupabaseConfig.database.deleteList(listId);
            
            // If this is the currently loaded list, clear it
            if (this.currentListId === listId) {
                this.currentLists = {};
                this.currentListId = null;
                this.currentListName = null;
                document.getElementById('listNameInput').value = '';
                document.getElementById('organizedSection').style.display = 'none';
            }
            
            // Refresh the lists view
            await this.loadMyLists();
            
            console.log('✅ List deleted successfully');

        } catch (error) {
            console.error('Failed to delete list:', error);
            alert('Failed to delete list. Please try again.');
        }
    }

    async shareListFromCard(listId) {
        // Load the list temporarily to set current context
        try {
            const lists = await window.SupabaseConfig.database.getMyLists();
            const list = lists.find(l => l.id === listId);
            
            if (!list) {
                alert('List not found.');
                return;
            }

            // Temporarily set the current list ID for sharing
            const originalListId = this.currentListId;
            this.currentListId = listId;
            
            // Show share modal
            this.showShareModal();
            
            // Restore original list ID after modal is shown
            // We'll restore it when the modal is closed
            this.originalListIdForShare = originalListId;
            
        } catch (error) {
            console.error('Failed to share list:', error);
            alert('Failed to share list. Please try again.');
        }
    }

    toggleSharedUsers(listId) {
        const section = document.getElementById(`shared-users-${listId}`);
        const sharingInfo = document.querySelector(`[onclick="organizer.toggleSharedUsers('${listId}')"]`);
        const expandIcon = sharingInfo?.querySelector('.expand-icon');
        
        if (section) {
            const isHidden = section.style.display === 'none';
            section.style.display = isHidden ? 'block' : 'none';
            
            if (expandIcon) {
                expandIcon.textContent = isHidden ? '▲' : '▼';
            }
        }
    }

    // Updated hideShareModal to restore original list context
    hideShareModal() {
        document.getElementById('shareModal').style.display = 'none';
        this.hideShareStatus();
        
        // Restore original list context if it was temporarily changed
        if (this.originalListIdForShare !== undefined) {
            this.currentListId = this.originalListIdForShare;
            this.originalListIdForShare = undefined;
        }
    }

    updateShareButtonVisibility() {
        const shareButton = document.getElementById('shareListBtn');
        const whatsappButton = document.getElementById('downloadWhatsAppBtn');
        
        // Show share button only if:
        // 1. User is authenticated
        // 2. There is a current list with ID (saved to cloud)
        if (this.mode === 'authenticated' && this.currentUser && this.currentListId) {
            shareButton.style.display = 'inline-block';
        } else {
            shareButton.style.display = 'none';
        }
        
        // Show WhatsApp export button if there's any current list
        if (this.currentLists && Object.keys(this.currentLists).length > 0) {
            whatsappButton.style.display = 'inline-block';
        } else {
            whatsappButton.style.display = 'none';
        }
    }

    // Share functionality
    showShareModal() {
        console.log('🎬 showShareModal called:', { 
            hasSupabaseConfig: !!window.SupabaseConfig, 
            currentUser: !!this.currentUser, 
            currentListId: this.currentListId 
        });

        if (!window.SupabaseConfig || !this.currentUser) {
            console.error('❌ No authentication for sharing');
            alert('Please sign in to share lists.');
            return;
        }

        if (!this.currentListId) {
            console.error('❌ No current list ID for sharing');
            alert('Please save the list first before sharing.');
            return;
        }

        console.log('✅ Opening share modal for list:', this.currentListId);

        // Show the modal
        const modal = document.getElementById('shareModal');
        console.log('📱 Modal element:', modal);
        modal.style.display = 'flex';
        console.log('📱 Modal display set to flex');
        
        // Reset form
        document.getElementById('shareEmailInput').value = '';
        document.getElementById('sharePermissionSelect').value = 'view';
        
        // Load current collaborators
        this.loadListCollaborators();
    }

    hideShareModal() {
        document.getElementById('shareModal').style.display = 'none';
        this.hideShareStatus();
    }

    async loadListCollaborators() {
        console.log('🔄 loadListCollaborators called:', { currentListId: this.currentListId });
        
        if (!this.currentListId) {
            console.warn('⚠️ No current list ID, skipping collaborator load');
            return;
        }

        try {
            console.log('📋 Loading collaborators for list:', this.currentListId);
            const collaborators = await window.SupabaseConfig.database.getListCollaborators(this.currentListId);
            console.log('📊 Found collaborators:', collaborators.length, collaborators);
            
            // Debug: Log detailed collaborator structure
            collaborators.forEach((collab, index) => {
                console.log(`👤 Collaborator ${index}:`, {
                    user_id: collab.user_id,
                    permission_level: collab.permission_level,
                    profiles: collab.profiles,
                    email: collab.profiles?.email,
                    display_name: collab.profiles?.display_name
                });
            });
            
            // Store collaborators for use in assignment dropdowns
            this.currentCollaborators = collaborators;
            
            // Re-render categories to show assignment UI if collaborators were loaded
            if (collaborators.length > 0 && Object.keys(this.currentLists).length > 0) {
                this.renderCategorizedLists();
            }
            
            // Only render in modal if the share modal is visible
            const shareModal = document.getElementById('shareModal');
            if (shareModal && shareModal.style.display !== 'none') {
                this.renderCollaborators(collaborators);
            }
            
        } catch (error) {
            console.error('❌ Failed to load collaborators:', error);
            document.getElementById('sharedWithSection').style.display = 'none';
        }
    }

    renderCollaborators(collaborators) {
        const sharedWithSection = document.getElementById('sharedWithSection');
        const sharedWithList = document.getElementById('sharedWithList');
        
        if (collaborators.length === 0) {
            sharedWithSection.style.display = 'none';
            return;
        }

        // Show the section
        sharedWithSection.style.display = 'block';
        
        // Clear existing collaborators
        sharedWithList.innerHTML = '';
        
        collaborators.forEach(collaborator => {
            const userItem = this.createCollaboratorItem(collaborator);
            sharedWithList.appendChild(userItem);
        });
    }

    createCollaboratorItem(collaborator) {
        const item = document.createElement('div');
        item.className = 'shared-user-item';
        
        const profile = collaborator.profiles;
        const email = profile?.email || 'Unknown';
        const displayName = profile?.display_name || '';
        const initials = this.getInitials(displayName || email);
        
        item.innerHTML = `
            <div class="shared-user-info">
                <div class="shared-user-avatar">${initials}</div>
                <div class="shared-user-details">
                    <div class="shared-user-email">${email}</div>
                    <div class="shared-user-permission ${collaborator.permission_level}">
                        ${collaborator.permission_level === 'edit' ? 'Can edit' : 'View only'}
                    </div>
                </div>
            </div>
            <div class="shared-user-actions">
                <button class="btn-mini remove" onclick="organizer.removeCollaborator('${collaborator.user_id}')" title="Remove access">
                    Remove
                </button>
            </div>
        `;
        
        return item;
    }

    getInitials(name) {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    }

    getDisplayName(userProfile) {
        // Priority: display_name > name from email > email
        if (userProfile.display_name) {
            return userProfile.display_name;
        }
        
        if (userProfile.email) {
            // Extract name part from email (before @)
            const emailName = userProfile.email.split('@')[0];
            // Convert common patterns like first.last to "First Last"
            return emailName
                .split(/[._-]/)
                .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
                .join(' ');
        }
        
        return 'User';
    }

    async removeCollaborator(userId) {
        if (!confirm('Are you sure you want to remove this person\'s access to the list?')) {
            return;
        }

        try {
            console.log('Removing collaborator:', userId);
            await window.SupabaseConfig.database.removeCollaborator(this.currentListId, userId);
            
            this.showShareStatus('Collaborator removed successfully.', 'success');
            await this.loadListCollaborators();
            
        } catch (error) {
            console.error('Failed to remove collaborator:', error);
            this.showShareStatus('Failed to remove collaborator. Please try again.', 'error');
        }
    }

    async sendListInvitation() {
        const email = document.getElementById('shareEmailInput').value.trim();
        const permission = document.getElementById('sharePermissionSelect').value;

        console.log('🎯 sendListInvitation called:', { email, permission, currentListId: this.currentListId });

        if (!email) {
            this.showShareStatus('Please enter an email address.', 'error');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showShareStatus('Please enter a valid email address.', 'error');
            return;
        }

        if (email === this.currentUser.email) {
            this.showShareStatus('You cannot share a list with yourself.', 'error');
            return;
        }

        if (!this.currentListId) {
            this.showShareStatus('No list selected for sharing.', 'error');
            console.error('❌ No current list ID for sharing');
            return;
        }

        const sendButton = document.getElementById('sendInviteBtn');
        const originalText = sendButton.textContent;
        sendButton.textContent = 'Sending...';
        sendButton.disabled = true;

        try {
            console.log('📤 Attempting to send invitation:', { 
                email, 
                permission, 
                listId: this.currentListId,
                userEmail: this.currentUser?.email 
            });
            
            await window.SupabaseConfig.database.shareList(this.currentListId, email, permission);
            
            console.log('✅ User added as collaborator successfully:', email);
            this.showShareStatus(`${email} has been given access to this list! They can now find it in their "Shared Lists".`, 'success');
            
            // Clear the form
            document.getElementById('shareEmailInput').value = '';
            
            // Reload collaborators to show the new addition
            await this.loadListCollaborators();
            
        } catch (error) {
            console.error('❌ Failed to send invitation:', error);
            console.error('❌ Error details:', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
            
            let errorMessage = 'Failed to send invitation. ';
            if (error.message?.includes('User not found')) {
                errorMessage += 'The user needs to sign up first.';
            } else if (error.message?.includes('already shared')) {
                errorMessage += 'This list is already shared with this user.';
            } else if (error.message?.includes('Failed to find user')) {
                errorMessage += 'User not found. Please check the email address.';
            } else {
                errorMessage += `Error: ${error.message}`;
            }
            
            this.showShareStatus(errorMessage, 'error');
        } finally {
            sendButton.textContent = originalText;
            sendButton.disabled = false;
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showShareStatus(message, type) {
        const statusElement = document.querySelector('.share-status') || this.createShareStatusElement();
        
        statusElement.textContent = message;
        statusElement.className = `share-status ${type}`;
        statusElement.style.display = 'block';
        
        // Auto-hide after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                this.hideShareStatus();
            }, 5000);
        }
    }

    createShareStatusElement() {
        const statusElement = document.createElement('div');
        statusElement.className = 'share-status';
        
        const modalBody = document.querySelector('.modal-body');
        modalBody.insertBefore(statusElement, modalBody.firstChild);
        
        return statusElement;
    }

    hideShareStatus() {
        const statusElement = document.querySelector('.share-status');
        if (statusElement) {
            statusElement.style.display = 'none';
        }
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
            // Use current list name or generate default
            const title = this.currentListName || this.generateDefaultListName();
            
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
            
            // Update share button visibility now that list is saved
            this.updateShareButtonVisibility();
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
        console.log('📄 Raw input text:', text.substring(0, 200) + (text.length > 200 ? '...' : ''));
        
        const lines = text.split('\n');
        const items = [];

        lines.forEach((line, index) => {
            line = line.trim();
            if (line) {
                console.log(`📝 Processing line ${index + 1}: "${line}"`);
                if (line.includes(',')) {
                    const lineItems = line.split(',').map(item => item.trim()).filter(item => item);
                    console.log(`  ↳ Split by comma: ${lineItems.length} items:`, lineItems);
                    items.push(...lineItems);
                } else if (line.includes(';')) {
                    const lineItems = line.split(';').map(item => item.trim()).filter(item => item);
                    console.log(`  ↳ Split by semicolon: ${lineItems.length} items:`, lineItems);
                    items.push(...lineItems);
                } else {
                    console.log(`  ↳ Single item: "${line}"`);
                    items.push(line);
                }
            }
        });

        const filteredItems = items.filter(item => item.length > 0);
        console.log('✅ Final parsed items:', filteredItems);
        return filteredItems;
    }

    categorizeItems(items) {
        const categorizedItems = {};
        const uncategorized = [];

        items.forEach(item => {
            const normalizedItem = item.toLowerCase().trim();
            let categoryFound = false;

            console.log(`🔍 Categorizing item: "${item}" (normalized: "${normalizedItem}")`);

            for (const [category, keywords] of Object.entries(this.categories)) {
                const matchFound = keywords.some(keyword => {
                    // Improved matching logic to avoid false positives like "shampoo" -> "ham"
                    const exactMatch = normalizedItem === keyword;
                    const wordBoundaryMatch = this.wordBoundaryMatch(normalizedItem, keyword);
                    const keywordContainsItem = keyword.includes(normalizedItem) && normalizedItem.length >= 3; // Item must be at least 3 chars
                    const fuzzyMatchResult = this.fuzzyMatch(normalizedItem, keyword);
                    
                    // Safe substring matching: item contains keyword as complete word or at word boundaries
                    const safeSubstringMatch = normalizedItem.includes(keyword) && (
                        keyword.length >= 4 ||  // Long keywords are safer
                        wordBoundaryMatch ||    // Word boundary is safe
                        normalizedItem.startsWith(keyword) ||  // Starts with keyword is safe
                        normalizedItem.endsWith(keyword)       // Ends with keyword is safe
                    );
                    
                    const includesMatch = exactMatch || keywordContainsItem || safeSubstringMatch;
                    
                    if (includesMatch || fuzzyMatchResult) {
                        console.log(`✅ Match found in "${category}": keyword="${keyword}", exact=${exactMatch}, wordBoundary=${wordBoundaryMatch}, safeSubstring=${safeSubstringMatch}, fuzzy=${fuzzyMatchResult}`);
                        return true;
                    }
                    return false;
                });
                
                if (matchFound) {
                    if (!categorizedItems[category]) {
                        categorizedItems[category] = [];
                    }
                    categorizedItems[category].push(item);
                    categoryFound = true;
                    break;
                }
            }

            if (!categoryFound) {
                console.log(`❌ No category found for: "${item}"`);
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

    wordBoundaryMatch(item, keyword) {
        // Check if keyword appears as a whole word in the item
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        return regex.test(item);
    }

    // AI-Enhanced Three-Step Categorization System
    async categorizeWithAI(items) {
        console.log('🤖 Starting three-step AI-enhanced categorization for', items.length, 'items');
        console.log('📝 Input items:', items);
        
        try {
            // Step 1: Rule-based categorization (fast, local)
            console.log('🔄 Step 1: Rule-based categorization...');
            const quickResults = this.categorizeItems(items);
            
            // Check if we have OpenAI API key
            const config = await this.getEnvironmentConfig();
            if (!config.OPENAI_API_KEY) {
                console.log('⚠️ No OpenAI API key found, using rule-based categorization only');
                return quickResults;
            }
            
            // Check if we have "Other" items that need AI processing
            if (quickResults['Other'] && quickResults['Other'].length > 0) {
                console.log('✅ Step 1 complete. Found', quickResults['Other'].length, 'uncategorized items for AI processing');
                
                // Steps 2 & 3: AI categorization (strict then flexible)
                const aiResults = await this.aiCategorizeItems(quickResults['Other']);
                
                // Merge results
                const finalResults = this.mergeCategorizationResults(quickResults, aiResults);
                console.log('🎉 Three-step categorization complete!');
                return finalResults;
            }
            
            console.log('✅ All items categorized with Step 1 (rule-based) only');
            return quickResults;
            
        } catch (error) {
            console.error('❌ AI categorization failed, falling back to rule-based:', error.message);
            return this.categorizeItems(items);
        }
    }

    async aiCategorizeItems(items) {
        console.log('🔄 Step 2: AI strict categorization for remaining items...');
        
        const categoriesList = Object.keys(this.categories);
        const prompt = this.buildStrictCategorizationPrompt(items, categoriesList);
        
        try {
            const aiResponse = await this.callOpenAI(prompt);
            const validatedResponse = this.validateAndCorrectCategories(aiResponse, [...categoriesList, 'Other']);
            
            // Separate grocery items from "Other" items
            const groceryItems = {};
            const otherItems = [];
            
            Object.entries(validatedResponse).forEach(([item, category]) => {
                if (category === 'Other') {
                    otherItems.push(item);
                } else {
                    if (!groceryItems[category]) groceryItems[category] = [];
                    groceryItems[category].push(item);
                }
            });
            
            console.log('✅ Step 2 complete. Grocery items:', Object.keys(groceryItems).length, 'categories');
            console.log('🔄 Step 3: Flexible categorization for', otherItems.length, 'non-grocery items...');
            
            // Step 3: Flexible categorization for "Other" items
            if (otherItems.length > 0) {
                const flexibleCategories = await this.aiCategorizeItemsFlexible(otherItems);
                
                // Merge grocery and flexible categories
                Object.entries(flexibleCategories).forEach(([category, items]) => {
                    groceryItems[category] = items;
                });
            }
            
            console.log('✅ Three-step AI categorization completed:', groceryItems);
            return groceryItems;
            
        } catch (error) {
            console.error('❌ AI categorization failed:', error.message);
            throw error;
        }
    }

    async aiCategorizeItemsFlexible(items) {
        if (items.length === 0) return {};
        
        try {
            const flexiblePrompt = this.buildFlexibleCategorizationPrompt(items);
            const flexibleResponse = await this.callOpenAI(flexiblePrompt);
            
            console.log('🔍 Raw flexible AI response:', flexibleResponse);
            
            // Group similar categories to avoid duplicates
            const groupedResponse = this.groupSimilarCategories(flexibleResponse);
            
            console.log('✅ Step 3 complete. Flexible categories:', groupedResponse);
            console.log('📋 Final format check - keys:', Object.keys(groupedResponse));
            console.log('📋 Final format check - first few entries:', Object.entries(groupedResponse).slice(0, 3));
            return groupedResponse;
            
        } catch (error) {
            console.error('❌ Flexible AI categorization failed:', error.message);
            // Better fallback: try to extract any usable categorization from the raw response
            try {
                const betterFallback = this.extractCategoriesFromText(items);
                if (Object.keys(betterFallback).length > 0) {
                    console.log('✅ Using better fallback categorization:', betterFallback);
                    return betterFallback;
                }
            } catch (fallbackError) {
                console.warn('Fallback extraction also failed:', fallbackError.message);
            }
            
            // Ultimate fallback: put all items in "Other" category
            console.log('🔄 Using ultimate fallback: all items → Other');
            return { 'Other': items };
        }
    }

    extractCategoriesFromText(items) {
        // Simple rule-based categorization for common travel/non-grocery items
        const categories = {
            'Travel Documents': ['passport', 'tickets', 'visa', 'id', 'license', 'boarding pass'],
            'Electronics': ['phone', 'charger', 'adapter', 'cable', 'battery', 'camera', 'tablet', 'laptop'],
            'Clothing': ['shirt', 'pants', 'dress', 'skirt', 'shorts', 'underwear', 'socks', 'shoes', 'jacket'],
            'Travel Accessories': ['suitcase', 'backpack', 'bag', 'pillow', 'blanket', 'luggage'],
            'Personal Care': ['shampoo', 'toothbrush', 'toothpaste', 'soap', 'deodorant', 'lotion', 'sunscreen'],
            'Health & Medicine': ['medication', 'vitamins', 'bandages', 'first aid', 'pills'],
            'Entertainment': ['book', 'magazine', 'games', 'toys', 'coloring', 'crayons'],
            'Other': []
        };
        
        const result = {};
        
        items.forEach(item => {
            const normalizedItem = item.toLowerCase().trim();
            let categorized = false;
            
            for (const [category, keywords] of Object.entries(categories)) {
                if (category === 'Other') continue;
                
                if (keywords.some(keyword => 
                    normalizedItem.includes(keyword) || keyword.includes(normalizedItem)
                )) {
                    if (!result[category]) result[category] = [];
                    result[category].push(item);
                    categorized = true;
                    break;
                }
            }
            
            if (!categorized) {
                if (!result['Other']) result['Other'] = [];
                result['Other'].push(item);
            }
        });
        
        return result;
    }

    buildFlexibleCategorizationPrompt(items) {
        return `RETURN ONLY VALID JSON. NO TEXT BEFORE OR AFTER.

Map each item to ONE category:

Items: ${items.join(', ')}

REQUIRED FORMAT (item -> category):
{"item_name": "category_name", "item_name": "category_name"}

Example:
{"passport": "Travel Documents", "phone": "Electronics", "shirt": "Clothing"}`;
    }

    correctInvertedAIResponse(aiResponse) {
        console.log('🔍 Checking AI response format:', aiResponse);
        
        // Check if the response is inverted (category -> items instead of item -> category)
        const entries = Object.entries(aiResponse);
        let invertedCount = 0;
        
        entries.forEach(([key, value]) => {
            console.log(`  🔍 Analyzing entry: "${key}" -> ${typeof value} "${value}"`);
            // If the value contains commas or is very long, it's likely a list of items (inverted format)
            if (typeof value === 'string' && (value.includes(',') || value.length > 50)) {
                console.log(`    ⚠️ Detected as inverted (string with comma or long)`);
                invertedCount++;
            } else if (Array.isArray(value)) {
                console.log(`    ✅ Detected as array (correct format)`);
            } else {
                console.log(`    ❓ Unexpected format`);
            }
        });
        
        // If ANY entries look inverted, fix the format (be more aggressive)
        if (invertedCount > 0) {
            console.log('🔄 Detected inverted AI response format, correcting...');
            console.log('📊 Inverted count:', invertedCount, 'out of', entries.length, 'entries');
            const corrected = {};
            
            entries.forEach(([category, itemsString]) => {
                if (typeof itemsString === 'string') {
                    // Split the items string and assign each item to the category
                    const items = itemsString.split(',').map(item => item.trim()).filter(item => item);
                    console.log(`  🔄 Converting "${category}" -> [${items.join(', ')}]`);
                    items.forEach(item => {
                        corrected[item] = category;
                    });
                } else {
                    // Not inverted, keep as is
                    corrected[category] = itemsString;
                }
            });
            
            console.log('✅ Corrected response:', corrected);
            return corrected;
        }
        
        console.log('✅ Response format is correct');
        return aiResponse;
    }

    groupSimilarCategories(aiResponse) {
        // First, check if the AI returned the format backwards (category -> items instead of item -> category)
        const correctedResponse = this.correctInvertedAIResponse(aiResponse);
        
        const grouped = {};
        const categoryAliases = {};
        
        // Debug the corrected response
        console.log('🔧 Processing corrected response:', correctedResponse);
        console.log('🔧 Sample entries:', Object.entries(correctedResponse).slice(0, 5));
        
        // First pass: collect all categories and their aliases
        Object.entries(correctedResponse).forEach(([item, category]) => {
            console.log(`🔧 Processing: item="${item}" -> category="${category}"`);
            
            const normalizedCategory = this.normalizeCategoryName(category);
            console.log(`🔧 Normalized category: "${normalizedCategory}"`);
            
            // Check if this category is similar to an existing one
            let targetCategory = normalizedCategory;
            
            for (const existingCategory of Object.keys(categoryAliases)) {
                if (this.areCategoriesSimilar(normalizedCategory, existingCategory)) {
                    targetCategory = existingCategory;
                    console.log(`🔧 Merged with existing category: "${targetCategory}"`);
                    break;
                }
            }
            
            // Store the mapping
            categoryAliases[targetCategory] = true;
            
            // Group items
            if (!grouped[targetCategory]) {
                grouped[targetCategory] = [];
            }
            grouped[targetCategory].push(item);
            console.log(`🔧 Added "${item}" to category "${targetCategory}". Current items:`, grouped[targetCategory]);
        });
        
        console.log('📊 Category grouping complete:', {
            originalCategories: Object.keys(aiResponse).length,
            groupedCategories: Object.keys(grouped).length,
            grouped: grouped
        });
        
        return grouped;
    }

    normalizeCategoryName(category) {
        // Normalize category names to standard format
        return category
            .split(/[\s&\-_]+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' & ');
    }

    areCategoriesSimilar(cat1, cat2) {
        const normalize = (str) => str.toLowerCase().replace(/[^a-z]/g, '');
        const norm1 = normalize(cat1);
        const norm2 = normalize(cat2);
        
        // Check for exact match
        if (norm1 === norm2) return true;
        
        // Check for keyword overlap
        const words1 = norm1.split(/\s+/);
        const words2 = norm2.split(/\s+/);
        
        const commonWords = words1.filter(word => words2.includes(word));
        const similarity = commonWords.length / Math.max(words1.length, words2.length);
        
        return similarity > 0.5; // 50% word overlap threshold
    }

    buildStrictCategorizationPrompt(items, categoriesList) {
        // Add "Other" to the list of valid categories for Step 2
        const validCategories = [...categoriesList, 'Other'];
        const categoriesText = validCategories.map((cat, i) => `${i+1}. ${cat}`).join('\n');
        
        return `RETURN ONLY VALID JSON. NO TEXT BEFORE OR AFTER.

Categorize each item into EXACTLY ONE category from this list:
${categoriesText}

Rules:
- Use ONLY exact category names from the list above
- For non-grocery items: use "Other"
- Return valid JSON only

Items: ${items.join(', ')}

{"item1": "Category Name", "item2": "Category Name"}`;
    }

    async callOpenAI(prompt) {
        const config = await this.getEnvironmentConfig();
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a JSON-only categorizer. Return ONLY valid JSON with no explanations, no text before or after. Follow the exact format requested.'
                    },
                    {
                        role: 'user', 
                        content: prompt
                    }
                ],
                temperature: 0, // Zero temperature for most consistent JSON output
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content.trim();
        
        // Parse JSON response with enhanced error handling
        try {
            // Clean up the response - sometimes AI adds extra text before/after JSON
            let cleanContent = content.trim();
            
            // Look for JSON object boundaries
            const jsonStart = cleanContent.indexOf('{');
            const jsonEnd = cleanContent.lastIndexOf('}');
            
            if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
                cleanContent = cleanContent.substring(jsonStart, jsonEnd + 1);
            }
            
            // Fix common AI JSON formatting issues
            cleanContent = cleanContent
                .replace(/\\n/g, '') // Remove escaped newlines
                .replace(/\s+/g, ' ') // Normalize whitespace
                .replace(/,\s*}/g, '}') // Remove trailing commas
                .replace(/,\s*]/g, ']') // Remove trailing commas in arrays
                .replace(/"{2,}/g, '"') // Fix multiple quotes
                .replace(/"(\w+)":/g, '"$1":'); // Ensure property names are properly quoted
            
            const parsed = JSON.parse(cleanContent);
            console.log('✅ Successfully parsed OpenAI response:', parsed);
            return parsed;
        } catch (parseError) {
            console.error('❌ Failed to parse OpenAI response:', {
                originalContent: content,
                parseError: parseError.message
            });
            
            // Try to extract items and create a fallback mapping
            console.warn('🔧 Attempting fallback parsing...');
            console.warn('🔧 Raw AI response:', content.substring(0, 200) + '...');
            return this.createFallbackMapping(content);
        }
    }

    createFallbackMapping(content) {
        console.log('🔧 Creating fallback mapping from malformed response');
        
        // Extract any quoted strings that might be item names
        const itemMatches = content.match(/"([^"]+)"/g);
        const fallbackMapping = {};
        
        if (itemMatches) {
            itemMatches.forEach(match => {
                const item = match.replace(/"/g, '');
                
                // Skip if it looks like a category name (too long or contains category keywords)
                if (item.length > 50 || 
                    Object.keys(this.categories).some(cat => 
                        cat.toLowerCase().includes(item.toLowerCase()) || 
                        item.toLowerCase().includes(cat.toLowerCase())
                    )) {
                    return;
                }
                
                // Skip if it contains multiple items (comma separated)
                if (item.includes(',') && item.split(',').length > 3) {
                    console.warn('🚫 Skipping suspected multi-item string:', item.substring(0, 50) + '...');
                    return;
                }
                
                // Default to "Other" for unknown items
                fallbackMapping[item] = 'Other';
            });
        }
        
        console.log('🔧 Fallback mapping created:', fallbackMapping);
        return fallbackMapping;
    }

    validateAndCorrectCategories(aiResponse, validCategories) {
        const corrected = {};
        
        // First, validate the response structure
        if (!aiResponse || typeof aiResponse !== 'object') {
            console.error('❌ Invalid AI response structure:', aiResponse);
            throw new Error('Invalid AI response structure');
        }
        
        // Check for completely wrong responses (items as categories or vice versa)
        const responseEntries = Object.entries(aiResponse);
        const suspiciousEntries = responseEntries.filter(([item, category]) => {
            // Check if item name is suspiciously long (might be a list of items)
            if (item.length > 100 || (item.includes(',') && item.split(',').length > 5)) {
                console.warn('🚨 Suspicious item detected (too long/multi-item):', item.substring(0, 50) + '...');
                return true;
            }
            
            // Check if category is suspiciously long (might be a list of items)
            if (category.length > 100 || (category.includes(',') && category.split(',').length > 5)) {
                console.warn('🚨 Suspicious category detected (too long/multi-item):', category.substring(0, 50) + '...');
                return true;
            }
            
            return false;
        });
        
        // If more than 30% of entries are suspicious, reject the entire response
        if (suspiciousEntries.length > responseEntries.length * 0.3) {
            console.error('❌ AI response rejected - too many suspicious entries');
            throw new Error('AI response contains malformed data');
        }
        
        // Remove suspicious entries
        const cleanResponse = {};
        responseEntries.forEach(([item, category]) => {
            if (!suspiciousEntries.some(([suspItem]) => suspItem === item)) {
                cleanResponse[item] = category;
            }
        });
        
        // Common AI category variations that need correction
        const categoryMappings = {
            'produce': 'Fruits & Vegetables',
            'vegetables': 'Fruits & Vegetables',
            'fruits': 'Fruits & Vegetables',
            'fresh produce': 'Fruits & Vegetables',
            'fruits and vegetables': 'Fruits & Vegetables',
            'meat': 'Meat & Seafood',
            'protein': 'Meat & Seafood',
            'meats': 'Meat & Seafood',
            'seafood': 'Meat & Seafood',
            'dairy': 'Dairy & Eggs',
            'dairy products': 'Dairy & Eggs',
            'baked goods': 'Bakery & Bread',
            'bread': 'Bakery & Bread',
            'cleaning': 'Household & Cleaning',
            'cleaning supplies': 'Household & Cleaning',
            'personal care': 'Health & Beauty',
            'beauty': 'Health & Beauty',
            'drinks': 'Beverages',
            'snacks': 'Snacks & Sweets',
            'candy': 'Snacks & Sweets',
            'frozen': 'Frozen Foods',
            'pantry': 'Pantry & Canned Goods',
            'condiments': 'Pantry & Canned Goods'
        };
        
        for (const [item, category] of Object.entries(cleanResponse)) {
            let finalCategory = category;
            
            // Check if it's a valid category
            if (!validCategories.includes(category)) {
                console.warn(`⚠️ AI returned invalid category "${category}" for item "${item}"`);
                
                // Try to map it to a valid category
                const mapped = categoryMappings[category.toLowerCase()];
                if (mapped) {
                    finalCategory = mapped;
                    console.log(`✅ Corrected "${category}" to "${mapped}"`);
                } else {
                    // Find most similar valid category
                    finalCategory = this.findMostSimilarCategory(category, validCategories);
                    console.log(`🔄 Mapped "${category}" to closest match "${finalCategory}"`);
                }
            }
            
            corrected[item] = finalCategory;
        }
        
        return corrected;
    }

    findMostSimilarCategory(invalidCategory, validCategories) {
        let bestMatch = 'Other';
        let bestSimilarity = 0;
        
        for (const validCategory of validCategories) {
            const similarity = this.calculateStringSimilarity(
                invalidCategory.toLowerCase(), 
                validCategory.toLowerCase()
            );
            
            if (similarity > bestSimilarity) {
                bestSimilarity = similarity;
                bestMatch = validCategory;
            }
        }
        
        // Only use the match if similarity is reasonable
        return bestSimilarity > 0.3 ? bestMatch : 'Other';
    }

    calculateStringSimilarity(str1, str2) {
        const maxLength = Math.max(str1.length, str2.length);
        if (maxLength === 0) return 1;
        
        const distance = this.levenshteinDistance(str1, str2);
        return 1 - distance / maxLength;
    }

    mergeCategorizationResults(quickResults, aiResults) {
        console.log('🔀 MERGE RESULTS DEBUG - quickResults:', quickResults);
        console.log('🔀 MERGE RESULTS DEBUG - aiResults:', aiResults);
        
        const merged = { ...quickResults };
        
        // Remove the "Other" category since we're processing those items
        delete merged['Other'];
        
        // Add AI categorized items to their respective categories
        // aiResults is in {category: [items]} format, not {item: category}
        for (const [category, items] of Object.entries(aiResults)) {
            console.log(`🔀 MERGE RESULTS DEBUG - Processing category "${category}" with items:`, items);
            
            if (!merged[category]) {
                merged[category] = [];
            }
            
            // items is an array, so we need to spread it
            if (Array.isArray(items)) {
                merged[category].push(...items);
            } else {
                // Fallback: if items is not an array, treat as single item
                merged[category].push(items);
            }
        }
        
        console.log('🔀 MERGE RESULTS DEBUG - Final merged result:', merged);
        return merged;
    }

    async getEnvironmentConfig() {
        if (this.cachedConfig) {
            return this.cachedConfig;
        }
        
        try {
            // Use the existing environment config system
            const config = await window.EnvironmentConfig.load();
            
            // FOR LOCAL TESTING ONLY - Add your OpenAI key here temporarily if needed
            // if (!config.OPENAI_API_KEY && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:')) {
            //     config.OPENAI_API_KEY = 'your-openai-api-key-here';
            //     console.log('🔑 Using hardcoded API key for local testing');
            // }
            
            this.cachedConfig = config;
            return config;
        } catch (error) {
            console.error('Failed to load environment config:', error);
            return {};
        }
    }

    async organizeList() {
        const inputText = document.getElementById('freeTextInput').value;
        console.log('🚀 organizeList called with input text length:', inputText.length);
        console.log('🚀 Raw input text preview:', inputText.substring(0, 300) + (inputText.length > 300 ? '...' : ''));
        
        if (!inputText.trim()) {
            alert('Please enter some shopping items first!');
            return;
        }

        // Show loading indicator
        const organizeBtn = document.getElementById('organizeBtn');
        const originalText = organizeBtn.textContent;
        organizeBtn.textContent = '🤖 Organizing...';
        organizeBtn.disabled = true;

        try {
            // Check if there's already an organized list displayed
            const organizedSection = document.getElementById('organizedSection');
            const hasExistingList = organizedSection.style.display === 'block' && this.currentLists && Object.keys(this.currentLists).length > 0;

        if (hasExistingList) {
            // Adding items to existing list
            console.log('Adding items to existing list...');
            const items = this.parseTextInput(inputText);
            const newCategories = await this.categorizeWithAI(items);
            
            // Merge new categories with existing ones
            this.mergeCategories(newCategories);
            
        } else {
            // Creating a new list
            console.log('Creating new organized list...');
            
            // Get custom list name or generate default
            const customName = document.getElementById('listNameInput').value.trim();
            this.currentListName = customName || this.generateDefaultListName();
            
            const items = this.parseTextInput(inputText);
            this.currentLists = await this.categorizeWithAI(items);
            this.updateListTitle();
        }
        
        // Update button text based on context
        this.updateOrganizeButtonText();
        
        this.renderCategorizedLists();
        this.updateShareButtonVisibility();
        document.getElementById('organizedSection').style.display = 'block';
        document.getElementById('freeTextInput').value = '';

            // Auto-save to cloud if authenticated
            if (this.mode === 'authenticated' && this.currentUser) {
                await this.autoSaveCurrentList();
                
                // Load collaborators for assignment feature if this is an existing list
                if (this.currentListId) {
                    await this.loadListCollaborators();
                }
            }
            
        } catch (error) {
            console.error('❌ Error organizing list:', error);
            alert('Failed to organize list. Please try again.');
        } finally {
            // Restore button state
            organizeBtn.textContent = originalText;
            organizeBtn.disabled = false;
        }
    }

    mergeCategories(newCategories) {
        // Merge new categories with existing ones
        for (const [categoryName, newItems] of Object.entries(newCategories)) {
            if (this.currentLists[categoryName]) {
                // Category exists, merge items (avoid duplicates)
                const existingItems = this.currentLists[categoryName];
                newItems.forEach(newItem => {
                    const isDuplicate = existingItems.some(existingItem => 
                        existingItem.toLowerCase().trim() === newItem.toLowerCase().trim()
                    );
                    if (!isDuplicate) {
                        existingItems.push(newItem);
                    }
                });
            } else {
                // New category, add it
                this.currentLists[categoryName] = newItems;
            }
        }
        console.log('Categories merged:', this.currentLists);
    }
    
    updateOrganizeButtonText() {
        const organizeBtn = document.getElementById('organizeBtn');
        const organizedSection = document.getElementById('organizedSection');
        const hasExistingList = organizedSection.style.display === 'block' && this.currentLists && Object.keys(this.currentLists).length > 0;
        
        if (hasExistingList) {
            organizeBtn.textContent = 'Add More Items';
        } else {
            organizeBtn.textContent = 'Organize List';
        }
    }

    generateDefaultListName() {
        const now = new Date();
        return `Shopping List - ${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
    }

    updateListTitle() {
        const titleElement = document.querySelector('.organized-section h2');
        if (titleElement && this.currentListName) {
            titleElement.textContent = this.currentListName;
            titleElement.style.cursor = 'pointer';
            titleElement.title = 'Click to rename list';
            titleElement.onclick = () => this.renameCurrentList();
        }
    }

    async renameCurrentList() {
        const newName = prompt('Enter new list name:', this.currentListName);
        if (newName && newName.trim() && newName.trim() !== this.currentListName) {
            this.currentListName = newName.trim();
            this.updateListTitle();
            
            // Update the input field too
            document.getElementById('listNameInput').value = this.currentListName;
            
            // Auto-save with new name if authenticated
            if (this.mode === 'authenticated' && this.currentUser) {
                await this.autoSaveCurrentList();
            }
        }
    }

    renderCategorizedLists() {
        const container = document.getElementById('categorizedLists');
        container.innerHTML = '';

        console.log('🎨 renderCategorizedLists called with data:', this.currentLists);
        console.log('🎨 Data structure check - keys:', Object.keys(this.currentLists));
        console.log('🎨 First 2 entries:', Object.entries(this.currentLists).slice(0, 2));

        if (Object.keys(this.currentLists).length === 0) {
            container.innerHTML = '<div class="empty-state">No items to display</div>';
            return;
        }

        Object.entries(this.currentLists).forEach(([category, items]) => {
            console.log(`🎨 Rendering category: "${category}" with items:`, items);
            const categoryCard = this.createCategoryCard(category, items);
            container.appendChild(categoryCard);
        });
    }

    createCategoryCard(category, items) {
        const card = document.createElement('div');
        card.className = 'category-card';
        const categoryId = category.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
        
        // Get assignment info for this category
        const categoryData = (typeof items === 'object' && !Array.isArray(items)) ? items : { items: items };
        const actualItems = categoryData.items || [];
        const assignedTo = categoryData.assigned_to;
        
        // Generate assignment UI
        const assignmentUI = this.createAssignmentUI(category, assignedTo);
        
        card.innerHTML = `
            <div class="category-header">
                <div class="category-header-top">
                    <h3 class="category-title" onclick="organizer.editCategoryName('${category}')" title="Click to edit category name">${category}</h3>
                    <button class="btn-category-action btn-delete-category" onclick="organizer.deleteCategory('${category}')" title="Delete category">×</button>
                </div>
                <div class="category-header-bottom">
                    ${assignmentUI}
                    <span class="item-count">🛒 ${actualItems.length}</span>
                </div>
            </div>
            <div class="category-content">
                <div class="add-item-form">
                    <input type="text" class="add-item-input" placeholder="Add new item...">
                    <button class="btn-add" onclick="organizer.addItem('${category}', this).catch(console.error)">+</button>
                </div>
                <ul class="items-list" id="list-${categoryId}">
                    ${actualItems.map(item => this.createItemHTML(category, item)).join('')}
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

    createAssignmentUI(category, assignedTo) {
        // Don't show assignment UI if not in authenticated mode or no collaborators
        if (this.mode !== 'authenticated' || this.currentCollaborators.length === 0) {
            return '';
        }
        
        const assignedUser = this.currentCollaborators.find(c => c.user_id === assignedTo);
        const displayText = assignedUser 
            ? (assignedUser.profiles?.display_name || assignedUser.profiles?.email || 'Unknown User')
            : 'Unassigned';
        
        const assignedClass = assignedUser ? 'assigned' : 'unassigned';
        
        return `
            <div class="category-assignment ${assignedClass}">
                <span class="assignment-label">👥</span>
                <span class="assignment-text" onclick="organizer.showAssignmentDropdown('${category}', this)">${displayText}</span>
            </div>
        `;
    }

    showAssignmentDropdown(category, element) {
        console.log('🎯 showAssignmentDropdown called:', { 
            category, 
            collaboratorsCount: this.currentCollaborators.length,
            collaborators: this.currentCollaborators,
            element: element,
            mode: this.mode
        });
        
        // Basic check - if no collaborators, exit early
        if (this.currentCollaborators.length === 0) {
            console.error('❌ No collaborators found - dropdown will not be created');
            return;
        }
        
        // Remove any existing dropdown
        const existingDropdown = document.querySelector('.assignment-dropdown');
        if (existingDropdown) {
            existingDropdown.remove();
        }
        
        // Create dropdown
        const dropdown = document.createElement('div');
        dropdown.className = 'assignment-dropdown';
        // Remove test option - keeping for future debugging if needed
        
        // Add unassigned option
        const unassignedOption = document.createElement('div');
        unassignedOption.className = 'dropdown-option';
        unassignedOption.textContent = 'Unassigned';
        unassignedOption.addEventListener('click', (e) => {
            console.log('🎯 Unassigned option clicked', e);
            e.preventDefault();
            e.stopPropagation();
            this.assignCategory(category, null, dropdown);
        });
        dropdown.appendChild(unassignedOption);
        
        // Add collaborator options
        if (this.currentCollaborators.length === 0) {
            const noCollabOption = document.createElement('div');
            noCollabOption.className = 'dropdown-option disabled';
            noCollabOption.textContent = 'No collaborators found';
            dropdown.appendChild(noCollabOption);
            console.warn('⚠️ No collaborators available for assignment');
        } else {
            this.currentCollaborators.forEach(collaborator => {
                console.log('👤 Processing collaborator:', collaborator);
                const userName = collaborator.profiles?.display_name || collaborator.profiles?.email || 'Unknown User';
                const displayName = collaborator.is_owner ? `${userName} (Owner)` : userName;
                
                const collabOption = document.createElement('div');
                collabOption.className = 'dropdown-option';
                collabOption.textContent = displayName;
                collabOption.addEventListener('click', (e) => {
                    console.log('🎯 Collaborator option clicked:', { 
                        collaborator: collaborator.user_id, 
                        displayName,
                        event: e,
                        target: e.target
                    });
                    e.preventDefault();
                    e.stopPropagation();
                    this.assignCategory(category, collaborator.user_id, dropdown);
                });
                dropdown.appendChild(collabOption);
            });
        }
        
        // Position and show dropdown with FORCE CSS
        element.style.position = 'relative';
        dropdown.style.cssText = `
            position: absolute !important;
            top: 100% !important;
            left: 0 !important;
            background: red !important;
            border: 3px solid blue !important;
            border-radius: 5px !important;
            box-shadow: 0 8px 20px rgba(0,0,0,0.5) !important;
            z-index: 99999 !important;
            margin-top: 5px !important;
            overflow: visible !important;
            min-width: 200px !important;
            width: 200px !important;
            min-height: 100px !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        `;
        
        // Get element position for absolute positioning
        const elementRect = element.getBoundingClientRect();
        
        // Position dropdown with clean, professional styling
        dropdown.style.cssText = `
            position: fixed !important;
            top: ${elementRect.bottom + 5}px !important;
            left: ${elementRect.left}px !important;
            background: white !important;
            border: 1px solid #ddd !important;
            border-radius: 5px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
            z-index: 99999 !important;
            overflow: visible !important;
            min-width: 160px !important;
            max-width: 250px !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        `;
        
        document.body.appendChild(dropdown);
        
        // Dropdown successfully positioned and displayed
        
        // Close dropdown when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function closeDropdown(e) {
                if (!dropdown.contains(e.target) && !element.contains(e.target)) {
                    dropdown.remove();
                    document.removeEventListener('click', closeDropdown);
                }
            });
        }, 100);
    }

    async assignCategory(category, userId, dropdown) {
        try {
            // Assignment function called
            
            // Update the category data structure
            if (!this.currentLists[category]) {
                console.error('Category not found:', category);
                return;
            }
            
            // Convert to new format if needed
            if (Array.isArray(this.currentLists[category])) {
                this.currentLists[category] = {
                    items: this.currentLists[category]
                };
            }
            
            // Set or remove assignment
            if (userId) {
                this.currentLists[category].assigned_to = userId;
            } else {
                delete this.currentLists[category].assigned_to;
            }
            
            // Close dropdown
            dropdown.remove();
            
            // Re-render categories to show the change
            this.renderCategorizedLists();
            
            // Auto-save if authenticated
            if (this.mode === 'authenticated' && this.currentUser) {
                await this.autoSaveCurrentList();
            }
            
        } catch (error) {
            console.error('❌ Failed to assign category:', error);
        }
    }

    createItemHTML(category, item) {
        const itemId = `${category}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Handle both old string format and new object format
        const itemData = typeof item === 'string' ? { name: item, amount: '', unit: 'pcs' } : item;
        const itemName = itemData.name || '';
        const itemAmount = itemData.amount || '';
        const itemUnit = itemData.unit || 'pcs';
        
        return `
            <li class="item-row" id="${itemId}">
                <div class="item-table">
                    <input type="text" class="item-name" value="${itemName}" placeholder="Item name"
                           onblur="organizer.updateItemData('${category}', '${itemId}', 'name', this.value).catch(console.error)"
                           onkeypress="if(event.key==='Enter') this.blur()">
                    <input type="number" class="item-amount" value="${itemAmount}" placeholder="Qty" min="0" step="0.1"
                           onblur="organizer.updateItemData('${category}', '${itemId}', 'amount', this.value).catch(console.error)"
                           onkeypress="if(event.key==='Enter') this.blur()">
                    <select class="item-unit" onchange="organizer.updateItemData('${category}', '${itemId}', 'unit', this.value).catch(console.error)">
                        <option value="pcs" ${itemUnit === 'pcs' ? 'selected' : ''}>pcs</option>
                        <option value="g" ${itemUnit === 'g' ? 'selected' : ''}>g</option>
                        <option value="kg" ${itemUnit === 'kg' ? 'selected' : ''}>kg</option>
                        <option value="L" ${itemUnit === 'L' ? 'selected' : ''}>L</option>
                        <option value="ml" ${itemUnit === 'ml' ? 'selected' : ''}>ml</option>
                    </select>
                    <button class="btn-delete-icon" onclick="organizer.deleteItem('${category}', '${itemId}').catch(console.error)" title="Delete item">🗑️</button>
                </div>
            </li>
        `;
    }

    async addItem(category, buttonElement) {
        const input = buttonElement.previousElementSibling;
        const newItem = input.value.trim();
        
        if (newItem) {
            if (!this.currentLists[category]) {
                this.currentLists[category] = { items: [] };
            }
            
            // Convert to new format if needed
            if (Array.isArray(this.currentLists[category])) {
                this.currentLists[category] = {
                    items: this.currentLists[category]
                };
            }
            
            // Create new item as object
            const newItemObject = { name: newItem, amount: '', unit: 'pcs' };
            this.currentLists[category].items.push(newItemObject);
            
            const categoryId = category.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
            const listElement = document.getElementById(`list-${categoryId}`);
            const itemHTML = this.createItemHTML(category, newItemObject);
            listElement.insertAdjacentHTML('beforeend', itemHTML);
            
            input.value = '';
            
            const categoryHeader = buttonElement.closest('.category-card').querySelector('.item-count');
            const itemCount = this.currentLists[category].items ? this.currentLists[category].items.length : 0;
            categoryHeader.textContent = `🛒 ${itemCount}`;

            // Auto-save to cloud if authenticated
            if (this.mode === 'authenticated' && this.currentUser) {
                await this.autoSaveCurrentList();
            }
        }
    }

    async updateItem(category, itemId, newValue) {
        const itemElement = document.getElementById(itemId);
        const itemIndex = Array.from(itemElement.parentNode.children).indexOf(itemElement);
        
        // Convert to new format if needed
        if (Array.isArray(this.currentLists[category])) {
            this.currentLists[category] = {
                items: this.currentLists[category]
            };
        }
        
        if (this.currentLists[category] && this.currentLists[category].items && this.currentLists[category].items[itemIndex] !== undefined) {
            this.currentLists[category].items[itemIndex] = newValue.trim();

            // Auto-save to cloud if authenticated
            if (this.mode === 'authenticated' && this.currentUser) {
                await this.autoSaveCurrentList();
            }
        }
    }

    async updateItemData(category, itemId, field, value) {
        const itemElement = document.getElementById(itemId);
        const itemIndex = Array.from(itemElement.parentNode.children).indexOf(itemElement);
        
        // Convert to new format if needed
        if (Array.isArray(this.currentLists[category])) {
            this.currentLists[category] = {
                items: this.currentLists[category].map(item => 
                    typeof item === 'string' ? { name: item, amount: '', unit: 'pcs' } : item
                )
            };
        }
        
        if (this.currentLists[category] && this.currentLists[category].items && this.currentLists[category].items[itemIndex] !== undefined) {
            let currentItem = this.currentLists[category].items[itemIndex];
            
            // Convert string items to object format
            if (typeof currentItem === 'string') {
                currentItem = { name: currentItem, amount: '', unit: 'pcs' };
                this.currentLists[category].items[itemIndex] = currentItem;
            }
            
            // Update the specific field
            currentItem[field] = value.trim();

            // Auto-save to cloud if authenticated
            if (this.mode === 'authenticated' && this.currentUser) {
                await this.autoSaveCurrentList();
            }
        }
    }

    async deleteItem(category, itemId) {
        const itemElement = document.getElementById(itemId);
        const itemIndex = Array.from(itemElement.parentNode.children).indexOf(itemElement);
        
        // Convert to new format if needed
        if (Array.isArray(this.currentLists[category])) {
            this.currentLists[category] = {
                items: this.currentLists[category]
            };
        }
        
        if (this.currentLists[category] && this.currentLists[category].items && this.currentLists[category].items[itemIndex] !== undefined) {
            this.currentLists[category].items.splice(itemIndex, 1);
            
            if (this.currentLists[category].items.length === 0) {
                delete this.currentLists[category];
            }
            
            itemElement.remove();
            
            const categoryId = category.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
            const categoryCard = document.querySelector(`#list-${categoryId}`).closest('.category-card');
            if (this.currentLists[category]) {
                const categoryHeader = categoryCard.querySelector('.item-count');
                categoryHeader.textContent = `🛒 ${this.currentLists[category].items.length}`;
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
                this.currentListName = null; // Reset list name
                document.getElementById('organizedSection').style.display = 'none';
                document.getElementById('freeTextInput').value = '';
                document.getElementById('listNameInput').value = '';
                this.updateShareButtonVisibility();
                this.updateOrganizeButtonText(); // Reset button text
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

    async copyToWhatsApp() {
        try {
            console.log('📱 Copying list for WhatsApp...');
            
            if (!this.currentLists || Object.keys(this.currentLists).length === 0) {
                alert('No shopping list to copy. Please organize a list first.');
                return;
            }

            // Get collaborators for assignment info
            const collaborators = await this.loadListCollaboratorsForExport();
            
            // Generate WhatsApp-friendly text
            const whatsappText = await this.generateWhatsAppText(collaborators);
            
            // Copy to clipboard
            await this.copyToClipboard(whatsappText);
            
            console.log('✅ List copied to clipboard successfully');
            
        } catch (error) {
            console.error('❌ Failed to copy list:', error);
            alert('Failed to copy list. Please try again.');
        }
    }

    async loadListCollaboratorsForExport() {
        try {
            if (this.mode === 'authenticated' && this.currentListId && window.SupabaseConfig) {
                const collaborators = await window.SupabaseConfig.database.getListCollaborators(this.currentListId);
                console.log('📋 Loaded collaborators for export:', collaborators);
                return collaborators || [];
            }
        } catch (error) {
            console.warn('Could not load collaborators for export:', error);
        }
        return [];
    }

    async generateWhatsAppText(collaborators) {
        const listTitle = this.currentListName || 'Shopping List';
        const currentDate = new Date().toLocaleDateString();
        
        let whatsappText = `🛒 *${listTitle}*\n`;
        whatsappText += `📅 ${currentDate}\n`;
        
        // Create collaborator lookup for assignments
        const collaboratorMap = {};
        collaborators.forEach(collab => {
            console.log('📋 Processing collaborator:', {
                user_id: collab.user_id,
                display_name: collab.display_name,
                email: collab.email,
                name: collab.name,
                allKeys: Object.keys(collab)
            });
            collaboratorMap[collab.user_id] = collab.display_name || 
                                             collab.email || 
                                             collab.name || 
                                             `User ${collab.user_id.substring(0, 8)}`;
        });
        
        // Include current user if authenticated and not already in collaborators
        if (this.mode === 'authenticated' && this.currentUser) {
            const currentUserId = this.currentUser.id;
            if (!collaboratorMap[currentUserId]) {
                collaboratorMap[currentUserId] = this.currentUser.user_metadata?.full_name || 
                                               this.currentUser.user_metadata?.name || 
                                               this.currentUser.email;
            }
        }
        
        // Debug logging
        console.log('📋 WhatsApp Export Debug:', {
            collaboratorsCount: collaborators.length,
            collaboratorMap,
            currentLists: this.currentLists,
            currentUser: this.currentUser?.email
        });
        
        // Add assignment summary if there are any users in the collaborator map
        if (Object.keys(collaboratorMap).length > 0) {
            const assignments = {};
            Object.entries(this.currentLists).forEach(([categoryName, items]) => {
                const categoryData = (typeof items === 'object' && !Array.isArray(items)) ? items : { items: items };
                const assignedTo = categoryData.assigned_to;
                if (assignedTo && collaboratorMap[assignedTo]) {
                    const userName = collaboratorMap[assignedTo];
                    if (!assignments[userName]) assignments[userName] = [];
                    assignments[userName].push(categoryName);
                }
            });
            
            if (Object.keys(assignments).length > 0) {
                whatsappText += '\n👥 *Shopping Assignments:*\n';
                Object.entries(assignments).forEach(([userName, categories]) => {
                    whatsappText += `• ${userName}: ${categories.join(', ')}\n`;
                });
            }
        }
        
        whatsappText += '\n';
        
        // Process each category
        Object.entries(this.currentLists).forEach(([categoryName, items]) => {
            // Handle category assignment
            const categoryData = (typeof items === 'object' && !Array.isArray(items)) ? items : { items: items };
            const actualItems = categoryData.items || [];
            const assignedTo = categoryData.assigned_to;
            
            
            if (assignedTo && collaboratorMap[assignedTo]) {
                whatsappText += `*${categoryName}* 👤 (${collaboratorMap[assignedTo]})\n`;
            } else {
                whatsappText += `*${categoryName}*\n`;
            }
            whatsappText += `${'─'.repeat(Math.min(categoryName.length + 10, 25))}\n`;
            
            // Process items
            if (Array.isArray(actualItems) && actualItems.length > 0) {
                actualItems.forEach(item => {
                    const itemData = typeof item === 'string' ? { name: item, amount: '', unit: 'pcs' } : item;
                    const itemName = itemData.name || '';
                    const itemAmount = itemData.amount || '';
                    const itemUnit = itemData.unit || 'pcs';
                    
                    let itemLine = `• ${itemName}`;
                    if (itemAmount && itemAmount.trim()) {
                        itemLine += ` (${itemAmount} ${itemUnit})`;
                    }
                    whatsappText += `${itemLine}\n`;
                });
            } else {
                whatsappText += `• No items\n`;
            }
            
            whatsappText += '\n';
        });
        
        // Add footer
        whatsappText += `📱 Generated by Shopping List Organizer\n`;
        whatsappText += `🔗 ${window.location.origin}`;
        
        return whatsappText;
    }

    async copyToClipboard(text) {
        try {
            // Modern browsers with Clipboard API
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                this.showCopySuccess();
                return;
            }
            
            // Fallback for older browsers or non-HTTPS
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                this.showCopySuccess();
            } else {
                throw new Error('Copy command failed');
            }
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            // Show the text in a popup as last resort
            this.showTextPopup(text);
        }
    }

    showCopySuccess() {
        // Show success message
        const button = document.getElementById('downloadWhatsAppBtn');
        const originalText = button.innerHTML;
        
        button.innerHTML = '✅ Copied!';
        button.style.backgroundColor = '#22c55e';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.backgroundColor = '';
        }, 2000);
        
        // Show user instructions
        setTimeout(() => {
            alert('✅ Shopping list copied to clipboard!\n\nNext steps:\n1. Open WhatsApp\n2. Go to your chat\n3. Paste (Ctrl+V or long press)\n\nYour list is ready to share! 📱');
        }, 100);
    }

    showTextPopup(text) {
        // Fallback: show text in alert for manual copy
        const shortText = text.length > 500 ? text.substring(0, 500) + '...' : text;
        alert('Copy failed. Here\'s your list to copy manually:\n\n' + shortText + '\n\n(Open browser console to see full text)');
        console.log('Full WhatsApp text for manual copy:', text);
    }
}

const organizer = new ShoppingListOrganizer();