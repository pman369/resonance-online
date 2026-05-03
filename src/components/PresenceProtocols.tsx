import React, { useState, useCallback } from 'react';
import { Heart, Clock, Sun, Moon, Pause, Sparkles, WifiOff } from 'lucide-react';
import { generateIntention, IntentionData } from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import { useOfflineStatus } from '../hooks/useOfflineStatus';

const PresenceProtocols: React.FC = () => {
  const [intention, setIntention] = useState<IntentionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const isOnline = useOfflineStatus();

  const generateDailyIntention = useCallback(async () => {
    if (!isOnline) {
      setError('You are currently offline. Intentions require a connection to the collective field.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await generateIntention();
      setIntention(result);
    } catch (err) {
      setError('Could not generate intention. The field is currently turbulent. Please try again.');
      console.error('Intention error:', err);
    }
    setIsLoading(false);
  }, [isOnline]);

  // Session timer
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionActive) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startSession = () => {
    setSessionActive(true);
    setSessionTime(0);
  };

  const endSession = () => {
    setSessionActive(false);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-24">
      {/* Header & Generator */}
      <div className="bg-resonance-surface p-10 rounded-[32px] border border-resonance-border shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-resonance-gold font-display text-[12rem] pointer-events-none select-none">§</div>
        
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-resonance-gold/10 rounded-full flex items-center justify-center border border-resonance-gold/30">
            <Heart className="w-6 h-6 text-resonance-gold" />
          </div>
          <h2 className="text-4xl font-display text-resonance-cream">Presence Protocols</h2>
        </div>

        <p className="text-resonance-muted mb-10 leading-relaxed font-body text-lg max-w-2xl">
          True consciousness often begins when we step away. Generate a daily intention to guide your physical existence, then go live it. This is where the real work happens.
        </p>

        <button
          onClick={generateDailyIntention}
          disabled={isLoading || !isOnline}
          className={`relative overflow-hidden transition-all group px-10 py-5 rounded-full font-ui font-bold tracking-widest uppercase text-xs shadow-xl ${
            isLoading
              ? 'bg-resonance-surface border border-resonance-gold/50 cursor-wait'
              : 'bg-resonance-gold text-resonance-bg hover:brightness-110 active:scale-[0.98] disabled:opacity-50'
          }`}
        >
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          )}
          <span className="flex items-center justify-center gap-3">
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-resonance-bg border-t-transparent rounded-full animate-spin" />
                <span>Distilling Intent...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>{intention ? 'Renew Intention' : 'Initialize Daily Intention'}</span>
              </>
            )}
          </span>
        </button>

        {!isOnline && (
          <div className="mt-6 flex items-center gap-2 text-resonance-danger text-xs font-ui uppercase tracking-wider">
            <WifiOff size={14} />
            <span>Connection Required</span>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-resonance-danger/10 p-6 rounded-2xl border border-resonance-danger/30 text-center"
          >
            <p className="text-resonance-cream font-ui text-sm uppercase tracking-widest">{error}</p>
          </motion.div>
        )}

        {intention && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Core Intention */}
            <div className="bg-resonance-surface/50 p-12 rounded-[40px] border border-resonance-gold/20 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,169,110,0.05)_0%,transparent_70%)]"></div>
              <div className="flex flex-col items-center text-center relative z-10">
                <Heart className="w-8 h-8 text-resonance-gold mb-6 opacity-50" />
                <h3 className="text-[10px] font-ui uppercase tracking-[0.4em] text-resonance-gold mb-6">Today's Sacred Aim</h3>
                <p className="text-3xl md:text-4xl font-display text-resonance-cream leading-tight italic max-w-2xl">
                  "{intention.intention}"
                </p>
              </div>
            </div>

            {/* Time-based Practices */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { time: 'Morning', icon: Sun, content: intention.morning, color: 'text-resonance-gold' },
                { time: 'Midday', icon: Clock, content: intention.midday, color: 'text-resonance-gold' },
                { time: 'Evening', icon: Moon, content: intention.evening, color: 'text-resonance-gold' }
              ].map((step, i) => (
                <div key={i} className="bg-resonance-surface/40 p-8 rounded-3xl border border-resonance-border group hover:border-resonance-gold/30 transition-all">
                  <div className="flex items-center space-x-3 mb-6">
                    <step.icon className={`w-5 h-5 ${step.color}`} />
                    <h3 className="text-xs font-ui uppercase tracking-widest text-resonance-muted">{step.time} Practice</h3>
                  </div>
                  <p className="text-resonance-cream leading-relaxed font-body italic text-sm">{step.content}</p>
                </div>
              ))}
            </div>

            {/* Digital Sabbath Timer */}
            <div className="bg-resonance-surface p-10 rounded-[40px] border border-resonance-border shadow-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-resonance-gold/10 rounded-full flex items-center justify-center">
                    <Pause className="w-6 h-6 text-resonance-gold" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display text-resonance-cream">Digital Sabbath</h3>
                    <p className="text-xs font-ui uppercase tracking-widest text-resonance-muted">Live Presence Tracking</p>
                  </div>
                </div>
                <div className="text-5xl font-display text-resonance-gold tracking-tighter">
                  {formatTime(sessionTime)}
                </div>
              </div>
              
              <p className="text-resonance-muted mb-10 leading-relaxed font-body text-center max-w-xl mx-auto">
                Close this app. Put your phone away. Embark upon your intention in the physical world. We honor this time differently—less is more. Track your presence away from screens.
              </p>

              <button
                onClick={sessionActive ? endSession : startSession}
                className={`w-full py-5 rounded-2xl font-ui font-bold uppercase tracking-widest text-xs transition-all ${
                  sessionActive 
                    ? 'bg-transparent border border-resonance-gold text-resonance-gold hover:bg-resonance-gold/10' 
                    : 'bg-resonance-cream text-resonance-bg hover:brightness-110 shadow-lg'
                }`}
              >
                {sessionActive ? `Return to Resonance (${formatTime(sessionTime)})` : 'Close App & Go Live'}
              </button>

              <AnimatePresence>
                {sessionActive && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-resonance-gold mt-6 text-[10px] font-ui uppercase tracking-[0.2em] animate-pulse"
                  >
                    You are currently present in the world.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PresenceProtocols;
