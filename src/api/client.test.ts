import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkBackendHealth, mapConsciousness } from './client';
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

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('checkBackendHealth returns health data', async () => {
    const mockHealth = { status: 'ok', message: 'test', aiAvailable: true, timestamp: '' };
    (fetch as any).mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockHealth),
    });

    const result = await checkBackendHealth();
    expect(result).toEqual(mockHealth);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/health'));
  });

  it('mapConsciousness calls edge function with auth token', async () => {
    const mockSession = { access_token: 'fake-token', user: { id: 'user-123' } };
    (supabase.auth.getSession as any).mockResolvedValue({ data: { session: mockSession } });
    
    const mockData = { frequency: 'High', growthEdges: [], flowTriggers: [], patterns: '', nextStep: '' };
    (fetch as any).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true, data: mockData }),
    });

    const result = await mapConsciousness('test journal');
    
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/consciousness/map'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer fake-token',
        }),
      })
    );
  });

  it('throws error if not logged in', async () => {
    (supabase.auth.getSession as any).mockResolvedValue({ data: { session: null } });
    
    await expect(mapConsciousness('test')).rejects.toThrow('Please log in');
  });
});
