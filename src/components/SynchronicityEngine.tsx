import React, { useState, useCallback } from 'react';
import { Zap, Book, User, Activity, MessageCircle, Sparkles } from 'lucide-react';
import { findSynchronicities } from '../api/client';

interface Resource {
  title: string;
  insight: string;
}

interface SynchronicityData {
  resources: Resource[];
  practice: string;
  question: string;
  connection: string;
}

const SynchronicityEngine: React.FC = () => {
  const [interest, setInterest] = useState('');
  const [data, setData] = useState<SynchronicityData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSynchronicities = useCallback(async () => {
    if (!interest.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await findSynchronicities(interest) as SynchronicityData;
      setData(result);
    } catch (err) {
      setError('Could not generate synchronicities. The universe is quiet right now. Please try again.');
      console.error('Synchronicity error:', err);
    }
    setIsLoading(false);
  }, [interest]);

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <div className="bg-resonance-surface p-10 rounded-2xl border border-resonance-border shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-resonance-gold font-display text-[12rem] pointer-events-none select-none">✧</div>
        
        <div className="flex items-center space-x-4 mb-8 relative z-10">
          <div className="w-12 h-12 bg-resonance-gold/10 rounded-full flex items-center justify-center border border-resonance-gold/30">
            <Zap className="w-6 h-6 text-resonance-gold" />
          </div>
          <h2 className="text-4xl font-display text-resonance-cream">Synchronicity Engine</h2>
        </div>

        <p className="text-resonance-muted mb-8 leading-relaxed font-body text-lg max-w-2xl relative z-10">
          What's calling to you? Share an interest, question, or theme you're exploring.
          The universe might just wink back.
        </p>

        <input
          type="text"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          placeholder="What are you exploring? Curiosity, questions, longings..."
          className="w-full bg-resonance-bg border border-resonance-border rounded-xl p-6 text-resonance-cream font-body text-lg focus:border-resonance-gold focus:outline-none transition-all relative z-10"
          onKeyDown={(e) => e.key === 'Enter' && generateSynchronicities()}
        />

        <button
          onClick={generateSynchronicities}
          disabled={isLoading || !interest.trim()}
          className={`mt-8 relative overflow-hidden transition-all group px-10 py-4 rounded-full font-ui font-bold shadow-xl ${
            isLoading
              ? 'bg-resonance-surface border border-resonance-gold/50 cursor-wait'
              : 'bg-resonance-gold text-resonance-bg hover:brightness-110 active:scale-[0.98]'
          }`}
        >
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          )}
          <span className="flex items-center justify-center gap-3">
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-resonance-gold border-t-transparent rounded-full animate-spin" />
                <span className="text-resonance-gold">The universe is conspiring...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Find What's Waiting</span>
              </>
            )}
          </span>
        </button>
      </div>

      {error && (
        <div className="bg-resonance-danger/10 p-8 rounded-2xl border border-resonance-danger/30 text-center animate-in shake-1 duration-500">
          <p className="text-resonance-cream font-ui">{error}</p>
        </div>
      )}

      {data && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Resources */}
            <div className="bg-resonance-surface/50 p-8 rounded-2xl border border-resonance-border shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <Book className="w-6 h-6 text-resonance-gold" />
                <h3 className="text-xl font-display text-resonance-cream">Resources Finding You</h3>
              </div>
              <div className="space-y-4">
                {data.resources.map((resource, i) => (
                  <div key={i} className="bg-resonance-bg/40 p-6 rounded-xl border border-resonance-border group hover:border-resonance-gold/30 transition-colors">
                    <p className="font-display text-lg text-resonance-gold mb-2">{resource.title}</p>
                    <p className="text-sm text-resonance-muted italic font-body leading-relaxed">"{resource.insight}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Practice */}
            <div className="bg-resonance-surface/50 p-8 rounded-2xl border border-resonance-border shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <Activity className="w-6 h-6 text-resonance-gold" />
                <h3 className="text-xl font-display text-resonance-cream">Embodied Practice</h3>
              </div>
              <div className="bg-resonance-bg/40 p-6 rounded-xl border border-resonance-border">
                <p className="text-resonance-muted font-body leading-relaxed">{data.practice}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Question */}
            <div className="bg-resonance-surface/50 p-8 rounded-2xl border border-resonance-border shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <MessageCircle className="w-6 h-6 text-resonance-gold" />
                <h3 className="text-xl font-display text-resonance-cream">Contemplate This</h3>
              </div>
              <div className="bg-resonance-bg/40 p-8 rounded-xl border border-resonance-border">
                <p className="text-2xl font-display text-resonance-gold italic leading-relaxed text-center">
                  "{data.question}"
                </p>
              </div>
            </div>

            {/* Connection */}
            <div className="bg-resonance-surface/50 p-8 rounded-2xl border border-resonance-border shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <User className="w-6 h-6 text-resonance-gold" />
                <h3 className="text-xl font-display text-resonance-cream">Who to Seek</h3>
              </div>
              <div className="bg-resonance-bg/40 p-6 rounded-xl border border-resonance-border">
                <p className="text-resonance-muted font-body leading-relaxed">{data.connection}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SynchronicityEngine;
