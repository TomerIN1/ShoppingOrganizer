// Supabase Configuration
// Credentials are loaded from environment variables for security

let SUPABASE_URL = '';
let SUPABASE_ANON_KEY = '';

// Import Supabase client (for use with module bundler)
// For development, we'll use CDN in HTML
let supabase;

// Initialize Supabase client
function initializeSupabase() {
    // Check if we're in a module environment or using CDN
    if (typeof window !== 'undefined' && window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true,
                flowType: 'implicit',
                debug: false
            },
            realtime: {
                params: {
                    eventsPerSecond: 10
                }
            }
        });
    } else {
        console.error('Supabase client not loaded. Make sure to include the Supabase CDN script.');
    }
    return supabase;
}

// Authentication helpers
const auth = {
    // Sign in with Google
    async signInWithGoogle() {
        if (!supabase) {
            console.error('Supabase not initialized');
            throw new Error('Supabase not initialized');
        }
        
        // Determine the correct redirect URL based on environment
        let redirectTo;
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            // Development environment
            redirectTo = `${window.location.origin}/`;
        } else {
            // Production environment (Vercel) - use exact URL
            redirectTo = window.location.origin + '/';
        }
        
        console.log('OAuth redirectTo:', redirectTo);
        
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectTo
            }
        });
        
        if (error) {
            console.error('Error signing in with Google:', error.message);
            throw error;
        }
        
        return data;
    },

    // Sign out
    async signOut() {
        if (!supabase) {
            console.error('Supabase not initialized');
            return;
        }
        
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error.message);
            throw error;
        }
    },

    // Get current user
    async getCurrentUser() {
        if (!supabase) {
            console.error('Supabase not initialized');
            return null;
        }
        
        try {
            // First get the current session
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError) {
                console.warn('Session error:', sessionError.message);
                return null;
            }
            
            if (!session) {
                // No active session, return null silently (this is normal for non-authenticated users)
                return null;
            }
            
            // Session exists, return the user from the session
            return session.user;
        } catch (error) {
            console.error('Error in getCurrentUser:', error);
            return null;
        }
    },

    // Listen to auth state changes
    onAuthStateChange(callback) {
        if (!supabase) {
            console.error('Supabase not initialized');
            return;
        }
        return supabase.auth.onAuthStateChange(callback);
    }
};

// Database helpers
const database = {
    // Profile operations
    async getProfile(userId) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching profile:', error.message);
            throw error;
        }
        
        return data;
    },

    async updateProfile(userId, updates) {
        const { data, error } = await supabase
            .from('profiles')
            .upsert({ id: userId, ...updates })
            .select()
            .single();
        
        if (error) {
            console.error('Error updating profile:', error.message);
            throw error;
        }
        
        return data;
    },

    // Shopping list operations
    async getMyLists() {
        const { data, error } = await supabase
            .from('shopping_lists')
            .select('*')
            .order('updated_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching lists:', error.message);
            throw error;
        }
        
        return data || [];
    },

    async getSharedLists() {
        const { data, error } = await supabase
            .from('shopping_lists')
            .select(`
                *,
                list_collaborators!inner(permission_level, accepted_at)
            `)
            .not('list_collaborators.accepted_at', 'is', null)
            .order('updated_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching shared lists:', error.message);
            throw error;
        }
        
        return data || [];
    },

    async createList(title, categories = {}) {
        const user = await auth.getCurrentUser();
        if (!user) {
            throw new Error('User not authenticated');
        }

        const { data, error } = await supabase
            .from('shopping_lists')
            .insert([{ 
                title, 
                categories,
                owner_id: user.id 
            }])
            .select()
            .single();
        
        if (error) {
            console.error('Error creating list:', error.message);
            throw error;
        }
        
        return data;
    },

    async updateList(listId, updates) {
        const { data, error } = await supabase
            .from('shopping_lists')
            .update(updates)
            .eq('id', listId)
            .select()
            .single();
        
        if (error) {
            console.error('Error updating list:', error.message);
            throw error;
        }
        
        return data;
    },

    async deleteList(listId) {
        const { error } = await supabase
            .from('shopping_lists')
            .delete()
            .eq('id', listId);
        
        if (error) {
            console.error('Error deleting list:', error.message);
            throw error;
        }
    },

    // Collaboration operations
    async shareList(listId, userEmail, permissionLevel = 'view') {
        // First, get the user ID from email
        const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', userEmail)
            .single();
        
        if (userError) {
            console.error('User not found:', userError.message);
            throw new Error('User not found. They need to sign up first.');
        }
        
        const { data, error } = await supabase
            .from('list_collaborators')
            .insert([{
                list_id: listId,
                user_id: userData.id,
                permission_level: permissionLevel
            }])
            .select()
            .single();
        
        if (error) {
            console.error('Error sharing list:', error.message);
            throw error;
        }
        
        return data;
    },

    async acceptInvitation(listId) {
        const { data, error } = await supabase
            .from('list_collaborators')
            .update({ accepted_at: new Date().toISOString() })
            .eq('list_id', listId)
            .eq('user_id', (await auth.getCurrentUser()).id)
            .select()
            .single();
        
        if (error) {
            console.error('Error accepting invitation:', error.message);
            throw error;
        }
        
        return data;
    },

    // Real-time subscriptions
    subscribeToListChanges(listId, callback) {
        return supabase
            .channel(`list-${listId}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'shopping_lists',
                filter: `id=eq.${listId}`
            }, callback)
            .subscribe();
    },

    subscribeToListUpdates(listId, callback) {
        return supabase
            .channel(`updates-${listId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'list_updates',
                filter: `list_id=eq.${listId}`
            }, callback)
            .subscribe();
    }
};

// Export for use in other files
window.SupabaseConfig = {
    auth,
    database,
    client: () => supabase
};

// Initialize after loading environment variables
if (typeof window !== 'undefined') {
    // Wait for environment config to load, then initialize Supabase
    setTimeout(async () => {
        try {
            const envConfig = await window.EnvironmentConfig.load();
            
            // Set credentials from environment
            SUPABASE_URL = envConfig.SUPABASE_URL;
            SUPABASE_ANON_KEY = envConfig.SUPABASE_ANON_KEY;
            
            // Initialize Supabase with loaded credentials
            supabase = initializeSupabase();
            console.log('Supabase initialized with environment config:', !!supabase);
            
            // Handle OAuth callback immediately after initialization
            if (supabase && (window.location.hash || window.location.search.includes('code='))) {
                console.log('Detected OAuth callback, processing...');
                try {
                    // Give Supabase a moment to process the URL fragments
                    setTimeout(async () => {
                        const { data, error } = await supabase.auth.getSession();
                        if (error) {
                            console.warn('OAuth callback processing error:', error.message);
                        } else if (data?.session) {
                            console.log('✅ OAuth callback successful, session established');
                        } else {
                            console.log('ℹ️ No session established from callback');
                        }
                    }, 500); // Small delay to allow URL processing
                } catch (callbackError) {
                    console.warn('OAuth callback processing failed:', callbackError.message);
                }
            }
            
            // Trigger a custom event when Supabase is ready
            window.dispatchEvent(new CustomEvent('supabaseReady'));
        } catch (error) {
            console.error('Failed to initialize Supabase:', error);
        }
    }, 100); // Reduced delay for faster initialization
}