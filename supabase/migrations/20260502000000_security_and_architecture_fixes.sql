-- Migration: Security & Architecture Fixes

-- 1. Global Coherence Write Capabilities
-- Create a secure RPC to allow authenticated users to increment the coherence score
CREATE OR REPLACE FUNCTION increment_coherence_score(amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with elevated privileges to bypass RLS for this specific action
AS $$
BEGIN
    UPDATE public.global_metrics
    SET coherence_score = coherence_score + amount,
        updated_at = NOW()
    WHERE id = 'current';
END;
$$;

-- 2. Database-backed Rate Limiting
-- Create a table to track API requests per IP
CREATE TABLE IF NOT EXISTS public.api_rate_limits (
    ip_address TEXT PRIMARY KEY,
    request_count INTEGER DEFAULT 1,
    window_start TIMESTAMPTZ DEFAULT NOW()
);

-- Secure the rate limits table
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;
-- No public access policies needed since this is only accessed via Edge Functions using Service Role

-- Create an RPC to check and update rate limits efficiently
CREATE OR REPLACE FUNCTION check_rate_limit(client_ip TEXT, max_requests INTEGER, window_minutes INTEGER)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_count INTEGER;
    window_time TIMESTAMPTZ;
BEGIN
    -- Get the current record for the IP
    SELECT request_count, window_start INTO current_count, window_time
    FROM public.api_rate_limits
    WHERE ip_address = client_ip;

    IF NOT FOUND THEN
        -- First request from this IP
        INSERT INTO public.api_rate_limits (ip_address, request_count, window_start)
        VALUES (client_ip, 1, NOW());
        RETURN true;
    END IF;

    -- If the window has expired, reset the count
    IF NOW() > window_time + (window_minutes || ' minutes')::interval THEN
        UPDATE public.api_rate_limits
        SET request_count = 1,
            window_start = NOW()
        WHERE ip_address = client_ip;
        RETURN true;
    END IF;

    -- If within window and under limit, increment
    IF current_count < max_requests THEN
        UPDATE public.api_rate_limits
        SET request_count = request_count + 1
        WHERE ip_address = client_ip;
        RETURN true;
    END IF;

    -- Rate limit exceeded
    RETURN false;
END;
$$;
