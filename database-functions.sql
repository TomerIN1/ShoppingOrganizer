-- Additional database functions for the Shopping List Organizer
-- Run this in Supabase SQL Editor after the main schema

-- Function to get user ID by email (for sharing functionality)
CREATE OR REPLACE FUNCTION public.get_user_id_by_email(email text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_id uuid;
BEGIN
    -- Look up user ID from auth.users table
    SELECT id INTO user_id
    FROM auth.users
    WHERE auth.users.email = $1
    LIMIT 1;
    
    -- Return the user ID or null if not found
    RETURN user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_id_by_email(text) TO authenticated;

-- Function to get user profile info including email (for collaborator display)
CREATE OR REPLACE FUNCTION public.get_user_profile_with_email(user_id uuid)
RETURNS TABLE(id uuid, email text, display_name text, avatar_url text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.email,
        COALESCE(p.display_name, u.raw_user_meta_data->>'full_name') as display_name,
        COALESCE(p.avatar_url, u.raw_user_meta_data->>'avatar_url') as avatar_url
    FROM auth.users u
    LEFT JOIN public.profiles p ON u.id = p.id
    WHERE u.id = $1;
END;
$$;

-- Grant execute permission to authenticated users  
GRANT EXECUTE ON FUNCTION public.get_user_profile_with_email(uuid) TO authenticated;