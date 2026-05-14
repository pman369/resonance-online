// src/hooks/useReducedMotion.ts
import { useEffect, useState } from 'react';
import { useProfile } from './useProfile';

export function useReducedMotion(): boolean {
  const { profile } = useProfile();
  const [osPrefers, setOsPrefers] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setOsPrefers(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return osPrefers || (profile?.feature_prefs?.reduce_motion ?? false);
}
