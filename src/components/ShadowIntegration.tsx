import React, { useState, useCallback } from 'react';
import { Moon, Heart, Shield, Lightbulb, UserCheck, AlertTriangle, Sparkles } from 'lucide-react';
import { exploreShadow, ShadowData } from '../api/client';

const ShadowIntegration: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [data, setData] = useState<ShadowData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exploreShadowWork = useCallback(async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await exploreShadow(prompt) as ShadowData;
      setData(result);
    } catch (err) {
      setError('Could not complete shadow integration. The work is deep—please try again when ready.');
      console.error('Shadow work error:', err);
    }
    setIsLoading(false);
  }, [prompt]);

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      {/* Warning Banner */}
      <div className="bg-resonance-gold/5 border border-resonance-gold/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-resonance-gold flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-ui uppercase tracking-widest text-resonance-gold mb-1">This is deep work</p>
            <p className="text-sm text-resonance-muted font-body leading-relaxed">
              If you're experiencing crisis or trauma, please seek professional support. This is for self-awareness, not therapy.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-resonance-surface p-10 rounded-2xl border border-resonance-border shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-resonance-gold font-display text-[12rem] pointer-events-none select-none">☾</div>
        
        <div className="flex items-center space-x-4 mb-8 relative z-10">
          <div className="w-12 h-12 bg-resonance-gold/10 rounded-full flex items-center justify-center border border-resonance-gold/30">
            <Moon className="w-6 h-6 text-resonance-gold" />
          </div>
          <h2 className="text-4xl font-display text-resonance-cream">Shadow Integration</h2>
        </div>

        <p className="text-resonance-muted mb-8 leading-relaxed font-body text-lg max-w-2xl relative z-10">
          The parts we avoid hold the gold. Share something you notice in yourself—a pattern,
          reaction, or blind spot. We'll explore it with compassion, not judgment.
        </p>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What pattern keeps showing up? What are you avoiding?"
          className="w-full h-32 bg-resonance-bg border border-resonance-border rounded-xl p-6 text-resonance-cream font-body text-lg focus:border-resonance-gold focus:outline-none transition-all resize-none relative z-10"
        />

        <button
          onClick={exploreShadowWork}
          disabled={isLoading || !prompt.trim()}
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
                <span className="text-resonance-gold">Meeting your shadow with compassion...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Explore with Compassion</span>
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
            {/* Reflection */}
            <div className="bg-resonance-surface/50 p-8 rounded-2xl border border-resonance-border shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <Moon className="w-6 h-6 text-resonance-gold" />
                <h3 className="text-xl font-display text-resonance-cream">Gentle Reflection</h3>
              </div>
              <div className="bg-resonance-bg/40 p-6 rounded-xl border border-resonance-border">
                <p className="text-resonance-cream font-body leading-relaxed">{data.reflection}</p>
              </div>
            </div>

            {/* Origin */}
            <div className="bg-resonance-surface/50 p-8 rounded-2xl border border-resonance-border shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-6 h-6 text-resonance-gold" />
                <h3 className="text-xl font-display text-resonance-cream">Protective Origin</h3>
              </div>
              <div className="bg-resonance-bg/40 p-6 rounded-xl border border-resonance-border">
                <p className="text-resonance-muted font-body leading-relaxed">{data.origin}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Question */}
            <div className="bg-resonance-surface/50 p-8 rounded-2xl border border-resonance-border shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <Heart className="w-6 h-6 text-resonance-gold" />
                <h3 className="text-xl font-display text-resonance-cream">Question to Sit With</h3>
              </div>
              <div className="bg-resonance-bg/40 p-8 rounded-xl border border-resonance-border">
                <p className="text-2xl font-display text-resonance-gold italic leading-relaxed text-center">
                  "{data.explorationQuestion}"
                </p>
              </div>
            </div>

            {/* Reframe */}
            <div className="bg-resonance-surface/50 p-8 rounded-2xl border border-resonance-border shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <Lightbulb className="w-6 h-6 text-resonance-gold" />
                <h3 className="text-xl font-display text-resonance-cream">Compassionate Reframe</h3>
              </div>
              <div className="bg-resonance-bg/40 p-6 rounded-xl border border-resonance-border">
                <p className="text-resonance-cream font-body leading-relaxed">{data.reframe}</p>
              </div>
            </div>
          </div>

          {/* Support Guidance */}
          <div className="bg-resonance-surface/50 p-8 rounded-2xl border border-resonance-border shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
              <UserCheck className="w-6 h-6 text-resonance-gold" />
              <h3 className="text-xl font-display text-resonance-cream">When to Seek Support</h3>
            </div>
            <div className="bg-resonance-bg/40 p-6 rounded-xl border border-resonance-border">
              <p className="text-resonance-muted font-body leading-relaxed">{data.seekSupport}</p>
            </div>
          </div>

          <p className="text-center text-resonance-muted font-body italic text-sm py-4">
            This work is powerful but not a replacement for professional therapy.
          </p>
        </div>
      )}
    </div>
  );
};

export default ShadowIntegration;
