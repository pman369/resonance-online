-- Collective Resonance Rooms
-- Migration: Add anonymous group practice infrastructure

-- 1. Create Room State Type
DO $$ BEGIN
    CREATE TYPE room_state AS ENUM ('forming', 'active', 'in_practice', 'reflecting', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
-- 2. Create Collective Rooms Table
CREATE TABLE IF NOT EXISTS public.collective_rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    state room_state DEFAULT 'forming',
    
    -- Frequency Band Matching
    min_emotional_range INTEGER DEFAULT 0,
    max_emotional_range INTEGER DEFAULT 100,
    min_regulatory_style INTEGER DEFAULT 0,
    max_regulatory_style INTEGER DEFAULT 100,
    
    max_participants INTEGER DEFAULT 12,
    current_count INTEGER DEFAULT 0,
    
    practice_id TEXT, -- Shared session identifier
    sound_field_config JSONB, -- Shared ambient environment
    
    post_session_echo TEXT, -- Group-level Mirror AI reflection
    
    opened_at TIMESTAMPTZ DEFAULT NOW(),
    closed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ DEFAULT (NOW() + interval '1 hour')
);
-- 3. Create Anonymous Participants Table
-- This table stores who is in what room, but uses ephemeral tokens for the frontend
CREATE TABLE IF NOT EXISTS public.room_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES public.collective_rooms(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    anonymous_token TEXT NOT NULL, -- Ephemeral 16-char token
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(room_id, user_id)
);
-- 4. Enable RLS
ALTER TABLE public.collective_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;
-- 5. Policies
-- Collective Rooms: Viewable by everyone (needed for matching)
CREATE POLICY "Everyone can view rooms" ON public.collective_rooms FOR SELECT USING (true);
-- Room Participants: Total Anonymity
-- Users can see their own membership
CREATE POLICY "Users can see their own room membership" 
ON public.room_participants FOR SELECT 
USING (auth.uid() = user_id);
-- Users can see OTHER people's anonymous tokens in the same room (but not their user_ids)
CREATE VIEW public.room_members_anonymous AS
SELECT room_id, anonymous_token, joined_at
FROM public.room_participants;
-- 6. Functions for joining/leaving (atomic updates)
CREATE OR REPLACE FUNCTION join_collective_room(target_room_id UUID, token TEXT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.room_participants (room_id, user_id, anonymous_token)
    VALUES (target_room_id, auth.uid(), token);
    
    UPDATE public.collective_rooms
    SET current_count = current_count + 1
    WHERE id = target_room_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE OR REPLACE FUNCTION leave_collective_room(target_room_id UUID)
RETURNS VOID AS $$
BEGIN
    DELETE FROM public.room_participants
    WHERE room_id = target_room_id AND user_id = auth.uid();
    
    UPDATE public.collective_rooms
    SET current_count = current_count - 1
    WHERE id = target_room_id AND current_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- 7. Realtime Enablement
ALTER PUBLICATION supabase_realtime ADD TABLE public.collective_rooms;
