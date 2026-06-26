import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeIntent } from '../utils/aiProxy';
import { audioEngine } from '../utils/audioEngine';
import { Compass, Sparkles, Send } from 'lucide-react';

interface PortalNavigationProps {
  onNavigate: (route: string, intensity: 'neutral' | 'high-resistance' | 'reflective' | 'low-intensity') => void;
  activeIntensity: 'neutral' | 'high-resistance' | 'reflective' | 'low-intensity';
  setIntensity: (intensity: 'neutral' | 'high-resistance' | 'reflective' | 'low-intensity') => void;
}

const PortalNavigation: React.FC<PortalNavigationProps> = ({ 
  onNavigate, 
  activeIntensity,
  setIntensity
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [reframeMessage, setReframeMessage] = useState<string | null>(null);

  // Gradient progress colors based on intensity
  const getGradientBorder = () => {
    switch (activeIntensity) {
      case 'high-resistance':
        return 'from-[#AA00FF] via-[#D500F9] to-[#FF4081]'; // Violet -> Magenta -> Hot Pink
      case 'reflective':
        return 'from-[#2962FF] via-[#6200EA] to-[#AA00FF]'; // Cobalt -> Deep Purple -> Violet
      case 'low-intensity':
        return 'from-[#00E5FF] to-[#2962FF]'; // Cyan -> Cobalt
      default:
        return 'from-[#00E5FF] via-[#6200EA] to-[#D500F9]'; // Cyan -> Deep Purple -> Magenta
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;

    setIsProcessing(true);
    const result = analyzeIntent(inputValue);
    
    // Set matching intensity for Metatron's Cube and Audio Engine
    setIntensity(result.intensity);
    audioEngine.setHumIntensity(result.intensity);
    
    // Play the sensory sync C-E-G chime
    audioEngine.playTransitionChime();
    
    // Display the psychological reframe bubble
    setReframeMessage(result.reframe);

    // Stagger transition for visual/audio sync
    setTimeout(() => {
      onNavigate(result.route, result.intensity);
      setIsProcessing(false);
      setInputValue('');
      setReframeMessage(null);
      // Reset intensity to neutral after transition
      setTimeout(() => {
        setIntensity('neutral');
        audioEngine.setHumIntensity('neutral');
      }, 1000);
    }, 2200);
  };

  const suggestions = [
    { text: "I want to explore my shadow", input: "explore shadow" },
    { text: "Seek ancient teachings", input: "ancient wisdom" },
    { text: "Breathe and go offline", input: "presence protocol" },
    { text: "Map my current energy", input: "frequency map" },
    { text: "Sync with the collective", input: "coherence field" }
  ];

  return (
    <div className="relative w-full max-w-2xl mx-auto z-10 flex flex-col items-center justify-center p-4">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Compass className="text-[#00E5FF] w-6 h-6 animate-pulse" />
          <h2 className="text-sm font-ui uppercase tracking-[0.3em] text-[#EDE8DF]/70">The Singular Portal</h2>
        </div>
        <p className="font-display text-4xl text-[#EDE8DF] tracking-wide max-w-md mx-auto leading-relaxed">
          Where does your consciousness wish to align?
        </p>
      </motion.div>

      {/* Query input container */}
      <div className="w-full relative">
        <form onSubmit={handleSearchSubmit} className="relative z-10 w-full">
          <div className={`p-[1.5px] rounded-2xl bg-gradient-to-r ${getGradientBorder()} transition-all duration-1000 shadow-[0_0_30px_rgba(0,229,255,0.15)] focus-within:shadow-[0_0_40px_rgba(213,0,249,0.3)]`}>
            <div className="bg-[#05050a]/90 backdrop-blur-md rounded-2xl flex items-center px-4 py-3.5">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter journal entry, sensation, or query..."
                disabled={isProcessing}
                className="w-full bg-transparent text-[#EDE8DF] placeholder-[#EDE8DF]/30 focus:outline-none font-body text-lg disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isProcessing || !inputValue.trim()}
                className="text-[#00E5FF] hover:text-[#D500F9] disabled:text-[#EDE8DF]/20 transition-colors p-1"
                aria-label="Submit query to AI Proxy"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>

        {/* Ambient glow behind query input */}
        <div className="absolute inset-0 bg-[#6200EA]/10 rounded-2xl filter blur-xl -z-10" />
      </div>

      {/* Wave Motif & Star Alignment */}
      <div className="w-full py-8 flex items-center justify-center gap-4 relative overflow-hidden">
        {/* Left Cyan Star */}
        <motion.div
          animate={{ 
            opacity: [0.4, 1, 0.4],
            scale: [0.8, 1.2, 0.8] 
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-[#00E5FF]"
          aria-hidden="true"
        >
          <Sparkles className="w-4 h-4" />
        </motion.div>

        {/* SVG Waves */}
        <svg viewBox="0 0 200 20" className="w-64 h-8 opacity-60">
          <defs>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="50%" stopColor="#6200EA" />
              <stop offset="100%" stopColor="#D500F9" />
            </linearGradient>
          </defs>
          {/* 3 Parallel Wave Paths */}
          {[0, 4, 8].map((offset, i) => (
            <motion.path
              key={i}
              d={`M 0 10 Q 50 ${6 + offset} 100 10 T 200 10`}
              fill="none"
              stroke="url(#waveGrad)"
              strokeWidth="0.8"
              opacity={1 - i * 0.25}
              animate={{
                d: isProcessing 
                  ? [
                      `M 0 10 Q 50 ${3 + offset} 100 10 T 200 10`,
                      `M 0 10 Q 50 ${17 - offset} 100 10 T 200 10`,
                      `M 0 10 Q 50 ${3 + offset} 100 10 T 200 10`
                    ]
                  : [
                      `M 0 10 Q 50 ${7 + offset} 100 10 T 200 10`,
                      `M 0 10 Q 50 ${13 - offset} 100 10 T 200 10`,
                      `M 0 10 Q 50 ${7 + offset} 100 10 T 200 10`
                    ]
              }}
              transition={{
                duration: isProcessing ? 1 : 3 - i * 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </svg>

        {/* Right 3 Magenta Stars */}
        <div className="flex gap-1">
          {[0, 1, 2].map((idx) => (
            <motion.div
              key={idx}
              animate={{ 
                opacity: [0.3, 1, 0.3],
                scale: [0.7, 1.1, 0.7] 
              }}
              transition={{ 
                duration: 1.8 + idx * 0.3, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: idx * 0.2
              }}
              className="text-[#D500F9]"
              aria-hidden="true"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Psychological Reframe Message Popover */}
      <AnimatePresence>
        {reframeMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="w-full bg-resonance-surface border border-resonance-border p-5 rounded-2xl text-center shadow-[0_15px_40px_rgba(0,0,0,0.5)] border-l-4 border-l-[#D500F9] mb-8"
          >
            <p className="font-body text-[#EDE8DF]/90 italic leading-relaxed text-base">
              "{reframeMessage}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestions List (only visible when not processing) */}
      {!isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          className="w-full flex flex-col items-center mt-2"
        >
          <span className="text-[10px] font-ui uppercase tracking-[0.2em] text-[#EDE8DF]/40 mb-3">Suggested Alignments</span>
          <div className="flex flex-wrap justify-center gap-2 max-w-md">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => setInputValue(sug.input)}
                className="bg-resonance-surface hover:bg-resonance-border border border-resonance-border hover:border-resonance-gold/30 px-3.5 py-1.5 rounded-full text-xs font-ui text-[#EDE8DF]/70 hover:text-[#EDE8DF] transition-all"
              >
                {sug.text}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PortalNavigation;
