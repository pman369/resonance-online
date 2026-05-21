import React, { useEffect, useState } from 'react';
import { MessageSquare, MessageCircle, ArrowRight, BookOpen, Brain, Zap, Plus, X, Waves, Anchor } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Thread, fetchThreads, createThread } from '../../../api/communityClient';
import { DiscussionThreadDetail } from './DiscussionThreadDetail';

interface Topic {
  id: string;
  label: string;
  description: string;
}

type SortMode = 'active' | 'still';

export const DiscussionSection: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('active');

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [topicId, setTopicId] = useState('');

  const topicIcons: { [key: string]: any } = {
    integration: BookOpen,
    presence: Brain,
    wisdom: MessageCircle,
    synchronicity: Zap
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadThreads();
  }, [selectedTopic, sortMode]);

  async function loadInitialData() {
    try {
      const { data } = await supabase.from('discussion_topics').select('*');
      setTopics(data || []);
      if (data && data.length > 0) setTopicId(data[0].id);
      loadThreads();
    } catch (err) {
      console.error('Error loading topics:', err);
    }
  }

  async function loadThreads() {
    setIsLoading(true);
    try {
      const data = await fetchThreads(selectedTopic || undefined);
      
      let sorted = [...data];
      if (sortMode === 'active') {
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      } else {
        sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      }
      
      setThreads(sorted as any);
    } catch (err) {
      console.error('Error loading threads:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !topicId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createThread(title.trim(), content.trim(), topicId);
      setShowCreateModal(false);
      setTitle('');
      setContent('');
      loadThreads();
    } catch (err) {
      console.error('Error creating thread:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (selectedThread) {
    return (
      <DiscussionThreadDetail 
        thread={selectedThread} 
        onBack={() => setSelectedThread(null)}
        topicLabel={topics.find(t => t.id === selectedThread.topic_id)?.label}
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Topics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {topics.map(topic => {
          const Icon = topicIcons[topic.id] || MessageSquare;
          const isActive = selectedTopic === topic.id;
          return (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(isActive ? null : topic.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-500 group ${
                isActive 
                  ? 'bg-resonance-gold/10 border-resonance-gold shadow-lg shadow-resonance-gold/5' 
                  : 'bg-resonance-surface border-resonance-border hover:border-resonance-gold/30'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 transition-colors ${isActive ? 'bg-resonance-gold text-resonance-bg' : 'bg-resonance-bg text-resonance-gold group-hover:bg-resonance-gold/20'}`}>
                <Icon size={16} />
              </div>
              <h4 className={`text-xs font-bold uppercase tracking-widest mb-1 ${isActive ? 'text-resonance-gold' : 'text-resonance-cream'}`}>{topic.label}</h4>
              <p className="text-[10px] text-resonance-muted line-clamp-2 leading-relaxed">{topic.description}</p>
            </button>
          );
        })}
      </div>

      {/* Threads List */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
          <div className="flex items-center gap-6">
            <h3 className="text-xl font-display text-resonance-cream">
              {selectedTopic ? topics.find(t => t.id === selectedTopic)?.label : 'Deep Inquiries'}
            </h3>
            <div className="flex bg-resonance-bg rounded-full p-1 border border-resonance-border">
              <button 
                onClick={() => setSortMode('active')}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest transition-all ${sortMode === 'active' ? 'bg-resonance-gold text-resonance-bg font-bold' : 'text-resonance-muted hover:text-resonance-cream'}`}
              >
                <Waves size={12} /> Active Currents
              </button>
              <button 
                onClick={() => setSortMode('still')}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest transition-all ${sortMode === 'still' ? 'bg-resonance-gold text-resonance-bg font-bold' : 'text-resonance-muted hover:text-resonance-cream'}`}
              >
                <Anchor size={12} /> Still Waters
              </button>
            </div>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-2 bg-resonance-gold text-resonance-bg rounded-full font-ui text-[10px] uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus size={14} /> New Thread
          </button>
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-resonance-bg/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-resonance-surface w-full max-w-2xl rounded-2xl border border-resonance-border p-8 shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl font-display text-resonance-cream">Manifest Inquiry</h4>
                <button onClick={() => setShowCreateModal(false)} className="text-resonance-muted hover:text-resonance-gold transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateThread} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-ui uppercase tracking-widest text-resonance-gold">Inquiry Title</label>
                    <input 
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., The Nature of Synchronicity"
                      className="w-full bg-resonance-bg border border-resonance-border rounded-xl px-4 py-3 text-resonance-cream font-ui focus:border-resonance-gold focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-ui uppercase tracking-widest text-resonance-gold">Domain</label>
                    <select 
                      value={topicId}
                      onChange={(e) => setTopicId(e.target.value)}
                      className="w-full bg-resonance-bg border border-resonance-border rounded-xl px-4 py-3 text-resonance-cream font-ui focus:border-resonance-gold focus:outline-none transition-colors appearance-none cursor-pointer"
                    >
                      {topics.map(t => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-ui uppercase tracking-widest text-resonance-gold">The Deep Query</label>
                  <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Provide the context for this exploration..."
                    className="w-full bg-resonance-bg border border-resonance-border rounded-xl px-4 py-3 text-resonance-cream font-ui focus:border-resonance-gold focus:outline-none transition-colors min-h-[150px]"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !content.trim()}
                  className="w-full bg-resonance-gold text-resonance-bg py-3 rounded-xl font-ui font-bold uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Manifesting...' : 'Open Inquiry Line'}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {isLoading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-resonance-surface border border-resonance-border rounded-2xl animate-pulse" />
            ))
          ) : threads.length === 0 ? (
            <div className="py-20 text-center bg-resonance-surface/20 rounded-3xl border border-resonance-border border-dashed">
              <MessageSquare className="w-12 h-12 text-resonance-muted mx-auto mb-4 opacity-30" />
              <p className="text-resonance-muted font-display text-lg">The field is quiet. Why not start a conversation?</p>
            </div>
          ) : (
            threads.map(thread => (
              <div 
                key={thread.id} 
                onClick={() => setSelectedThread(thread)}
                className="bg-resonance-surface p-6 rounded-2xl border border-resonance-border hover:border-resonance-gold/20 transition-all group flex items-center justify-between gap-6 cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[8px] bg-resonance-gold/10 text-resonance-gold px-2 py-0.5 rounded-full uppercase tracking-widest border border-resonance-gold/20">
                      {topics.find(t => t.id === thread.topic_id)?.label}
                    </span>
                    <span className="text-[10px] text-resonance-muted font-ui uppercase tracking-widest">{thread.username}</span>
                  </div>
                  <h4 className="text-lg font-display text-resonance-cream mb-1 truncate group-hover:text-resonance-gold transition-colors">{thread.title}</h4>
                  <p className="text-sm text-resonance-muted line-clamp-1 italic font-body">"{thread.content}"</p>
                </div>
                <button className="w-10 h-10 rounded-full bg-resonance-bg border border-resonance-border flex items-center justify-center text-resonance-muted group-hover:text-resonance-gold group-hover:border-resonance-gold/30 transition-all">
                  <ArrowRight size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

