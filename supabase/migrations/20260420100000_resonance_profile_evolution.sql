-- Resonance Profile Evolution
-- Migration: Add Layered Living Intelligence System to Profiles

-- 1. Create Types if needed (optional, using TEXT for flexibility with JSONB for complex structures)

-- 2. Expand Profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS frequency_fingerprint JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS resonance_archetype TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS chronotype TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS sensory_mode TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ DEFAULT NULL,

-- Layer 02 — Behavioral
ADD COLUMN IF NOT EXISTS peak_energy_windows JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS depletion_patterns JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS habit_anchors JSONB DEFAULT '[]'::jsonb,

-- Layer 03 — Relational
ADD COLUMN IF NOT EXISTS resonance_bonds JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS relational_impact_score INTEGER DEFAULT 0,

-- Layer 04 — Growth
ADD COLUMN IF NOT EXISTS current_resonance_score JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS growth_velocity JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS intention_alignment JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS legacy_goals JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS archetype_evolution JSONB DEFAULT '[]'::jsonb;
-- 3. Add comment for clarity
COMMENT ON COLUMN public.profiles.frequency_fingerprint IS '7-dimensional emotional signature';
COMMENT ON COLUMN public.profiles.resonance_archetype IS 'Dominant energetic pattern (e.g., The Ember, The Current)';
-- 4. Ensure RLS remains correct (already enabled in init_tables.sql)
-- No changes needed to RLS as existing policies cover 'id = auth.uid()';
