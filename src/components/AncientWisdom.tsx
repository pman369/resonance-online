import React, { useState, useCallback } from 'react';
import { BookOpen, Clock, Lightbulb, RotateCcw, Sparkles } from 'lucide-react';
import { getWisdom, WisdomData } from '../api/client';

const AncientWisdom: React.FC = () => {
  const [situation, setSituation] = useState('');
  const [data, setData] = useState<WisdomData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const retrieveWisdom = useCallback(async () => {
    if (!situation.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await getWisdom(situation) as WisdomData;
      setData(result);
    } catch (err) {
      setError('Could not retrieve wisdom. The well is deep but temporarily silent. Please try again.');
      console.error('Wisdom error:', err);
    }
    setIsLoading(false);
  }, [situation]);

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <div className="bg-resonance-surface p-10 rounded-2xl border border-resonance-border shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-resonance-gold font-display text-[12rem] pointer-events-none select-none">✺</div>
        
        <div className="flex items-center space-x-4 mb-8 relative z-10">
          <div className="w-12 h-12 bg-resonance-gold/10 rounded-full flex items-center justify-center border border-resonance-gold/30">
            <BookOpen className="w-6 h-6 text-resonance-gold" />
          </div>
          <h2 className="text-4xl font-display text-resonance-cream">Ancient Wisdom</h2>
        </div>

        <p className="text-resonance-muted mb-8 leading-relaxed font-body text-lg max-w-2xl relative z-10">
          Share a situation you're navigating. Timeless teachings from diverse traditions
          will meet you where you are—adapted for now, rooted in eternity.
        </p>

        <textarea
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          placeholder="Describe what you're facing. The traditions are listening..."
          className="w-full h-32 bg-resonance-bg border border-resonance-border rounded-xl p-6 text-resonance-cream font-body text-lg focus:border-resonance-gold focus:outline-none transition-all resize-none relative z-10"
        />

        <button
          onClick={retrieveWisdom}
          disabled={isLoading || !situation.trim()}
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
                <span className="text-resonance-gold">Consulting the lineages...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Receive Wisdom</span>
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
            {/* Teaching */}
            <div className="bg-resonance-surface/50 p-8 rounded-2xl border border-resonance-border shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <Lightbulb className="w-6 h-6 text-resonance-gold" />
                <h3 className="text-xl font-display text-resonance-cream">The Teaching</h3>
              </div>
              <div className="bg-resonance-bg/40 p-6 rounded-xl border border-resonance-border">
                <p className="text-resonance-cream leading-relaxed text-lg font-body">{data.teaching}</p>
              </div>
            </div>

            {/* Practice */}
            <div className="bg-resonance-surface/50 p-8 rounded-2xl border border-resonance-border shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <Clock className="w-6 h-6 text-resonance-gold" />
                <h3 className="text-xl font-display text-resonance-cream">Practice for Today</h3>
              </div>
              <div className="bg-resonance-bg/40 p-6 rounded-xl border border-resonance-border">
                <p className="text-resonance-muted font-body leading-relaxed">{data.practice}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Reframe */}
            <div className="bg-resonance-surface/50 p-8 rounded-2xl border border-resonance-border shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <RotateCcw className="w-6 h-6 text-resonance-gold" />
                <h3 className="text-xl font-display text-resonance-cream">The Reframe</h3>
              </div>
              <div className="bg-resonance-bg/40 p-8 rounded-xl border border-resonance-border">
                <p className="text-resonance-gold italic leading-relaxed text-center font-display text-xl">
                  "{data.reframe}"
                </p>
              </div>
            </div>

            {/* Tradition */}
            <div className="bg-resonance-surface/50 p-8 rounded-2xl border border-resonance-border shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <BookOpen className="w-6 h-6 text-resonance-gold" />
                <h3 className="text-xl font-display text-resonance-cream">Lineage Honored</h3>
              </div>
              <div className="bg-resonance-bg/40 p-6 rounded-xl border border-resonance-border">
                <p className="text-resonance-muted font-ui uppercase tracking-widest text-xs mb-2">Source</p>
                <p className="text-resonance-cream font-body leading-relaxed">{data.tradition}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AncientWisdom;
