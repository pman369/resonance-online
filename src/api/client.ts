// API Client for Resonance Backend (Supabase Edge Functions)
import { supabase } from '../lib/supabase';

const EDGE_FUNCTION_URL = import.meta.env.VITE_EDGE_FUNCTION_URL || 'http://localhost:54321/functions/v1/consciousness-ai';

export interface APIResponse<T> {
  success: boolean;
  data: T;
  warning?: string;
}

export interface APIError {
  error: string;
  details?: string;
}

// Generic Edge Function call with auth token and optional persistence
async function callEdgeFunction<T>(
  endpoint: string, 
  body: Record<string, unknown>, 
  persistence?: { feature: string; input: string }
): Promise<T> {
  try {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Please log in to use AI features');
    }

    const response = await fetch(`${EDGE_FUNCTION_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error((data as APIError).error || 'Request failed');
    }

    // Edge function returns { success: true, data: ... } format
    if (data.error && !data.success) {
      throw new Error(data.error || 'Request failed');
    }

    const result = data.data as T;

    // Optional persistence
    if (persistence) {
      await supabase.from('ai_reflections').insert([{
        user_id: session.user.id,
        feature: persistence.feature,
        input_text: persistence.input,
        result_json: result
      }]);
    }

    return result;
  } catch (error) {
    console.error(`Edge Function Error (${endpoint}):`, error);
    throw error;
  }
}

// Check backend health
export async function checkBackendHealth(): Promise<{
  status: string;
  message: string;
  aiAvailable: boolean;
  timestamp: string;
}> {
  try {
    const response = await fetch(`${EDGE_FUNCTION_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error('Backend health check failed:', error);
    throw error;
  }
}

// Consciousness Mapping
export async function mapConsciousness(journalText: string) {
  return callEdgeFunction('/consciousness/map', { journalText }, { feature: 'consciousness_map', input: journalText });
}

// Synchronicity Engine
export async function findSynchronicities(interest: string) {
  return callEdgeFunction('/synchronicity', { interest }, { feature: 'synchronicity', input: interest });
}

// Ancient Wisdom
export async function getWisdom(situation: string) {
  return callEdgeFunction('/wisdom', { situation }, { feature: 'wisdom', input: situation });
}

// Shadow Integration
export async function exploreShadow(shadowPrompt: string) {
  return callEdgeFunction('/shadow', { shadowPrompt }, { feature: 'shadow', input: shadowPrompt });
}

// Consciousness Feed
export async function loadFeed() {
  return callEdgeFunction('/feed', {});
}

// Daily Intentions
export async function generateIntention() {
  return callEdgeFunction('/intention', {});
}

// Generic generate endpoint (for custom prompts)
export async function generateContent(prompt: string, systemContext?: string, feature?: string) {
  return callEdgeFunction('/generate', { prompt, systemContext, feature });
}
