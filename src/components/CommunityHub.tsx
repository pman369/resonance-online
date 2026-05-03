import React, { useState, useEffect } from 'react';
import { MessageCircle, Users, MessageSquare, Heart, Plus, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';

interface Story {
  id: string;
  user_id: string;
  username?: string;
  content: string;
  impact: string;
  likes_count: number;
  created_at: string;
  liked?: boolean;
}

const CommunityHub: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'stories' | 'circles' | 'discussions'>('stories');
  const [stories, setStories] = useState<Story[]>([]);
  const [newStory, setNewStory] = useState('');
  const [impact, setImpact] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (activeTab === 'stories') {
      fetchStories();
      
      const channel = supabase
        .channel('public_stories')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'stories' }, (payload) => {
          setStories(prev => [payload.new as Story, ...prev]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeTab]);

  async function fetchStories() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('stories')
        .select(`
          *,
          profiles:user_id (username)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      const formatted = (data || []).map(s => ({
        ...s,
        username: (s as any).profiles?.username || 'Anonymous Traveler'
      }));
      
      setStories(formatted);
    } catch (err) {
      console.error('Error fetching stories:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleShareStory = async () => {
    if (!newStory.trim() || !user) return;

    setIsPosting(true);
    try {
      const { error } = await supabase
        .from('stories')
        .insert([{
          user_id: user.id,
          content: newStory.trim(),
          impact: impact.trim() || 'Shared my truth'
        }]);

      if (error) throw error;
      
      setNewStory('');
      setImpact('');
      // Real-time subscription will handle the UI update
    } catch (err) {
      console.error('Error sharing story:', err);
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = async (storyId: string, currentLikes: number) => {
    if (!user) return;
    try {
      // Optimistic update
      setStories(stories.map(s => s.id === storyId ? { ...s, likes_count: s.likes_count + 1 } : s));
      
      const { error } = await supabase
        .from('stories')
        .update({ likes_count: currentLikes + 1 })
        .eq('id', storyId);

      if (error) throw error;
    } catch (err) {
      console.error('Error liking story:', err);
      // Revert on error
      fetchStories();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-resonance-surface p-8 rounded-2xl border border-resonance-border shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <MessageCircle className="w-8 h-8 text-resonance-gold" />
          <h2 className="text-3xl font-display text-resonance-cream">Community Hub</h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-resonance-bg rounded-xl border border-resonance-border w-fit">
          {(['stories', 'circles', 'discussions'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-ui text-sm transition-all ${
                activeTab === tab
                  ? 'bg-resonance-gold text-resonance-bg font-bold shadow-lg'
                  : 'text-resonance-muted hover:text-resonance-cream'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stories Tab */}
      {activeTab === 'stories' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Share Story CTA */}
          <div className="bg-resonance-surface rounded-2xl p-8 border border-resonance-border relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Plus size={80} className="text-resonance-gold" />
            </div>
            
            <h3 className="text-xl font-display text-resonance-cream mb-4">Share Your Journey</h3>
            <p className="text-resonance-muted font-body mb-6 max-w-2xl">
              How has your frequency shifted? Be real, not perfect. Your vulnerability creates permission for others to do the same.
            </p>
            
            <div className="space-y-4 relative z-10">
              <textarea
                value={newStory}
                onChange={(e) => setNewStory(e.target.value)}
                placeholder="What moment of resonance did you experience today?"
                className="w-full bg-resonance-bg border border-resonance-border rounded-xl p-4 text-resonance-cream font-ui focus:border-resonance-gold focus:outline-none transition-colors min-h-[120px]"
              />
              <input 
                type="text"
                value={impact}
                onChange={(e) => setImpact(e.target.value)}
                placeholder="Briefly, what was the impact?"
                className="w-full bg-resonance-bg border border-resonance-border rounded-xl p-4 text-resonance-cream font-ui focus:border-resonance-gold focus:outline-none transition-colors"
              />
              <button
                onClick={handleShareStory}
                disabled={isPosting || !newStory.trim()}
                className="bg-resonance-gold hover:brightness-110 text-resonance-bg px-8 py-3 rounded-full font-ui font-bold transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isPosting ? 'Sending...' : 'Share My Story'}
              </button>
            </div>
          </div>

          {/* Story Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading && stories.length === 0 ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 bg-resonance-surface border border-resonance-border rounded-2xl animate-pulse" />
              ))
            ) : stories.map(story => (
              <div key={story.id} className="bg-resonance-surface rounded-2xl p-6 border border-resonance-border shadow-lg hover:border-resonance-gold/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-display text-lg text-resonance-cream">{story.username}</p>
                    <p className="text-[10px] font-ui uppercase tracking-widest text-resonance-muted">
                      {new Date(story.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Shield size={16} className="text-resonance-muted/30" />
                </div>

                <p className="text-resonance-muted font-body leading-relaxed mb-6 italic">"{story.content}"</p>

                <div className="bg-resonance-bg/50 rounded-xl p-4 border border-resonance-border mb-6">
                  <p className="text-xs font-ui text-resonance-gold uppercase tracking-widest mb-1">Impact</p>
                  <p className="text-sm font-ui text-resonance-cream">{story.impact}</p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-resonance-border">
                  <button 
                    onClick={() => handleLike(story.id, story.likes_count)}
                    className="flex items-center gap-2 text-resonance-muted hover:text-resonance-gold transition-colors"
                  >
                    <Heart size={16} />
                    <span className="text-xs font-ui">{story.likes_count}</span>
                  </button>
                  <button className="flex items-center gap-2 text-resonance-muted hover:text-resonance-gold transition-colors">
                    <MessageSquare size={16} />
                    <span className="text-xs font-ui">0 Comments</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Circles & Discussions (Placeholders for now, styled for dark theme) */}
      {(activeTab === 'circles' || activeTab === 'discussions') && (
        <div className="bg-resonance-surface p-16 rounded-2xl border border-resonance-border text-center shadow-xl">
          {activeTab === 'circles' ? (
            <Users className="w-16 h-16 text-resonance-gold mx-auto mb-6 opacity-80" />
          ) : (
            <MessageSquare className="w-16 h-16 text-resonance-gold mx-auto mb-6 opacity-80" />
          )}
          <h3 className="text-2xl font-display text-resonance-cream mb-4">The Collective Field is Awakening</h3>
          <p className="text-resonance-muted font-body mb-8 max-w-xl mx-auto">
            {activeTab === 'circles' 
              ? "Small, intimate groups built around shared resonance—not demographics. Find your frequency."
              : "Ongoing discussions about consciousness, presence, and collective awakening. Share your depth."}
          </p>
          <div className="px-6 py-2 bg-resonance-bg border border-resonance-gold/20 text-resonance-gold rounded-full w-fit mx-auto text-xs font-ui uppercase tracking-widest">
            Coming Soon to the Field
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityHub;
