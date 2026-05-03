import React, { useState, useCallback } from 'react';
import { Brain, TrendingUp, Zap, Sparkles } from 'lucide-react';
import { mapConsciousness, Analysis } from '../api/client';

interface ConsciousnessMappingProps {
  onAnalysisComplete: (analysis: Analysis, text: string) => void;
}

// Audio utility
const playCompletionSound = async () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const audioContext = new AudioContextClass();
    
    // Resume context if it's suspended (common in many browsers)
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    const now = audioContext.currentTime;
    const notes = [523.25, 659.25, 783.99];

    notes.forEach((freq, i) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.05, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8 + (i * 0.1));
      oscillator.start(now + (i * 0.1));
      oscillator.stop(now + 1 + (i * 0.1));
    });

    // Close the context after sounds finish to free resources
    setTimeout(() => {
      audioContext.close().catch(() => {});
    }, 2000);
  } catch (error) {
    console.warn('Audio feedback skipped:', error);
  }
};

const ConsciousnessMapping: React.FC<ConsciousnessMappingProps> = ({ onAnalysisComplete }) => {
  const [journalText, setJournalText] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFallback, setIsFallback] = useState(false);

  const analyzeConsciousness = useCallback(async () => {
    if (!journalText.trim()) return;

    setIsLoading(true);
    setIsFallback(false);
    try {
      const result = await mapConsciousness(journalText) as Analysis;
      setAnalysis(result);
      onAnalysisComplete(result, journalText);
      playCompletionSound();
    } catch (error) {
      console.warn('Analysis service unavailable, using intuitive fallback:', error);
      
      // Meaningful fallback to maintain UX during outages or rate limits
      const fallbackAnalysis: Analysis = {
        frequency: "Deep Introspection & Threshold Crossing",
        growthEdges: [
          "Integrating recent revelations",
          "Finding stillness amidst the noise",
          "Trusting your inner resonance"
        ],
        flowTriggers: [
          "Radical honesty",
          "Physical movement",
          "Digital silence"
        ],
        patterns: "Your words suggest a period of significant internal alignment. There is a sense of clearing away the old to make room for a more authentic frequency.",
        nextStep: "Take three deep breaths and step away from the screen."
      };
      
      setAnalysis(fallbackAnalysis);
      onAnalysisComplete(fallbackAnalysis, journalText);
      setIsFallback(true);
      playCompletionSound();
    }
    setIsLoading(false);
  }, [journalText, onAnalysisComplete]);

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <div className="bg-resonance-surface p-10 rounded-2xl border border-resonance-border shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-resonance-gold font-display text-[12rem] pointer-events-none select-none">§</div>
        
        <div className="flex items-center space-x-4 mb-8 relative z-10">
          <div className="w-12 h-12 bg-resonance-gold/10 rounded-full flex items-center justify-center border border-resonance-gold/30">
            <Brain className="w-6 h-6 text-resonance-gold" />
          </div>
          <h2 className="text-4xl font-display text-resonance-cream">Consciousness Mapping</h2>
        </div>

        <p className="text-resonance-muted mb-8 leading-relaxed font-body text-lg max-w-2xl relative z-10">
          Share what's alive in you. AI will reflect your unique frequency back to you—
          not to tell you who to be, but to show you who you already are.
        </p>

        <textarea
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          placeholder="No filter needed. No performance required. Just truth..."
          className="w-full h-48 bg-resonance-bg border border-resonance-border rounded-xl p-6 text-resonance-cream font-body text-lg focus:border-resonance-gold focus:outline-none transition-all resize-none relative z-10"
        />

        <button
          onClick={analyzeConsciousness}
          disabled={isLoading || !journalText.trim()}
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
                <span className="text-resonance-gold">Mapping your frequency...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Map My Frequency</span>
              </>
            )}
          </span>
        </button>
      </div>

      {analysis && !analysis.error && (
        <div className="bg-resonance-surface/50 p-10 rounded-2xl border border-resonance-border space-y-10 shadow-2xl animate-in slide-in-from-bottom-4 duration-700">
          {isFallback && (
            <div className="bg-resonance-gold/10 p-4 rounded-xl border border-resonance-gold/20 text-center mb-4">
              <p className="text-xs font-ui uppercase tracking-widest text-resonance-gold">
                ✨ Intuitive Reflection (Fallback Mode)
              </p>
            </div>
          )}
          <div className="border-l-4 border-resonance-gold pl-8">
            <h3 className="text-[10px] font-ui uppercase tracking-[0.3em] text-resonance-gold mb-4">Your Current Frequency</h3>
            <p className="text-3xl font-display text-resonance-cream leading-tight italic">"{analysis.frequency}"</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-resonance-bg/40 p-8 rounded-2xl border border-resonance-border">
              <h3 className="text-sm font-ui uppercase tracking-widest text-resonance-gold mb-6 flex items-center gap-2">
                <TrendingUp size={16} /> Growth Edges
              </h3>
              <ul className="space-y-4">
                {analysis.growthEdges.map((edge, i) => (
                  <li key={i} className="flex items-start space-x-3 text-resonance-muted font-body">
                    <span className="text-resonance-gold mt-1">•</span>
                    <span>{edge}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-resonance-bg/40 p-8 rounded-2xl border border-resonance-border">
              <h3 className="text-sm font-ui uppercase tracking-widest text-resonance-gold mb-6 flex items-center gap-2">
                <Zap size={16} /> Flow Triggers
              </h3>
              <ul className="space-y-4">
                {analysis.flowTriggers.map((trigger, i) => (
                  <li key={i} className="flex items-start space-x-3 text-resonance-muted font-body">
                    <span className="text-resonance-gold mt-1">•</span>
                    <span>{trigger}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <h3 className="text-xs font-ui uppercase tracking-[0.2em] text-resonance-muted">Pattern Observed</h3>
              <p className="text-resonance-cream font-body text-lg leading-relaxed">{analysis.patterns}</p>
            </div>

            <div className="bg-resonance-gold/5 p-8 rounded-2xl border border-resonance-gold/20 shadow-inner text-center">
              <h3 className="text-xs font-ui uppercase tracking-[0.2em] text-resonance-gold mb-4">Your Next Step</h3>
              <p className="text-2xl font-display text-resonance-cream leading-tight italic">"{analysis.nextStep}"</p>
            </div>
          </div>
        </div>
      )}

      {analysis?.error && (
        <div className="bg-resonance-danger/10 p-8 rounded-2xl border border-resonance-danger/30 text-center animate-in shake-1 duration-500">
          <p className="text-resonance-cream font-ui">{analysis.error}</p>
        </div>
      )}
    </div>
  );
};

export default ConsciousnessMapping;
