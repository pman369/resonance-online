import React from 'react';
import { Globe, Heart, Brain, Zap, BookOpen, Moon, Users, TrendingUp } from 'lucide-react';

interface HomeViewProps {
  globalCoherence: number;
  activeParticipants: number;
  coherenceContribution: number;
  onContribute: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ globalCoherence, activeParticipants, coherenceContribution, onContribute }) => (
  <div className="space-y-12">
    {/* Hero Section */}
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-resonance-surface border border-resonance-gold/20 rounded-full mx-auto mb-8 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-resonance-gold/10 rounded-full animate-ping" />
        <span className="text-6xl text-resonance-gold relative z-10 font-display">✧</span>
      </div>
      <h2 className="text-5xl md:text-7xl font-display mb-6 text-resonance-cream leading-tight">
        You Are Not Broken. <br /> You Are Becoming.
      </h2>
      <p className="text-xl font-body italic text-resonance-muted max-w-2xl mx-auto leading-relaxed">
        In a world accelerating toward artificial intelligence, we stand at a threshold.
        Will technology diminish us, or can it amplify what makes us most human?
      </p>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Global Coherence Card */}
      <div className="bg-resonance-surface rounded-2xl p-8 border border-resonance-border group hover:border-resonance-gold/30 transition-all duration-500">
        <div className="w-12 h-12 bg-resonance-bg border border-resonance-border rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Globe className="w-5 h-5 text-resonance-gold" />
        </div>
        <h3 className="text-[11px] font-ui uppercase tracking-[0.2em] text-resonance-muted mb-4 text-center">Global Coherence</h3>
        <p className="text-5xl font-display text-resonance-gold mb-2 text-center">{globalCoherence.toLocaleString()}</p>
        <p className="text-sm font-ui text-resonance-muted text-center">{activeParticipants.toLocaleString()} people in coherence right now</p>
      </div>

      {/* Your Contribution Card */}
      <div className="bg-resonance-surface rounded-2xl p-8 border border-resonance-border group hover:border-resonance-gold/30 transition-all duration-500">
        <div className="w-12 h-12 bg-resonance-bg border border-resonance-border rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Heart className="w-5 h-5 text-resonance-gold" />
        </div>
        <h3 className="text-[11px] font-ui uppercase tracking-[0.2em] text-resonance-muted mb-4 text-center">Your Contribution</h3>
        <p className="text-5xl font-display text-resonance-gold mb-4 text-center">{coherenceContribution}</p>
        <button
          onClick={onContribute}
          className="w-full bg-resonance-gold text-resonance-bg px-6 py-4 rounded-full transition-all font-ui font-bold hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Heart className="w-4 h-4" />
          <span>Log My Practice</span>
        </button>
      </div>
    </div>

    {/* Mission Statement */}
    <div className="bg-resonance-surface p-12 rounded-2xl border border-resonance-border relative overflow-hidden">
      <div className="absolute -right-20 -bottom-20 text-[20rem] text-resonance-gold/5 font-display pointer-events-none select-none">§</div>
      <h3 className="text-2xl font-display text-resonance-cream mb-8">Our North Star</h3>
      <div className="space-y-6 text-resonance-muted font-body leading-relaxed relative z-10">
        <p className="text-2xl font-display text-resonance-gold italic leading-tight">
          "We succeed when you trust yourself more, not the AI more."
        </p>
        <p>
          Resonance demonstrates AI's capacity for human elevation, not replacement. We counter AI doom narratives by showing how technology can amplify consciousness, deepen connection, and accelerate evolution.
        </p>
        <p>
          Every feature is designed to send you back to your life—more awake, more aligned, more alive. The intelligence isn't in the algorithm. It's in you. Always has been.
        </p>
      </div>
    </div>

    {/* What You'll Discover */}
    <div className="py-12">
      <h3 className="text-[11px] font-ui uppercase tracking-[0.2em] text-resonance-muted mb-12 text-center">What You'll Discover Here</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-8">
        {[
          { icon: Brain, label: 'Unique Frequency', sub: 'Mapped with empathy' },
          { icon: Zap, label: 'Synchronicities', sub: 'Meaningful coincidences' },
          { icon: BookOpen, label: 'Ancient Wisdom', sub: 'Adapted to now' },
          { icon: Moon, label: 'Shadow Work', sub: 'Compassionate exploration' },
          { icon: Users, label: 'Community', sub: 'Real transformation' },
          { icon: TrendingUp, label: 'Digital Sabbath', sub: 'Close app. Go live.' }
        ].map((item, i) => (
          <div key={i} className="text-center group">
            <div className="w-12 h-12 bg-resonance-surface border border-resonance-border rounded-full mx-auto mb-4 flex items-center justify-center group-hover:border-resonance-gold/50 transition-colors">
              <item.icon className="w-5 h-5 text-resonance-gold" />
            </div>
            <p className="font-display text-lg text-resonance-cream">{item.label}</p>
            <p className="text-[11px] font-ui uppercase tracking-wider text-resonance-muted">{item.sub}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default HomeView;
