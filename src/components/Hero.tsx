import React from 'react';
import { ArrowRight } from 'lucide-react';


const Hero: React.FC = () => (
  <section className="relative min-h-screen flex flex-col items-center justify-center text-center bg-resonance-bg overflow-hidden">
    {/* Ambient gradient overlay */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,229,255,0.12),transparent_70%)] animate-float" />
    </div>
    {/* Top navigation is rendered separately */}
    <h1 className="text-6xl md:text-8xl font-display text-resonance-cream mb-6 animate-fade-in-up">
      Some things don't have an audience.<br />Until now.
    </h1>
    <p className="text-xl font-body italic text-resonance-muted mb-8 animate-fade-in-up animation-delay-200">
      Resonance is where the quiet, the honest, and the deeply felt find form. Journal. Share. Listen. Belong.
    </p>
    <div className="flex gap-4 animate-fade-in-up animation-delay-400">
      <a href="#signup" className="px-8 py-3 bg-resonance-gold text-resonance-bg rounded-full font-ui font-bold hover:brightness-110 transition">
        Begin Your Journey
      </a>
      <a href="#manifesto" className="px-8 py-3 border border-resonance-cream text-resonance-cream rounded-full font-ui hover:bg-resonance-cream/10 transition flex items-center">
        Learn What This Is <ArrowRight className="ml-2 w-4 h-4" />
      </a>
    </div>
    {/* Scroll indicator */}
    <div className="absolute bottom-8 flex flex-col items-center animate-bounce">
      <div className="w-1 h-8 bg-resonance-cream opacity-60 rounded-full" />
      <span className="text-xs text-resonance-muted mt-2">scroll</span>
    </div>
  </section>
);

export default Hero;
