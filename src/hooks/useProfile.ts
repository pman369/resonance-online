// src/hooks/useProfile.ts
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import type { Profile } from '../types/profile';

interface UseProfileReturn {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: (userId?: string) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
}

export function useProfile(): UseProfileReturn {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (userId?: string) => {
    const id = userId ?? user?.id;
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (err) throw err;
      setProfile(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user?.id) return;
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          ...updates, 
          updated_at: new Date().toISOString() 
        })
        .select()
        .single();
      
      if (err) throw err;
      setProfile(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save profile');
      throw e;
    }
  }, [user?.id]);

  const uploadAvatar = useCallback(async (file: File): Promise<string> => {
    if (!user?.id) throw new Error('Not authenticated');

    // Validate
    if (file.size > 2 * 1024 * 1024) throw new Error('Avatar must be under 2MB');
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      throw new Error('Unsupported file type');
    }

    // Convert to WebP via canvas
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    const MAX = 256;
    const ratio = Math.min(MAX / bitmap.width, MAX / bitmap.height);
    canvas.width = bitmap.width * ratio;
    canvas.height = bitmap.height * ratio;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const webpBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(b => {
        if (b) resolve(b);
        else reject(new Error('Failed to create blob'));
      }, 'image/webp', 0.85);
    });

    const path = `${user.id}/${Date.now()}.webp`;
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, webpBlob, {
        upsert: true,
        contentType: 'image/webp',
      });
    
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    const publicUrl = data.publicUrl;

    // Update profile with new avatar URL
    await updateProfile({ avatar_url: publicUrl });

    return publicUrl;
  }, [user?.id, updateProfile]);

  // Auto-fetch on mount when authenticated
  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id, fetchProfile]);

  // Real-time profile sync
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel(`profile_${user.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${user.id}`,
      }, payload => {
        setProfile(payload.new as Profile);
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return { profile, isLoading, error, fetchProfile, updateProfile, uploadAvatar };
}
