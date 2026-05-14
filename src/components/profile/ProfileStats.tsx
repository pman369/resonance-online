import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { BookOpen, Sparkles, MessageCircle, Heart } from 'lucide-react';

interface ProfileStatsProps {
  userId: string;
}

interface Stats {
  reflections: number;
  intentions: number;
  stories: number;
  likes: number;
}

export function ProfileStats({ userId }: ProfileStatsProps) {
  const [stats, setStats] = useState<Stats>({
    reflections: 0,
    intentions: 0,
    stories: 0,
    likes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const [reflectionsRes, intentionsRes, storiesRes] = await Promise.all([
          supabase.from('ai_reflections').select('id', { count: 'exact', head: true }).eq('user_id', userId),
          supabase.from('ai_reflections').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('feature', 'daily_intention'),
          supabase.from('stories').select('id', { count: 'exact', head: true }).eq('user_id', userId)
        ]);

        setStats({
          reflections: reflectionsRes.count || 0,
          intentions: intentionsRes.count || 0,
          stories: storiesRes.count || 0,
          likes: 0 // In a real app, you'd sum likes from stories
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    }

    if (userId) fetchStats();
  }, [userId]);

  const statItems = [
    { label: 'Reflections', value: stats.reflections, icon: BookOpen },
    { label: 'Intentions', value: stats.intentions, icon: Sparkles },
    { label: 'Stories', value: stats.stories, icon: MessageCircle },
    { label: 'Resonances', value: stats.likes, icon: Heart },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map(({ label, value, icon: Icon }) => (
        <div key={label} className="bg-resonance-surface/50 p-6 rounded-2xl border border-resonance-border flex flex-col items-center justify-center gap-2 group hover:border-resonance-gold/30 transition-all duration-500">
          <div className="w-10 h-10 bg-resonance-gold/10 rounded-full flex items-center justify-center mb-1 group-hover:scale-110 transition-transform duration-500">
            <Icon className="w-5 h-5 text-resonance-gold" />
          </div>
          <span className="text-2xl font-display text-resonance-cream font-bold">
            {loading ? '...' : value}
          </span>
          <span className="text-[10px] font-ui uppercase tracking-widest text-resonance-muted">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
