// API Client for Resonance Backend (Supabase Edge Functions)
import { supabase } from '../lib/supabase';
import { z } from 'zod';

const isProd = import.meta.env.PROD;
const fallbackUrl = isProd ? '' : 'http://localhost:54321/functions/v1/consciousness-ai';
const EDGE_FUNCTION_URL = import.meta.env.VITE_EDGE_FUNCTION_URL || fallbackUrl;

export interface APIResponse<T> {
  success: boolean;
  data: T;
  warning?: string;
}

export interface APIError {
  error: string;
  details?: string;
}

export const AnalysisSchema = z.object({
  frequency: z.string(),
  growthEdges: z.array(z.string()),
  flowTriggers: z.array(z.string()),
  patterns: z.string(),
  nextStep: z.string(),
  error: z.string().optional(),
}).catchall(z.unknown());
export type Analysis = z.infer<typeof AnalysisSchema>;

export const ResourceSchema = z.object({
  title: z.string(),
  insight: z.string(),
});

export const SynchronicityDataSchema = z.object({
  resources: z.array(ResourceSchema),
  practice: z.string(),
  question: z.string(),
  connection: z.string(),
}).catchall(z.unknown());
export type SynchronicityData = z.infer<typeof SynchronicityDataSchema>;

export const WisdomDataSchema = z.object({
  teaching: z.string(),
  practice: z.string(),
  reframe: z.string(),
  tradition: z.string(),
}).catchall(z.unknown());
export type WisdomData = z.infer<typeof WisdomDataSchema>;

export const ShadowDataSchema = z.object({
  reflection: z.string(),
  origin: z.string(),
  explorationQuestion: z.string(),
  reframe: z.string(),
  seekSupport: z.string(),
}).catchall(z.unknown());
export type ShadowData = z.infer<typeof ShadowDataSchema>;

export const FeedItemSchema = z.object({
  category: z.string(),
  title: z.string(),
  summary: z.string(),
  insight: z.string(),
  action: z.string(),
}).catchall(z.unknown());
export type FeedItem = z.infer<typeof FeedItemSchema>;

export const IntentionDataSchema = z.object({
  intention: z.string(),
  morning: z.string(),
  midday: z.string(),
  evening: z.string(),
}).catchall(z.unknown());
export type IntentionData = z.infer<typeof IntentionDataSchema>;

// Generic Edge Function call with auth token and optional persistence
async function callEdgeFunction<T>(
  endpoint: string, 
  body: Record<string, unknown>, 
  persistence?: { feature: string; input: string },
  schema?: z.ZodType<T>
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

    let result = data.data as T;

    if (schema) {
      const parsedResult = schema.safeParse(result);
      if (!parsedResult.success) {
        console.error("Schema validation failed for endpoint", endpoint, parsedResult.error);
        throw new Error("Received invalid data from AI.");
      }
      result = parsedResult.data;
    }

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
export async function mapConsciousness(journalText: string): Promise<Analysis> {
  return callEdgeFunction('/consciousness/map', { journalText }, { feature: 'consciousness_map', input: journalText }, AnalysisSchema);
}

// Synchronicity Engine
export async function findSynchronicities(interest: string): Promise<SynchronicityData> {
  return callEdgeFunction('/synchronicity', { interest }, { feature: 'synchronicity', input: interest }, SynchronicityDataSchema);
}

// Ancient Wisdom
export async function getWisdom(situation: string): Promise<WisdomData> {
  return callEdgeFunction('/wisdom', { situation }, { feature: 'wisdom', input: situation }, WisdomDataSchema);
}

// Shadow Integration
export async function exploreShadow(shadowPrompt: string): Promise<ShadowData> {
  return callEdgeFunction('/shadow', { shadowPrompt }, { feature: 'shadow', input: shadowPrompt }, ShadowDataSchema);
}

// Consciousness Feed
export async function loadFeed(): Promise<FeedItem[]> {
  return callEdgeFunction('/feed', {}, undefined, z.array(FeedItemSchema));
}

// Daily Intentions
export async function generateIntention(): Promise<IntentionData> {
  return callEdgeFunction('/intention', {}, { feature: 'daily_intention', input: 'daily' }, IntentionDataSchema);
}

// Increment global coherence safely
export async function incrementGlobalCoherence(amount: number = 1): Promise<void> {
  const { error } = await supabase.rpc('increment_coherence_score', { amount });
  if (error) {
    console.error('Failed to increment global coherence:', error);
    throw error;
  }
}
