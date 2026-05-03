-- Update profiles policy to require authentication
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by authenticated users" ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');

-- Drop the heartbeat table as we are moving to Realtime Presence
DROP TABLE IF EXISTS public.user_heartbeats;

-- Add indexes for performance optimization (Task 2.3)
CREATE INDEX IF NOT EXISTS idx_ai_reflections_user_id ON public.ai_reflections(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_reflections_created_at ON public.ai_reflections(created_at);
CREATE INDEX IF NOT EXISTS idx_stories_created_at_desc ON public.stories(created_at DESC);

