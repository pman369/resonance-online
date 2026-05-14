-- supabase/migrations/20260520000000_extend_profiles.sql

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS display_name       TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url         TEXT,
  ADD COLUMN IF NOT EXISTS bio                TEXT CHECK (char_length(bio) <= 300),
  ADD COLUMN IF NOT EXISTS location           TEXT,
  ADD COLUMN IF NOT EXISTS timezone           TEXT DEFAULT 'UTC',
  ADD COLUMN IF NOT EXISTS website_url        TEXT,
  ADD COLUMN IF NOT EXISTS onboarding_done    BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS created_at         TIMESTAMPTZ DEFAULT NOW();

-- Notification preferences (JSONB for flexibility)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS notification_prefs JSONB DEFAULT '{
    "email_weekly_digest": true,
    "email_community_mentions": true,
    "email_product_updates": false,
    "push_enabled": false
  }'::jsonb;

-- Privacy settings
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS privacy_prefs JSONB DEFAULT '{
    "profile_visibility": "members",
    "show_journey_history": true,
    "show_community_activity": true,
    "allow_coherence_tracking": true
  }'::jsonb;

-- Feature preferences
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS feature_prefs JSONB DEFAULT '{
    "digital_sabbath_day": null,
    "intention_reminder_time": null,
    "theme": "dark",
    "audio_feedback_enabled": true,
    "reduce_motion": false
  }'::jsonb;

-- RLS: Users can insert their own profile row
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS: Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Index for username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
