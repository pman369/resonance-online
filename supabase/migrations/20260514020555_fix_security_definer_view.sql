-- supabase/migrations/20260514020555_fix_security_definer_view.sql

-- 1. Drop existing view
DROP VIEW IF EXISTS public.room_members_anonymous;

-- 2. Recreate view with SECURITY INVOKER (security_invoker = true)
-- This ensures the view respects the RLS policies of the underlying table
CREATE VIEW public.room_members_anonymous
WITH (security_invoker = true)
AS
SELECT room_id, anonymous_token, joined_at
FROM public.room_participants;

-- 3. Update RLS policies for room_participants
-- Original policy only allowed seeing own row: (auth.uid() = user_id)
-- New policy allows seeing other members in the same room to support the view's functionality
DROP POLICY IF EXISTS "Users can see their own room membership" ON public.room_participants;

CREATE POLICY "Users can see participants in the same room"
ON public.room_participants
FOR SELECT
USING (
  room_id IN (
    SELECT rp.room_id
    FROM public.room_participants rp
    WHERE rp.user_id = auth.uid()
  )
);
