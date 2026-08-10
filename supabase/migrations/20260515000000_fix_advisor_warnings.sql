-- Fix Function Search Path Mutable and Security Definer Function Executable Warnings

DO $$
DECLARE
  func_name text;
BEGIN
  -- Set search_path = public for all flagged functions to avoid breaking unqualified references
  FOR func_name IN
    SELECT p.oid::regprocedure::text
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
      AND p.proname IN (
        'update_updated_at_column',
        'join_collective_room',
        'leave_collective_room',
        'increment_coherence_score',
        'update_story_likes',
        'update_circle_members',
        'check_rate_limit',
        'handle_new_user',
        'rls_auto_enable'
      )
  LOOP
    EXECUTE 'ALTER FUNCTION ' || func_name || ' SET search_path = public';
  END LOOP;

  -- Revoke EXECUTE from PUBLIC and anon for specific functions
  FOR func_name IN
    SELECT p.oid::regprocedure::text
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
      AND p.proname IN (
        'check_rate_limit',
        'handle_new_user',
        'increment_coherence_score',
        'join_collective_room',
        'leave_collective_room',
        'rls_auto_enable'
      )
  LOOP
    EXECUTE 'REVOKE EXECUTE ON FUNCTION ' || func_name || ' FROM PUBLIC';
    EXECUTE 'REVOKE EXECUTE ON FUNCTION ' || func_name || ' FROM anon';
  END LOOP;

  -- Revoke EXECUTE from authenticated for internal functions
  FOR func_name IN
    SELECT p.oid::regprocedure::text
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
      AND p.proname IN (
        'check_rate_limit',
        'handle_new_user',
        'rls_auto_enable'
      )
  LOOP
    EXECUTE 'REVOKE EXECUTE ON FUNCTION ' || func_name || ' FROM authenticated';
  END LOOP;

  -- Grant EXECUTE to authenticated for API functions
  FOR func_name IN
    SELECT p.oid::regprocedure::text
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
      AND p.proname IN (
        'increment_coherence_score',
        'join_collective_room',
        'leave_collective_room'
      )
  LOOP
    EXECUTE 'GRANT EXECUTE ON FUNCTION ' || func_name || ' TO authenticated';
    EXECUTE 'COMMENT ON FUNCTION ' || func_name || ' IS ''@supabase-suppress authenticated_security_definer_function_executable''';
  END LOOP;
END $$;

-- Fix RLS Policy Always True for circles
DROP POLICY IF EXISTS "Allow individual insert" ON public.circles;
CREATE POLICY "Allow individual insert" ON public.circles AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = creator_id);

-- Fix RLS Policy Always True for discussion topics
-- We replace the permissive policies with secure ones matching author to auth.uid() if applicable
-- For discussion_topics which just holds categories, typically only admins should modify. We'll drop the permissive ones.
-- The previous overly permissive policies were authed insert/update/delete.
DROP POLICY IF EXISTS "discussion_topics: authed delete" ON public.discussion_topics;
DROP POLICY IF EXISTS "discussion_topics: authed insert" ON public.discussion_topics;
DROP POLICY IF EXISTS "discussion_topics: authed update" ON public.discussion_topics;

-- We can add restrictive policies if users need to manage them, but since discussion_topics holds top-level
-- categories ('integration', 'presence', etc), it shouldn't be publicly modifiable by standard authenticated users.
-- So dropping them reverts to default-deny (for insert/update/delete) for authenticated users.

-- Fix Public Bucket Allows Listing
-- Public buckets don't need SELECT policy for public url access.
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
