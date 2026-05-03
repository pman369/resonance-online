import React, { useState, useEffect, useCallback } from 'react';
import { Globe, Heart, Users, TrendingUp, Activity, Plus, Clock, Sparkles } from 'lucide-react';
import { loadFeed } from '../api/client';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';

interface FeedItem {
  category: string;
  title: string;
  summary: string;
  insight: string;
  action: string;
}

const categoryColors: Record<string, string> = {
  science: 'from-blue-900/20 to-cyan-900/20 border-blue-500/30 text-blue-200',
  movement: 'from-green-900/20 to-emerald-900/20 border-green-500/30 text-green-200',
  wisdom: 'from-amber-900/20 to-orange-900/20 border-amber-500/30 text-amber-200',
  transformation: 'from-purple-900/20 to-pink-900/20 border-purple-500/30 text-purple-200',
  environment: 'from-teal-900/20 to-green-900/20 border-teal-500/30 text-teal-200',
  technology: 'from-indigo-900/20 to-violet-900/20 border-indigo-500/30 text-indigo-200',
};

const categoryIcons: Record<string, React.ElementType> = {
  science: Activity,
  movement: TrendingUp,
  wisdom: Globe,
  transformation: Heart,
  environment: Globe,
  technology: Users,
};

const CollectiveCoherence: React.FC = () => {
  const { user } = useAuth();
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [globalCoherence, setGlobalCoherence] = useState(73542);
  const [activeParticipants, setActiveParticipants] = useState(1247);
  const [practiceLog, setPracticeLog] = useState('');
  const [practices, setPractices] = useState<Array<{ text: string; timestamp: Date }>>([]);

  // Subscribe to real-time metrics and presence
  useEffect(() => {
    const fetchInitial = async () => {
      const { data } = await supabase.from('global_metrics').select('*').eq('id', 'current').single();
      if (data) {
        setGlobalCoherence(data.coherence_score);
      }
    };
    
    fetchInitial();

    const channel = supabase.channel('live_metrics', {
      config: {
        presence: {
          key: user?.id || 'anonymous',
        },
      },
    });

    channel
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'global_metrics', filter: "id=eq.current" }, (payload) => {
        setGlobalCoherence(payload.new.coherence_score);
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setActiveParticipants(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && user) {
          await channel.track({
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const addPractice = () => {
    if (practiceLog.trim()) {
      setPractices(prev => [{ text: practiceLog.trim(), timestamp: new Date() }, ...prev]);
      setPracticeLog('');
      // In a real app, we'd also increment global coherence in the DB via an RPC call
    }
  };

  const loadConsciousnessFeed = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await loadFeed() as FeedItem[];
      setFeed(result);
    } catch (err) {
      setError('Could not load the consciousness feed. The field is quiet right now.');
      console.error('Feed error:', err);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadConsciousnessFeed();
  }, [loadConsciousnessFeed]);

  return (
    <div className="space-y-6 animate-in fade-in duration-1000">
      {/* Global Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-resonance-surface p-6 rounded-2xl border border-resonance-border shadow-lg group hover:border-resonance-gold/30 transition-all duration-500">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="w-8 h-8 text-resonance-gold" />
            <h3 className="text-sm font-ui uppercase tracking-widest text-resonance-muted">Global Coherence</h3>
          </div>
          <p className="text-4xl font-display text-resonance-cream mb-2">{globalCoherence.toLocaleString()}</p>
          <p className="text-[10px] font-ui uppercase tracking-wider text-resonance-muted">Resonant frequencies detected</p>
        </div>

        <div className="bg-resonance-surface p-6 rounded-2xl border border-resonance-border shadow-lg group hover:border-resonance-gold/30 transition-all duration-500">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-8 h-8 text-resonance-gold" />
            <h3 className="text-sm font-ui uppercase tracking-widest text-resonance-muted">Active Participants</h3>
          </div>
          <p className="text-4xl font-display text-resonance-cream mb-2">{activeParticipants.toLocaleString()}</p>
          <p className="text-[10px] font-ui uppercase tracking-wider text-resonance-muted">Tuned into the field now</p>
        </div>

        <div className="bg-resonance-surface p-6 rounded-2xl border border-resonance-border shadow-lg group hover:border-resonance-gold/30 transition-all duration-500">
          <div className="flex items-center space-x-3 mb-4">
            <Heart className="w-8 h-8 text-resonance-gold" />
            <h3 className="text-sm font-ui uppercase tracking-widest text-resonance-muted">Collective Field</h3>
          </div>
          <p className="text-2xl font-display text-resonance-gold mb-2 flex items-center gap-2">
            Strengthening <Sparkles size={16} className="animate-pulse" />
          </p>
          <p className="text-[10px] font-ui uppercase tracking-wider text-resonance-muted">Your presence contributes to all</p>
        </div>
      </div>

      {/* Visualization Section */}
      <div className="bg-resonance-surface p-8 rounded-2xl border border-resonance-border shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-resonance-gold font-display text-[15rem] pointer-events-none select-none">∿</div>
        
        <div className="flex items-center space-x-3 mb-8 relative z-10">
          <Globe className="w-8 h-8 text-resonance-gold" />
          <h2 className="text-2xl font-display text-resonance-cream">The Collective Coherence Field</h2>
        </div>

        <div className="aspect-video bg-resonance-bg rounded-xl border border-resonance-border p-6 relative overflow-hidden mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="absolute rounded-full border border-resonance-gold/20 animate-pulse-ring"
                style={{
                  width: `${100 + i * 80}px`,
                  height: `${100 + i * 80}px`,
                  animationDelay: `${i * 0.4}s`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-resonance-gold/20 rounded-full blur-2xl group-hover:bg-resonance-gold/40 transition-colors duration-700" />
              <div className="w-32 h-32 border border-resonance-gold/30 rounded-full flex items-center justify-center bg-resonance-surface/50 backdrop-blur-sm relative z-10 animate-spin-slow">
                <span className="text-4xl text-resonance-gold font-display italic">§</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 relative z-10">
          <div className="bg-resonance-bg/50 p-6 rounded-xl border border-resonance-border backdrop-blur-sm group hover:border-resonance-gold/40 transition-colors">
            <p className="text-resonance-muted text-[10px] font-ui uppercase tracking-widest mb-2">Resonance Score</p>
            <p className="text-3xl font-display text-resonance-cream">{globalCoherence.toLocaleString()}</p>
          </div>
          <div className="bg-resonance-bg/50 p-6 rounded-xl border border-resonance-border backdrop-blur-sm group hover:border-resonance-gold/40 transition-colors">
            <p className="text-resonance-muted text-[10px] font-ui uppercase tracking-widest mb-2">Live Participants</p>
            <p className="text-3xl font-display text-resonance-cream">{activeParticipants.toLocaleString()}</p>
          </div>
          <div className="bg-resonance-bg/50 p-6 rounded-xl border border-resonance-border backdrop-blur-sm group hover:border-resonance-gold/40 transition-colors">
            <p className="text-resonance-muted text-[10px] font-ui uppercase tracking-widest mb-2">Field Status</p>
            <p className="text-3xl font-display text-resonance-gold italic">Synchronized</p>
          </div>
        </div>
      </div>

      {/* Practice Logger Section */}
      <div className="bg-resonance-surface p-8 rounded-2xl border border-resonance-border shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <Clock className="w-8 h-8 text-resonance-gold" />
          <h2 className="text-2xl font-display text-resonance-cream">Practice Logger</h2>
        </div>

        <p className="text-resonance-muted font-body mb-6 max-w-xl">
          Each minute of intentional presence ripples outward. Log your practice to anchor it in the collective field.
        </p>

        <div className="flex gap-4 mb-8">
          <input
            type="text"
            value={practiceLog}
            onChange={(e) => setPracticeLog(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addPractice()}
            placeholder="What practice did you anchor today? (e.g., 20min meditation)"
            className="flex-1 bg-resonance-bg border border-resonance-border rounded-xl px-6 py-3 text-resonance-cream font-ui focus:border-resonance-gold focus:outline-none transition-colors"
          />
          <button
            onClick={addPractice}
            disabled={!practiceLog.trim()}
            className="px-8 py-3 bg-resonance-gold text-resonance-bg rounded-full font-ui font-bold hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg"
          >
            <Plus size={18} />
            <span>Anchor Practice</span>
          </button>
        </div>

        {practices.length > 0 && (
          <div className="space-y-3 animate-in slide-in-from-top-2 duration-500">
            <h3 className="text-xs font-ui uppercase tracking-widest text-resonance-muted mb-4">Recent Anchors</h3>
            {practices.slice(0, 5).map((practice, index) => (
              <div
                key={index}
                className="bg-resonance-bg/30 p-4 rounded-xl border border-resonance-border flex justify-between items-center group hover:border-resonance-gold/20 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-1.5 h-1.5 bg-resonance-gold rounded-full animate-pulse" />
                  <p className="text-resonance-cream font-ui text-sm">{practice.text}</p>
                </div>
                <p className="text-[10px] font-ui text-resonance-muted uppercase">
                  {practice.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feed Section */}
      <div className="bg-resonance-surface p-8 rounded-2xl border border-resonance-border shadow-xl">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-resonance-gold" />
            <h2 className="text-3xl font-display text-resonance-cream">The Consciousness Feed</h2>
          </div>
          <button
            onClick={loadConsciousnessFeed}
            disabled={isLoading}
            className="px-6 py-2 border border-resonance-gold/30 text-resonance-gold rounded-full hover:bg-resonance-gold/10 transition-all text-xs font-ui uppercase tracking-widest"
          >
            {isLoading ? 'Tuning...' : 'Refresh Field'}
          </button>
        </div>

        {error && (
          <div className="bg-resonance-danger/10 p-6 rounded-xl border border-resonance-danger/30 mb-8">
            <p className="text-resonance-cream text-sm font-ui">{error}</p>
          </div>
        )}

        {isLoading && feed.length === 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-64 bg-resonance-bg border border-resonance-border rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {feed.map((item, index) => {
              const Icon = categoryIcons[item.category] || Activity;
              
              return (
                <div key={index} className={`bg-resonance-bg/50 p-8 rounded-2xl border ${categoryColors[item.category]?.split(' ')[2] || 'border-resonance-border'} shadow-lg hover:-translate-y-1 transition-all duration-300 group`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <Icon className="w-5 h-5 text-resonance-gold" />
                    <span className="text-[10px] font-ui uppercase tracking-widest text-resonance-muted">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-display text-resonance-cream mb-3 group-hover:text-resonance-gold transition-colors">{item.title}</h3>
                  <p className="text-resonance-muted font-body text-sm mb-6 leading-relaxed line-clamp-3">{item.summary}</p>
                  
                  <div className="space-y-4 pt-4 border-t border-resonance-border/50">
                    <div>
                      <p className="text-[10px] font-ui uppercase tracking-widest text-resonance-gold mb-1">Deeper Insight</p>
                      <p className="text-xs font-body italic text-resonance-cream opacity-80 leading-relaxed">{item.insight}</p>
                    </div>
                    
                    <div>
                      <p className="text-[10px] font-ui uppercase tracking-widest text-resonance-muted mb-1">Action Step</p>
                      <p className="text-xs font-ui text-resonance-cream">{item.action}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectiveCoherence;
