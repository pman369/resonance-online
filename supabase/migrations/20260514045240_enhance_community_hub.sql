-- supabase/migrations/20260514045240_enhance_community_hub.sql

-- 1. Unified Interactions
DO $$ BEGIN
    CREATE TYPE reaction_type AS ENUM ('resonate', 'expand', 'ground', 'deepen');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.content_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content_id UUID NOT NULL,
    content_type TEXT NOT NULL, -- 'story', 'comment', 'thread'
    reaction reaction_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, content_id, reaction)
);

ALTER TABLE public.content_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view interactions" ON public.content_interactions FOR SELECT USING (true);
CREATE POLICY "Users can insert own interactions" ON public.content_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own interactions" ON public.content_interactions FOR DELETE USING (auth.uid() = user_id);

-- 2. Threaded Comments
CREATE TABLE IF NOT EXISTS public.content_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content_id UUID NOT NULL,
    content_type TEXT NOT NULL, -- 'story', 'thread'
    parent_id UUID REFERENCES public.content_comments(id) ON DELETE CASCADE,
    text TEXT NOT NULL CHECK (char_length(text) <= 1000),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.content_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments" ON public.content_comments FOR SELECT USING (true);
CREATE POLICY "Users can post comments" ON public.content_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.content_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.content_comments FOR DELETE USING (auth.uid() = user_id);

-- 3. Intimate Circles (Tables first)
CREATE TABLE IF NOT EXISTS public.circles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL CHECK (char_length(name) <= 50),
    description TEXT CHECK (char_length(description) <= 200),
    is_private BOOLEAN DEFAULT FALSE,
    coherence_score INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.circle_members (
    circle_id UUID REFERENCES public.circles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'seeker',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (circle_id, user_id)
);

-- 3.1 Intimate Circles (RLS & Policies)
ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public circles" ON public.circles FOR SELECT USING (NOT is_private);
CREATE POLICY "Members can view private circles" ON public.circles FOR SELECT USING (
    is_private = false OR 
    EXISTS (SELECT 1 FROM public.circle_members WHERE circle_id = id AND user_id = auth.uid())
);

CREATE POLICY "Anyone can view circle members" ON public.circle_members FOR SELECT USING (true);
CREATE POLICY "Users can join circles" ON public.circle_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave circles" ON public.circle_members FOR DELETE USING (auth.uid() = user_id);

-- 4. Thematic Discussions
CREATE TABLE IF NOT EXISTS public.discussion_topics (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    description TEXT
);

INSERT INTO public.discussion_topics (id, label, description) VALUES
('integration', 'Integration', 'Processing and anchoring insights into daily life.'),
('presence', 'Presence', 'The art of being here, now.'),
('wisdom', 'Ancient Wisdom', 'Bridging timeless teachings with modern consciousness.'),
('synchronicity', 'Synchronicity', 'Exploring the meaningful coincidences of the field.')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.discussion_threads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    topic_id TEXT REFERENCES public.discussion_topics(id),
    user_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL CHECK (char_length(title) <= 100),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.discussion_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view threads" ON public.discussion_threads FOR SELECT USING (true);
CREATE POLICY "Users can create threads" ON public.discussion_threads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own threads" ON public.discussion_threads FOR UPDATE USING (auth.uid() = user_id);

-- 5. Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.content_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.content_interactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.discussion_threads;
