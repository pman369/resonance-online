-- Resonance Database Schema

-- 1. Profiles (extending auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AI Reflections (Storage for all AI features)
CREATE TABLE IF NOT EXISTS public.ai_reflections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    feature TEXT NOT NULL, -- 'consciousness_map', 'wisdom', 'synchronicity', 'shadow'
    input_text TEXT NOT NULL,
    result_json JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Stories (Community Hub)
CREATE TABLE IF NOT EXISTS public.stories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    impact TEXT,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Global Metrics (Live field data)
CREATE TABLE IF NOT EXISTS public.global_metrics (
    id TEXT PRIMARY KEY DEFAULT 'current',
    coherence_score BIGINT DEFAULT 0,
    active_participants INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. User Heartbeats (For real-time presence)
CREATE TABLE IF NOT EXISTS public.user_heartbeats (
    user_id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    last_seen TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security)

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_heartbeats ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view all, but only edit their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- AI Reflections: Users can only see their own
CREATE POLICY "Users can view own reflections" ON public.ai_reflections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reflections" ON public.ai_reflections FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Stories: Viewable by all, insert by authenticated
CREATE POLICY "Stories are viewable by everyone" ON public.stories FOR SELECT USING (true);
CREATE POLICY "Authenticated users can post stories" ON public.stories FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Global Metrics: Viewable by all
CREATE POLICY "Global metrics are viewable by everyone" ON public.global_metrics FOR SELECT USING (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.global_metrics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.stories;
