import React, { useState, useEffect } from 'react';
import { MessageCircle, MessageSquare, Heart, Plus, Shield, Send, CornerDownRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { ReactionType, addReaction, removeReaction, postComment, fetchComments, Comment } from '../api/communityClient';
import { CircleList } from './community/circles/CircleList';
import { DiscussionSection } from './community/discussions/DiscussionSection';

interface Story {
  id: string;
  user_id: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  content: string;
  impact: string;
  likes_count: number;
  created_at: string;
  reactions?: { [key in ReactionType]?: number };
  user_reaction?: ReactionType | null;
}

interface StoryCardProps {
  story: Story;
  onUpdate: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onUpdate }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isReactionMenuOpen, setIsReactionMenuOpen] = useState(false);

  const reactions: { type: ReactionType, icon: string, label: string }[] = [
    { type: 'resonate', icon: '✨', label: 'Resonate' },
    { type: 'expand', icon: '🌌', label: 'Expand' },
    { type: 'ground', icon: '🌱', label: 'Ground' },
    { type: 'deepen', icon: '⚓', label: 'Deepen' }
  ];

  useEffect(() => {
    if (showComments) {
      loadComments();
      const channel = supabase
        .channel(`comments_${story.id}`)
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'content_comments', 
          filter: `content_id=eq.${story.id}` 
        }, () => {
          loadComments();
        })
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [showComments, story.id]);

  async function loadComments() {
    try {
      const data = await fetchComments(story.id);
      setComments(data as any);
    } catch (err) {
      console.error('Error loading comments:', err);
    }
  }

  const handleReaction = async (type: ReactionType) => {
    if (!user) return;
    try {
      if (story.user_reaction === type) {
        await removeReaction(story.id, type);
      } else {
        await addReaction(story.id, 'story', type);
      }
      onUpdate();
      setIsReactionMenuOpen(false);
    } catch (err) {
      console.error('Error reacting:', err);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      await postComment(story.id, 'story', newComment.trim());
      setNewComment('');
      // Real-time will handle the list update
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const displayName = story.display_name || story.username || 'Anonymous Traveler';
  const initials = displayName.split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join('') || '✧';

  return (
    <div className="bg-resonance-surface rounded-2xl p-6 border border-resonance-border shadow-lg hover:border-resonance-gold/30 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-resonance-bg border border-resonance-gold/20 flex items-center justify-center text-resonance-gold font-display text-xs overflow-hidden">
            {story.avatar_url ? (
              <img src={story.avatar_url} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div>
            <p className="font-display text-lg text-resonance-cream leading-tight">{displayName}</p>
            <p className="text-[10px] font-ui uppercase tracking-widest text-resonance-muted">
              {new Date(story.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Shield size={16} className="text-resonance-muted/30" />
      </div>

      <p className="text-resonance-muted font-body leading-relaxed mb-6 italic">"{story.content}"</p>

      <div className="bg-resonance-bg/50 rounded-xl p-4 border border-resonance-border mb-6">
        <p className="text-xs font-ui text-resonance-gold uppercase tracking-widest mb-1">Impact</p>
        <p className="text-sm font-ui text-resonance-cream">{story.impact}</p>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-resonance-border">
        <div className="relative">
          <button 
            onMouseEnter={() => setIsReactionMenuOpen(true)}
            onClick={() => setIsReactionMenuOpen(!isReactionMenuOpen)}
            className={`flex items-center gap-2 transition-colors ${
              story.user_reaction ? 'text-resonance-gold' : 'text-resonance-muted hover:text-resonance-gold'
            }`}
          >
            <Heart size={16} fill={story.user_reaction ? "currentColor" : "none"} />
            <span className="text-xs font-ui">Resonate</span>
          </button>

          {isReactionMenuOpen && (
            <div 
              onMouseLeave={() => setIsReactionMenuOpen(false)}
              className="absolute bottom-full left-0 mb-2 p-2 bg-resonance-surface border border-resonance-border rounded-full shadow-2xl flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 z-50"
            >
              {reactions.map(r => (
                <button
                  key={r.type}
                  onClick={() => handleReaction(r.type)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl hover:bg-resonance-bg transition-all hover:scale-125 ${
                    story.user_reaction === r.type ? 'bg-resonance-gold/20' : ''
                  }`}
                  title={r.label}
                >
                  {r.icon}
                </button>
              ))}
            </div>
          )}
        </div>

        <button 
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-2 transition-colors ${
            showComments ? 'text-resonance-gold' : 'text-resonance-muted hover:text-resonance-gold'
          }`}
        >
          <MessageSquare size={16} />
          <span className="text-xs font-ui">{showComments ? 'Hide Comments' : 'Comments'}</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {comments.length === 0 ? (
              <p className="text-[10px] text-center text-resonance-muted uppercase tracking-widest py-4">Silence awaits your voice</p>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="flex gap-3 items-start">
                  <div className="mt-1"><CornerDownRight size={12} className="text-resonance-gold/40" /></div>
                  <div className="flex-1 bg-resonance-bg/30 p-3 rounded-xl border border-resonance-border/50">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-resonance-gold uppercase tracking-wider">{comment.username}</span>
                      <span className="text-[8px] text-resonance-muted uppercase">{new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs text-resonance-cream font-ui">{comment.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handlePostComment} className="flex gap-2">
            <input 
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add to the resonance..."
              className="flex-1 bg-resonance-bg border border-resonance-border rounded-full px-4 py-2 text-xs text-resonance-cream focus:outline-none focus:border-resonance-gold/50 transition-colors"
            />
            <button 
              type="submit"
              disabled={!newComment.trim() || isSubmittingComment}
              className="w-8 h-8 bg-resonance-gold text-resonance-bg rounded-full flex items-center justify-center hover:brightness-110 active:scale-90 transition-all disabled:opacity-50"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

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
        .channel('community_stories_sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'stories' }, () => {
          fetchStories();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'content_interactions' }, () => {
          fetchStories();
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [activeTab, user]);

  async function fetchStories() {
    setIsLoading(true);
    try {
      const { data: simpleData, error: simpleError } = await supabase
        .from('stories')
        .select(`
          *,
          profiles (
            username,
            display_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (simpleError) throw simpleError;

      // Fetch user's reactions for these stories
      const storyIds = (simpleData || []).map(s => s.id);
      let userReactions: any[] = [];
      if (user && storyIds.length > 0) {
        const { data: reactData } = await supabase
          .from('content_interactions')
          .select('content_id, reaction')
          .in('content_id', storyIds)
          .eq('user_id', user.id);
        userReactions = reactData || [];
      }
      
      const formatted = (simpleData || []).map(s => {
        const profile = (s as any).profiles;
        return {
          ...s,
          username: profile?.username || null,
          display_name: profile?.display_name || null,
          avatar_url: profile?.avatar_url || null,
          user_reaction: userReactions.find(r => r.content_id === s.id)?.reaction || null
        };
      });
      
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
    } catch (err) {
      console.error('Error sharing story:', err);
    } finally {
      setIsPosting(false);
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

      {/* Content Rendering */}
      <main className="min-h-[60vh]">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
              {isLoading && stories.length === 0 ? (
                [1, 2, 3, 4].map(i => (
                  <div key={i} className="h-64 bg-resonance-surface border border-resonance-border rounded-2xl animate-pulse" />
                ))
              ) : stories.map(story => (
                <StoryCard key={story.id} story={story} onUpdate={fetchStories} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'circles' && <CircleList />}
        {activeTab === 'discussions' && <DiscussionSection />}
      </main>
    </div>
  );
};

export default CommunityHub;
