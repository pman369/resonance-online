import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { Clock, Brain, Sparkles, Moon, BookOpen, ChevronRight, Search } from 'lucide-react';

interface Reflection {
  id: string;
  feature: string;
  input_text: string;
  result_json: any;
  created_at: string;
}

const featureIcons: Record<string, any> = {
  consciousness_map: Brain,
  wisdom: BookOpen,
  synchronicity: Sparkles,
  shadow: Moon
};

const featureLabels: Record<string, string> = {
  consciousness_map: 'Consciousness Map',
  wisdom: 'Ancient Wisdom',
  synchronicity: 'Synchronicity',
  shadow: 'Shadow Work'
};

const UserJourneyHistory: React.FC = () => {
  const { user } = useAuth();
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [selectedReflection, setSelectedReflection] = useState<Reflection | null>(null);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user, filter]);

  async function fetchHistory() {
    setIsLoading(true);
    try {
      let query = supabase
        .from('ai_reflections')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('feature', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setReflections(data || []);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="bg-resonance-surface p-8 rounded-2xl border border-resonance-border shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-resonance-gold" />
            <h2 className="text-3xl font-display text-resonance-cream">Your Journey History</h2>
          </div>
          
          <div className="flex items-center gap-3 p-1 bg-resonance-bg rounded-xl border border-resonance-border w-fit">
            {['all', 'consciousness_map', 'wisdom', 'synchronicity', 'shadow'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-ui text-[10px] uppercase tracking-widest transition-all ${
                  filter === f
                    ? 'bg-resonance-gold text-resonance-bg font-bold'
                    : 'text-resonance-muted hover:text-resonance-cream'
                }`}
              >
                {f === 'all' ? 'All' : f.split('_')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Timeline List */}
        <div className="lg:col-span-5 space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {isLoading && reflections.length === 0 ? (
            [1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-24 bg-resonance-surface border border-resonance-border rounded-xl animate-pulse" />
            ))
          ) : reflections.length === 0 ? (
            <div className="bg-resonance-surface p-12 rounded-2xl border border-resonance-border text-center">
              <Search className="w-12 h-12 text-resonance-muted mx-auto mb-4 opacity-30" />
              <p className="text-resonance-muted font-body italic">The pages are empty. <br /> Begin a reflection to start your journey.</p>
            </div>
          ) : (
            reflections.map((r) => {
              const Icon = featureIcons[r.feature] || Sparkles;
              const isActive = selectedReflection?.id === r.id;
              
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedReflection(r)}
                  className={`w-full text-left p-6 rounded-xl border transition-all duration-300 group ${
                    isActive 
                      ? 'bg-resonance-gold/10 border-resonance-gold shadow-lg' 
                      : 'bg-resonance-surface border-resonance-border hover:border-resonance-gold/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-resonance-gold text-resonance-bg' : 'bg-resonance-bg text-resonance-gold'}`}>
                        <Icon size={16} />
                      </div>
                      <span className="font-display text-resonance-cream text-lg">{featureLabels[r.feature]}</span>
                    </div>
                    <span className="text-[10px] font-ui uppercase tracking-widest text-resonance-muted">
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-resonance-muted font-body text-xs line-clamp-1 italic">"{r.input_text}"</p>
                </button>
              );
            })
          )}
        </div>

        {/* Detailed View */}
        <div className="lg:col-span-7">
          {selectedReflection ? (
            <div className="bg-resonance-surface rounded-2xl border border-resonance-border p-8 shadow-2xl animate-in zoom-in-95 duration-500 sticky top-24">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-resonance-border">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-resonance-gold text-resonance-bg rounded-full flex items-center justify-center">
                    {React.createElement(featureIcons[selectedReflection.feature] || Sparkles, { size: 24 })}
                  </div>
                  <div>
                    <h3 className="text-2xl font-display text-resonance-cream">{featureLabels[selectedReflection.feature]}</h3>
                    <p className="text-[10px] font-ui uppercase tracking-widest text-resonance-gold">
                      Archived on {new Date(selectedReflection.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-[10px] font-ui uppercase tracking-[0.2em] text-resonance-muted mb-3">The Reflection</h4>
                  <p className="text-lg font-body italic text-resonance-cream leading-relaxed border-l-2 border-resonance-gold/30 pl-6">
                    "{selectedReflection.input_text}"
                  </p>
                </div>

                <div className="bg-resonance-bg/50 rounded-2xl p-6 border border-resonance-border">
                  <h4 className="text-[10px] font-ui uppercase tracking-[0.2em] text-resonance-gold mb-6">AI Insight Received</h4>
                  
                  {/* Render based on feature type */}
                  <div className="space-y-6 text-resonance-muted font-body leading-relaxed">
                    {selectedReflection.feature === 'consciousness_map' && (
                      <>
                        <p className="text-resonance-cream text-lg font-display italic">"{selectedReflection.result_json.frequency}"</p>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <p className="text-[10px] font-ui uppercase tracking-widest text-resonance-gold mb-2">Growth Edges</p>
                            <ul className="text-xs space-y-1">
                              {selectedReflection.result_json.growthEdges?.map((e: string, i: number) => <li key={i}>• {e}</li>)}
                            </ul>
                          </div>
                          <div>
                            <p className="text-[10px] font-ui uppercase tracking-widest text-resonance-gold mb-2">Flow Triggers</p>
                            <ul className="text-xs space-y-1">
                              {selectedReflection.result_json.flowTriggers?.map((e: string, i: number) => <li key={i}>• {e}</li>)}
                            </ul>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-ui uppercase tracking-widest text-resonance-gold mb-2">Pattern</p>
                          <p className="text-xs">{selectedReflection.result_json.patterns}</p>
                        </div>
                      </>
                    )}
                    
                    {selectedReflection.feature === 'wisdom' && (
                      <div className="space-y-4">
                        <p className="text-resonance-cream text-lg font-display italic">"{selectedReflection.result_json.teaching}"</p>
                        <div>
                          <p className="text-[10px] font-ui uppercase tracking-widest text-resonance-gold mb-1">Practice</p>
                          <p className="text-xs">{selectedReflection.result_json.practice}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-ui uppercase tracking-widest text-resonance-gold mb-1">Reframe</p>
                          <p className="text-xs italic">{selectedReflection.result_json.reframe}</p>
                        </div>
                      </div>
                    )}

                    {/* Generic fallback for raw JSON or other features */}
                    {!['consciousness_map', 'wisdom'].includes(selectedReflection.feature) && (
                       <pre className="text-[10px] opacity-50 overflow-x-auto p-4 bg-resonance-bg rounded-lg">
                         {JSON.stringify(selectedReflection.result_json, null, 2)}
                       </pre>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[60vh] bg-resonance-surface rounded-2xl border border-resonance-border border-dashed flex items-center justify-center text-center p-12">
              <div className="max-w-xs">
                <ChevronRight className="w-12 h-12 text-resonance-gold/20 mx-auto mb-4" />
                <h3 className="font-display text-xl text-resonance-muted">Select a moment from your timeline to revisit the insight.</h3>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserJourneyHistory;
