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

        // My Lists dashboard event listeners
        document.getElementById('backToMainBtn').addEventListener('click', () => this.backToMain());
        document.getElementById('refreshListsBtn').addEventListener('click', () => this.loadMyLists());

        // Shared Lists dashboard event listeners
        // Note: Shared lists are now integrated into My Lists page

        // Share functionality event listeners
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
        
        // Show share button only if:
        // 1. User is authenticated
        // 2. There is a current list with ID (saved to cloud)
        if (this.mode === 'authenticated' && this.currentUser && this.currentListId) {
            shareButton.style.display = 'inline-block';
        } else {
            shareButton.style.display = 'none';
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

        // Check if there's already an organized list displayed
        const organizedSection = document.getElementById('organizedSection');
        const hasExistingList = organizedSection.style.display === 'block' && this.currentLists && Object.keys(this.currentLists).length > 0;

        if (hasExistingList) {
            // Adding items to existing list
            console.log('Adding items to existing list...');
            const items = this.parseTextInput(inputText);
            const newCategories = this.categorizeItems(items);
            
            // Merge new categories with existing ones
            this.mergeCategories(newCategories);
            
        } else {
            // Creating a new list
            console.log('Creating new organized list...');
            
            // Get custom list name or generate default
            const customName = document.getElementById('listNameInput').value.trim();
            this.currentListName = customName || this.generateDefaultListName();
            
            const items = this.parseTextInput(inputText);
            this.currentLists = this.categorizeItems(items);
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
        
        // Get assignment info for this category
        const categoryData = (typeof items === 'object' && !Array.isArray(items)) ? items : { items: items };
        const actualItems = categoryData.items || [];
        const assignedTo = categoryData.assigned_to;
        
        // Generate assignment UI
        const assignmentUI = this.createAssignmentUI(category, assignedTo);
        
        card.innerHTML = `
            <div class="category-header">
                <div class="category-header-left">
                    <h3 class="category-title" onclick="organizer.editCategoryName('${category}')" title="Click to edit category name">${category}</h3>
                    ${assignmentUI}
                </div>
                <div class="category-header-right">
                    <span class="item-count">${actualItems.length} items</span>
                    <button class="btn-category-action btn-delete-category" onclick="organizer.deleteCategory('${category}')" title="Delete category">×</button>
                </div>
            </div>
            <div class="category-content">
                <div class="add-item-form">
                    <input type="text" class="add-item-input" placeholder="Add new item...">
                    <button class="btn-add" onclick="organizer.addItem('${category}', this).catch(console.error)">Add</button>
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
            ? `${assignedUser.profiles?.email || 'Unknown User'}` 
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
            collaborators: this.currentCollaborators 
        });
        
        // Remove any existing dropdown
        const existingDropdown = document.querySelector('.assignment-dropdown');
        if (existingDropdown) {
            existingDropdown.remove();
        }
        
        // Create dropdown
        const dropdown = document.createElement('div');
        dropdown.className = 'assignment-dropdown';
        
        // Add unassigned option
        dropdown.innerHTML = `
            <div class="dropdown-option" onclick="organizer.assignCategory('${category}', null, this.parentElement)">Unassigned</div>
        `;
        
        // Add collaborator options
        if (this.currentCollaborators.length === 0) {
            dropdown.innerHTML += `
                <div class="dropdown-option disabled">No collaborators found</div>
            `;
            console.warn('⚠️ No collaborators available for assignment');
        } else {
            this.currentCollaborators.forEach(collaborator => {
                console.log('👤 Processing collaborator:', collaborator);
                const userEmail = collaborator.profiles?.email || collaborator.profiles?.display_name || `User ${collaborator.user_id?.slice(0, 8)}` || 'Unknown User';
                const displayName = collaborator.is_owner ? `${userEmail} (Owner)` : userEmail;
                dropdown.innerHTML += `
                    <div class="dropdown-option" onclick="organizer.assignCategory('${category}', '${collaborator.user_id}', this.parentElement)">${displayName}</div>
                `;
            });
        }
        
        // Position and show dropdown
        element.style.position = 'relative';
        element.appendChild(dropdown);
        
        // Close dropdown when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function closeDropdown(e) {
                if (!element.contains(e.target)) {
                    dropdown.remove();
                    document.removeEventListener('click', closeDropdown);
                }
            });
        }, 100);
    }

    async assignCategory(category, userId, dropdown) {
        try {
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
            
            console.log('✅ Category assignment updated:', { category, userId });
            
        } catch (error) {
            console.error('❌ Failed to assign category:', error);
        }
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
                this.currentLists[category] = { items: [] };
            }
            
            // Convert to new format if needed
            if (Array.isArray(this.currentLists[category])) {
                this.currentLists[category] = {
                    items: this.currentLists[category]
                };
            }
            
            this.currentLists[category].items.push(newItem);
            
            const categoryId = category.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
            const listElement = document.getElementById(`list-${categoryId}`);
            const itemHTML = this.createItemHTML(category, newItem);
            listElement.insertAdjacentHTML('beforeend', itemHTML);
            
            input.value = '';
            
            const categoryHeader = buttonElement.closest('.category-card').querySelector('.item-count');
            const itemCount = this.currentLists[category].items ? this.currentLists[category].items.length : 0;
            categoryHeader.textContent = `${itemCount} items`;

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
                categoryHeader.textContent = `${this.currentLists[category].items.length} items`;
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
}

const organizer = new ShoppingListOrganizer();