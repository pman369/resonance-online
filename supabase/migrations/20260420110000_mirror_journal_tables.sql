-- Mirror Journal Tables
-- Migration: Add journal_entries for Layered Reflection System

-- 1. Create journal_entries table
CREATE TABLE IF NOT EXISTS public.journal_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    prompt TEXT, -- The resonance prompt that initiated the entry
    session_context TEXT, -- If written post-practice
    
    -- Mirror AI analysis
    detected_themes TEXT[] DEFAULT '{}',
    emotional_signature JSONB DEFAULT NULL, -- Partial FrequencyFingerprint
    recurring_patterns JSONB DEFAULT '[]'::jsonb,
    mirror_reflection JSONB DEFAULT NULL, -- { surfacedPattern, resonanceEcho, promptForDepth, generatedAt, model }
    
    sent_to_profile BOOLEAN DEFAULT FALSE, -- Whether this entry updated the Frequency Fingerprint
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- 2. Enable RLS
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
-- 3. Policies
CREATE POLICY "Users can view own journal entries" ON public.journal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own journal entries" ON public.journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own journal entries" ON public.journal_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own journal entries" ON public.journal_entries FOR DELETE USING (auth.uid() = user_id);
-- 4. Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
CREATE TRIGGER update_journal_entries_updated_at
BEFORE UPDATE ON public.journal_entries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
-- 5. Indexes for performance
CREATE INDEX IF NOT EXISTS journal_entries_user_id_idx ON public.journal_entries(user_id);
CREATE INDEX IF NOT EXISTS journal_entries_created_at_idx ON public.journal_entries(created_at DESC);
