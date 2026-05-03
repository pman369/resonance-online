import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkBackendHealth, mapConsciousness, findSynchronicities, getWisdom, exploreShadow } from './client';
import { AnalysisSchema, SynchronicityDataSchema, WisdomDataSchema, ShadowDataSchema } from './client';
import { supabase } from '../lib/supabase';

// Mock supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
    })),
  },
}));

// Mock fetch
global.fetch = vi.fn();

const mockSession = { access_token: 'fake-token', user: { id: 'user-123' } };

function mockAuthenticatedSession() {
  (supabase.auth.getSession as ReturnType<typeof vi.fn>).mockResolvedValue({
    data: { session: mockSession },
  });
}

function mockFetchResponse(data: unknown, ok = true, status = 200) {
  (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
    ok,
    status,
    json: vi.fn().mockResolvedValue(data),
  });
}

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── Health Check ─────────────────────────────────────────────

  describe('checkBackendHealth', () => {
    it('returns health data on success', async () => {
      const mockHealth = { status: 'ok', message: 'running', aiAvailable: true, timestamp: '2026-01-01T00:00:00Z' };
      mockFetchResponse(mockHealth);

      const result = await checkBackendHealth();
      expect(result).toEqual(mockHealth);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/health'));
    });

    it('throws when fetch fails', async () => {
      (fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));
      await expect(checkBackendHealth()).rejects.toThrow('Network error');
    });
  });

  // ─── Authentication Gating ────────────────────────────────────

  describe('authentication', () => {
    it('throws error if not logged in', async () => {
      (supabase.auth.getSession as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: { session: null },
      });
      await expect(mapConsciousness('test')).rejects.toThrow('Please log in');
    });

    it('sends Bearer token in Authorization header', async () => {
      mockAuthenticatedSession();
      const mockData = { frequency: 'High', growthEdges: [], flowTriggers: [], patterns: 'none', nextStep: 'breathe' };
      mockFetchResponse({ success: true, data: mockData });

      await mapConsciousness('test journal');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/consciousness/map'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer fake-token',
          }),
        })
      );
    });
  });

  // ─── HTTP & API Error Handling ────────────────────────────────

  describe('error handling', () => {
    it('throws on non-ok HTTP response', async () => {
      mockAuthenticatedSession();
      mockFetchResponse({ error: 'Server error' }, false, 500);

      await expect(mapConsciousness('test')).rejects.toThrow('Server error');
    });

    it('throws on API-level error in response body', async () => {
      mockAuthenticatedSession();
      mockFetchResponse({ success: false, error: 'Rate limit exceeded' }, true);

      await expect(mapConsciousness('test')).rejects.toThrow('Rate limit exceeded');
    });
  });

  // ─── Schema Validation ────────────────────────────────────────

  describe('Zod schema validation', () => {
    it('mapConsciousness passes with valid data', async () => {
      mockAuthenticatedSession();
      const validData = {
        frequency: 'Elevated Awareness',
        growthEdges: ['patience', 'presence'],
        flowTriggers: ['music', 'nature'],
        patterns: 'Seeking stillness',
        nextStep: 'Meditate for 10 minutes',
      };
      mockFetchResponse({ success: true, data: validData });

      const result = await mapConsciousness('journal entry');
      expect(result.frequency).toBe('Elevated Awareness');
      expect(result.growthEdges).toHaveLength(2);
    });

    it('mapConsciousness rejects invalid data', async () => {
      mockAuthenticatedSession();
      const invalidData = { frequency: 123, growthEdges: 'not-an-array' };
      mockFetchResponse({ success: true, data: invalidData });

      await expect(mapConsciousness('journal entry')).rejects.toThrow('Received invalid data from AI.');
    });

    it('findSynchronicities passes with valid data', async () => {
      mockAuthenticatedSession();
      const validData = {
        resources: [{ title: 'Book A', insight: 'Key insight' }],
        practice: 'Walk in nature',
        question: 'What calls to you?',
        connection: 'A mentor',
      };
      mockFetchResponse({ success: true, data: validData });

      const result = await findSynchronicities('quantum physics');
      expect(result.resources).toHaveLength(1);
      expect(result.resources[0].title).toBe('Book A');
    });

    it('getWisdom passes with valid data', async () => {
      mockAuthenticatedSession();
      const validData = {
        teaching: 'The Tao that can be told is not the eternal Tao.',
        practice: 'Sit quietly for 5 minutes',
        reframe: 'Uncertainty is freedom.',
        tradition: 'Taoism — Lao Tzu',
      };
      mockFetchResponse({ success: true, data: validData });

      const result = await getWisdom('feeling lost');
      expect(result.tradition).toContain('Taoism');
    });

    it('exploreShadow passes with valid data', async () => {
      mockAuthenticatedSession();
      const validData = {
        reflection: 'You notice a pattern of avoidance.',
        origin: 'This may stem from early experiences.',
        explorationQuestion: 'What are you protecting?',
        reframe: 'Avoidance is a form of self-care.',
        seekSupport: 'Consider speaking with a therapist.',
      };
      mockFetchResponse({ success: true, data: validData });

      const result = await exploreShadow('I avoid conflict');
      expect(result.explorationQuestion).toBe('What are you protecting?');
    });

    it('exploreShadow rejects when required field is missing', async () => {
      mockAuthenticatedSession();
      const invalidData = {
        reflection: 'Present',
        origin: 'Present',
        // explorationQuestion is missing
        reframe: 'Present',
        seekSupport: 'Present',
      };
      mockFetchResponse({ success: true, data: invalidData });

      await expect(exploreShadow('test')).rejects.toThrow('Received invalid data from AI.');
    });
  });

  // ─── Persistence ──────────────────────────────────────────────

  describe('persistence', () => {
    it('persists AI results to ai_reflections table', async () => {
      mockAuthenticatedSession();
      const validData = {
        frequency: 'Flow',
        growthEdges: [],
        flowTriggers: [],
        patterns: 'test',
        nextStep: 'test',
      };
      mockFetchResponse({ success: true, data: validData });

      await mapConsciousness('my journal');

      expect(supabase.from).toHaveBeenCalledWith('ai_reflections');
    });
  });
});

// ─── Standalone Schema Unit Tests ───────────────────────────────

describe('Zod Schemas (unit)', () => {
  describe('AnalysisSchema', () => {
    it('parses valid analysis', () => {
      const result = AnalysisSchema.safeParse({
        frequency: 'High',
        growthEdges: ['a'],
        flowTriggers: ['b'],
        patterns: 'p',
        nextStep: 'n',
      });
      expect(result.success).toBe(true);
    });

    it('allows optional error field', () => {
      const result = AnalysisSchema.safeParse({
        frequency: 'High',
        growthEdges: [],
        flowTriggers: [],
        patterns: 'p',
        nextStep: 'n',
        error: 'Something went wrong',
      });
      expect(result.success).toBe(true);
    });

    it('rejects when frequency is not a string', () => {
      const result = AnalysisSchema.safeParse({
        frequency: 42,
        growthEdges: [],
        flowTriggers: [],
        patterns: 'p',
        nextStep: 'n',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('SynchronicityDataSchema', () => {
    it('rejects when resources items are malformed', () => {
      const result = SynchronicityDataSchema.safeParse({
        resources: [{ title: 'ok' }], // missing insight
        practice: 'p',
        question: 'q',
        connection: 'c',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('WisdomDataSchema', () => {
    it('rejects when all fields are missing', () => {
      const result = WisdomDataSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('ShadowDataSchema', () => {
    it('parses complete shadow data', () => {
      const result = ShadowDataSchema.safeParse({
        reflection: 'r',
        origin: 'o',
        explorationQuestion: 'eq',
        reframe: 'rf',
        seekSupport: 'ss',
      });
      expect(result.success).toBe(true);
    });
  });
});
