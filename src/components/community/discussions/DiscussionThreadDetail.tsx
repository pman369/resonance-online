import React, { useEffect, useState } from 'react';
import { ArrowLeft, MessageSquare, Send, CornerDownRight, Clock, User } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Thread, fetchComments, postComment, Comment } from '../../../api/communityClient';
import { useAuth } from '../../../lib/AuthContext';

interface DiscussionThreadDetailProps {
  thread: Thread;
  onBack: () => void;
  topicLabel?: string;
}

export const DiscussionThreadDetail: React.FC<DiscussionThreadDetailProps> = ({ thread, onBack, topicLabel }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadComments();
    
    const channel = supabase
      .channel(`thread_comments_${thread.id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'content_comments', 
        filter: `content_id=eq.${thread.id}` 
      }, () => {
        loadComments();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [thread.id]);

  async function loadComments() {
    try {
      const data = await fetchComments(thread.id);
      setComments(data as any);
    } catch (err) {
      console.error('Error loading comments:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await postComment(thread.id, 'thread', newComment.trim());
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-ui text-resonance-muted hover:text-resonance-gold transition-colors uppercase tracking-[0.2em]"
      >
        <ArrowLeft size={14} /> Back to Inquiries
      </button>

      {/* Main Inquiry Card */}
      <div className="bg-resonance-surface rounded-2xl border border-resonance-border p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <MessageSquare size={120} className="text-resonance-gold" />
        </div>

        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="w-10 h-10 rounded-full bg-resonance-bg border border-resonance-border flex items-center justify-center text-resonance-gold">
            <User size={18} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-resonance-gold uppercase tracking-wider">{thread.username}</span>
              {topicLabel && (
                <span className="text-[8px] bg-resonance-gold/10 text-resonance-gold px-2 py-0.5 rounded-full uppercase tracking-widest border border-resonance-gold/20">
                  {topicLabel}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-resonance-muted uppercase tracking-widest mt-1">
              <Clock size={10} />
              {new Date(thread.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-display text-resonance-cream mb-6 relative z-10 leading-tight">
          {thread.title}
        </h2>
        
        <div className="prose prose-invert max-w-none relative z-10">
          <p className="text-resonance-muted font-body text-lg leading-relaxed italic border-l-2 border-resonance-gold/30 pl-6 py-2">
            "{thread.content}"
          </p>
        </div>
      </div>

      {/* Echoes Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-display text-resonance-cream px-2">Communal Echoes ({comments.length})</h3>

        <div className="space-y-4">
          {isLoading ? (
            [1, 2].map(i => (
              <div key={i} className="h-24 bg-resonance-surface border border-resonance-border rounded-2xl animate-pulse" />
            ))
          ) : comments.length === 0 ? (
            <div className="py-12 text-center bg-resonance-surface/20 rounded-2xl border border-resonance-border border-dashed">
              <p className="text-resonance-muted font-ui text-xs uppercase tracking-widest italic">The query awaits its first echo...</p>
            </div>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="flex gap-4 items-start group">
                <div className="mt-2"><CornerDownRight size={14} className="text-resonance-gold/40" /></div>
                <div className="flex-1 bg-resonance-surface p-6 rounded-2xl border border-resonance-border hover:border-resonance-gold/20 transition-all shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-resonance-gold uppercase tracking-wider">{comment.username}</span>
                    <span className="text-[8px] text-resonance-muted uppercase tracking-widest">
                      {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-resonance-cream font-ui leading-relaxed">{comment.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Input */}
        <div className="pt-6">
          <form onSubmit={handlePostComment} className="flex gap-4">
            <div className="flex-1 relative">
              <textarea 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Contribute your echo..."
                className="w-full bg-resonance-bg border border-resonance-border rounded-2xl px-6 py-4 text-sm text-resonance-cream font-ui focus:border-resonance-gold focus:outline-none transition-colors min-h-[100px] resize-none"
              />
            </div>
            <button 
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="self-end w-12 h-12 bg-resonance-gold text-resonance-bg rounded-2xl flex items-center justify-center hover:brightness-110 active:scale-90 transition-all shadow-lg shadow-resonance-gold/10 disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
