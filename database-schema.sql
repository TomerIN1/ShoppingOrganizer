-- Shopping List Organizer Database Schema
-- Run this in Supabase SQL Editor

-- Enable Row Level Security extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shopping_lists table
CREATE TABLE public.shopping_lists (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL DEFAULT 'My Shopping List',
    owner_id UUID REFERENCES auth.users NOT NULL,
    categories JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create list_collaborators table
CREATE TABLE public.list_collaborators (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    list_id UUID REFERENCES shopping_lists(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users NOT NULL,
    permission_level TEXT CHECK (permission_level IN ('view', 'edit')) DEFAULT 'view',
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(list_id, user_id)
);

-- Create list_updates table for real-time activity
CREATE TABLE public.list_updates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    list_id UUID REFERENCES shopping_lists(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users NOT NULL,
    action_type TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.list_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.list_updates ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Shopping lists policies
CREATE POLICY "Owners can manage their lists" 
    ON public.shopping_lists FOR ALL 
    USING (auth.uid() = owner_id);

CREATE POLICY "Collaborators can view shared lists" 
    ON public.shopping_lists FOR SELECT 
    USING (
        auth.uid() = owner_id OR
        EXISTS (
            SELECT 1 FROM public.list_collaborators 
            WHERE list_id = shopping_lists.id 
            AND user_id = auth.uid()
            AND accepted_at IS NOT NULL
        )
    );

CREATE POLICY "Collaborators can edit shared lists" 
    ON public.shopping_lists FOR UPDATE 
    USING (
        auth.uid() = owner_id OR
        EXISTS (
            SELECT 1 FROM public.list_collaborators 
            WHERE list_id = shopping_lists.id 
            AND user_id = auth.uid()
            AND permission_level = 'edit'
            AND accepted_at IS NOT NULL
        )
    );

-- List collaborators policies
CREATE POLICY "Owners can manage collaborators" 
    ON public.list_collaborators FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.shopping_lists 
            WHERE id = list_id 
            AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can view their own collaborations" 
    ON public.list_collaborators FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can accept invitations" 
    ON public.list_collaborators FOR UPDATE 
    USING (auth.uid() = user_id);

-- List updates policies
CREATE POLICY "Users can view updates for accessible lists" 
    ON public.list_updates FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.shopping_lists 
            WHERE id = list_id 
            AND (
                owner_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.list_collaborators 
                    WHERE list_id = shopping_lists.id 
                    AND user_id = auth.uid()
                    AND accepted_at IS NOT NULL
                )
            )
        )
    );

CREATE POLICY "Users can insert updates for accessible lists" 
    ON public.list_updates FOR INSERT 
    WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.shopping_lists 
            WHERE id = list_id 
            AND (
                owner_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.list_collaborators 
                    WHERE list_id = shopping_lists.id 
                    AND user_id = auth.uid()
                    AND accepted_at IS NOT NULL
                )
            )
        )
    );

-- Create functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, avatar_url)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shopping_lists_updated_at 
    BEFORE UPDATE ON public.shopping_lists 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable real-time for tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.shopping_lists;
ALTER PUBLICATION supabase_realtime ADD TABLE public.list_collaborators;
ALTER PUBLICATION supabase_realtime ADD TABLE public.list_updates;