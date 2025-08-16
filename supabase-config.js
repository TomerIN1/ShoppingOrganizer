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
                debug: false,
                storageKey: 'supabase.auth.token'
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
        
        // Use environment-appropriate redirect URL
        let redirectTo;
        const hostname = window.location.hostname;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            // Development
            redirectTo = window.location.origin + '/';
        } else if (hostname.includes('dev-') || hostname.includes('-dev.') || hostname.includes('git-dev')) {
            // Dev/staging environment
            redirectTo = window.location.origin + '/';
        } else {
            // Production
            redirectTo = window.location.origin + '/';
        }
        
        console.log('OAuth redirectTo (environment-aware):', {
            hostname,
            redirectTo,
            environment: hostname.includes('dev') ? 'development' : 'production'
        });
        
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
        const user = await auth.getCurrentUser();
        if (!user) {
            throw new Error('User not authenticated');
        }

        const { data, error } = await supabase
            .from('shopping_lists')
            .select(`
                *,
                list_collaborators(
                    id, 
                    user_id,
                    permission_level, 
                    accepted_at,
                    profiles!list_collaborators_user_id_fkey(display_name, avatar_url)
                )
            `)
            .eq('owner_id', user.id)
            .order('updated_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching lists:', error.message);
            throw error;
        }
        
        return data || [];
    },

    async getSharedLists() {
        const user = await auth.getCurrentUser();
        if (!user) {
            throw new Error('User not authenticated');
        }

        console.log('🔍 getSharedLists: Looking for lists shared with user:', user.id);

        const { data, error } = await supabase
            .from('shopping_lists')
            .select(`
                *,
                list_collaborators!inner(permission_level, accepted_at, invited_at)
            `)
            .eq('list_collaborators.user_id', user.id)
            .not('list_collaborators.accepted_at', 'is', null)
            .order('updated_at', { ascending: false });
        
        console.log('📊 getSharedLists query result:', { data, error, userID: user.id });
        
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

    async getListById(listId) {
        const { data, error } = await supabase
            .from('shopping_lists')
            .select('*')
            .eq('id', listId)
            .single();
        
        if (error) {
            console.error('Error fetching list:', error.message);
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
        console.log('🔍 shareList called:', { listId, userEmail, permissionLevel });
        
        // Use RPC function to get user ID by email
        console.log('📞 Calling get_user_id_by_email RPC function...');
        const { data: userId, error: userError } = await supabase
            .rpc('get_user_id_by_email', { email: userEmail });
        
        console.log('📞 RPC response:', { userId, userError });
        
        if (userError) {
            console.error('❌ Error looking up user:', userError);
            throw new Error(`Failed to find user: ${userError.message}`);
        }
        
        if (!userId) {
            console.error('❌ No user ID returned for email:', userEmail);
            throw new Error('User not found. They need to sign up first.');
        }
        
        console.log('✅ Found user ID:', userId, 'for email:', userEmail);
        
        // Insert into list_collaborators table
        console.log('💾 Inserting collaborator record...');
        const { data, error } = await supabase
            .from('list_collaborators')
            .insert([{
                list_id: listId,
                user_id: userId,
                permission_level: permissionLevel,
                accepted_at: new Date().toISOString() // Auto-accept for immediate access
            }])
            .select()
            .single();
        
        console.log('💾 Insert response:', { data, error });
        
        if (error) {
            if (error.code === '23505') { // Unique constraint violation
                throw new Error('This list is already shared with this user.');
            }
            console.error('Error sharing list:', error.message);
            throw error;
        }

        // Send invitation email via Edge Function
        try {
            console.log('📧 Sending invitation email...');
            const currentUser = await auth.getCurrentUser();
            
            // Get list data for email
            const { data: listData, error: listError } = await supabase
                .from('shopping_lists')
                .select('*')
                .eq('id', listId)
                .single();
                
            if (listError) {
                console.warn('Could not fetch list data for email:', listError.message);
            }
            
            const emailPayload = {
                listTitle: listData?.title || 'Shopping List',
                listOwnerName: currentUser?.user_metadata?.full_name || currentUser?.email || 'Someone',
                listOwnerEmail: currentUser?.email || currentUser?.user_metadata?.email,
                recipientEmail: 'tomerikoka@gmail.com', // For testing - using your verified email
                permission: permissionLevel
            };
            
            console.log('📧 Current user data:', {
                email: currentUser?.email,
                userMetadata: currentUser?.user_metadata,
                id: currentUser?.id
            });
            
            console.log('📧 Email payload:', emailPayload);
            
            const { data: emailResult, error: emailError } = await supabase.functions.invoke('resend-email', {
                body: emailPayload
            });

            if (emailError) {
                console.error('⚠️ Email sending failed:', {
                    message: emailError.message,
                    details: emailError.details,
                    hint: emailError.hint,
                    code: emailError.code
                });
                // Don't fail the sharing process if email fails
            } else {
                console.log('✅ Invitation email sent successfully:', emailResult);
            }
        } catch (emailError) {
            console.warn('⚠️ Email sending error:', emailError.message);
            // Don't fail the sharing process if email fails
        }
        
        return data;
    },

    async getListCollaborators(listId) {
        console.log('Getting collaborators for list:', listId);
        
        // First get the basic collaborator data
        const { data: collaborators, error: collabError } = await supabase
            .from('list_collaborators')
            .select('*')
            .eq('list_id', listId);
        
        if (collabError) {
            console.error('Error getting list collaborators:', collabError.message);
            throw collabError;
        }
        
        if (!collaborators || collaborators.length === 0) {
            return [];
        }
        
        // Get user profile info for each collaborator using RPC function
        const collaboratorsWithProfiles = await Promise.all(
            collaborators.map(async (collab) => {
                try {
                    const { data: profile, error: profileError } = await supabase
                        .rpc('get_user_profile_with_email', { user_id: collab.user_id });
                    
                    if (profileError) {
                        console.warn('Could not get profile for user:', collab.user_id, profileError.message);
                    }
                    
                    return {
                        ...collab,
                        profiles: profile && profile.length > 0 ? profile[0] : {
                            id: collab.user_id,
                            email: 'Unknown',
                            display_name: null,
                            avatar_url: null
                        }
                    };
                } catch (err) {
                    console.warn('Error fetching profile for user:', collab.user_id, err);
                    return {
                        ...collab,
                        profiles: {
                            id: collab.user_id,
                            email: 'Unknown',
                            display_name: null,
                            avatar_url: null
                        }
                    };
                }
            })
        );
        
        return collaboratorsWithProfiles;
    },

    async removeCollaborator(listId, userId) {
        const { error } = await supabase
            .from('list_collaborators')
            .delete()
            .eq('list_id', listId)
            .eq('user_id', userId);
        
        if (error) {
            console.error('Error removing collaborator:', error.message);
            throw error;
        }
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
            
            // Debug: Log the loaded credentials (partially masked for security)
            console.log('🔍 Loaded environment config:', {
                SUPABASE_URL: SUPABASE_URL ? SUPABASE_URL.substring(0, 30) + '...' : 'MISSING',
                SUPABASE_ANON_KEY: SUPABASE_ANON_KEY ? SUPABASE_ANON_KEY.substring(0, 20) + '...' : 'MISSING',
                SUPABASE_ANON_KEY_ENDING: SUPABASE_ANON_KEY ? '...' + SUPABASE_ANON_KEY.substring(SUPABASE_ANON_KEY.length - 10) : 'MISSING',
                configKeys: Object.keys(envConfig),
                // Check if this might be a service key instead of anon key
                possibleServiceKey: SUPABASE_ANON_KEY?.includes('service_role'),
                keyLength: SUPABASE_ANON_KEY?.length || 0,
                deployTime: new Date().toISOString()
            });
            
            // Validate credentials before initializing Supabase
            if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
                console.error('❌ Missing Supabase credentials:', {
                    hasUrl: !!SUPABASE_URL,
                    hasKey: !!SUPABASE_ANON_KEY
                });
                return;
            }
            
            if (!SUPABASE_URL.includes('supabase.co')) {
                console.error('❌ Invalid Supabase URL format:', SUPABASE_URL);
                return;
            }
            
            // Initialize Supabase with loaded credentials
            supabase = initializeSupabase();
            console.log('Supabase initialized with environment config:', !!supabase);
            
            // Test API key validity with a simple request
            if (supabase) {
                try {
                    // This will test if the API key is valid
                    const { data, error } = await supabase.auth.getSession();
                    if (error && error.message.includes('Invalid API key')) {
                        console.error('❌ API Key validation failed:', error.message);
                        console.error('Please check your Vercel environment variables');
                    } else {
                        console.log('✅ API Key appears to be valid');
                    }
                } catch (testError) {
                    console.warn('API key test failed:', testError.message);
                }
            }
            
            // Handle OAuth callback immediately after initialization
            if (supabase && window.location.hash.includes('access_token')) {
                console.log('Detected implicit flow OAuth callback, processing...', {
                    hash: window.location.hash.substring(0, 50) + '...',
                    hasAccessToken: window.location.hash.includes('access_token'),
                    hasRefreshToken: window.location.hash.includes('refresh_token')
                });
                
                // Parse tokens from URL hash and set session manually
                try {
                    const hashParams = new URLSearchParams(window.location.hash.substring(1));
                    const accessToken = hashParams.get('access_token');
                    const refreshToken = hashParams.get('refresh_token');
                    const tokenType = hashParams.get('token_type');
                    const expiresIn = hashParams.get('expires_in');

                    if (accessToken && refreshToken) {
                        console.log('Found OAuth tokens, setting session manually...');
                        
                        // Set session manually using the tokens
                        const { data, error } = await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken
                        });

                        if (error) {
                            console.error('❌ Failed to set session:', {
                                message: error.message,
                                code: error.code,
                                status: error.status,
                                details: error.details
                            });
                            
                            // Provide specific guidance based on error
                            if (error.message?.includes('Invalid API key')) {
                                console.error('💡 Solution: Check that you\'re using the ANON/PUBLIC key, not the SERVICE key');
                                console.error('💡 The anon key should be safe to use in client-side code');
                            }
                        } else if (data?.session?.user) {
                            console.log('✅ OAuth session established successfully:', data.session.user.email);
                            // Clean up the URL
                            window.history.replaceState({}, document.title, window.location.pathname);
                        } else {
                            console.warn('⚠️ setSession succeeded but no user session returned');
                        }
                    } else {
                        console.warn('OAuth tokens not found in URL hash');
                    }
                } catch (parseError) {
                    console.error('Failed to parse OAuth callback:', parseError.message);
                }
            }
            
            // Trigger a custom event when Supabase is ready
            window.dispatchEvent(new CustomEvent('supabaseReady'));
        } catch (error) {
            console.error('Failed to initialize Supabase:', error);
        }
    }, 100); // Reduced delay for faster initialization
}