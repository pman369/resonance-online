import React, { useEffect, useState } from 'react';
import { MessageSquare, MessageCircle, ArrowRight, BookOpen, Brain, Zap, Plus } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Thread, fetchThreads } from '../../../api/communityClient';

interface Topic {
  id: string;
  label: string;
  description: string;
}

export const DiscussionSection: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
  }, [selectedTopic]);

  async function loadInitialData() {
    try {
      const { data } = await supabase.from('discussion_topics').select('*');
      setTopics(data || []);
      loadThreads();
    } catch (err) {
      console.error('Error loading topics:', err);
    }
  }

  async function loadThreads() {
    setIsLoading(true);
    try {
      const data = await fetchThreads(selectedTopic || undefined);
      setThreads(data as any);
    } catch (err) {
      console.error('Error loading threads:', err);
    } finally {
      setIsLoading(false);
    }
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
        <div className="flex justify-between items-center px-2">
          <h3 className="text-xl font-display text-resonance-cream">
            {selectedTopic ? topics.find(t => t.id === selectedTopic)?.label : 'Deep Inquiries'}
          </h3>
          <button className="flex items-center gap-2 px-6 py-2 bg-resonance-gold text-resonance-bg rounded-full font-ui text-[10px] uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all">
            <Plus size={14} /> New Thread
          </button>
        </div>

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
              <div key={thread.id} className="bg-resonance-surface p-6 rounded-2xl border border-resonance-border hover:border-resonance-gold/20 transition-all group flex items-center justify-between gap-6">
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
