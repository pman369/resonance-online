import React, { useEffect, useState } from 'react';
import { Users, Plus, Shield, ArrowRight, Zap } from 'lucide-react';
import { Circle, fetchCircles, joinCircle } from '../../../api/communityClient';
import { useAuth } from '../../../lib/AuthContext';

export const CircleList: React.FC = () => {
  const { user } = useAuth();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCircles();
  }, []);

  async function loadCircles() {
    setIsLoading(true);
    try {
      const data = await fetchCircles();
      setCircles(data as any);
    } catch (err) {
      console.error('Error fetching circles:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleJoin = async (id: string) => {
    if (!user) return;
    try {
      await joinCircle(id);
      loadCircles(); // Refresh to show membership or updated counts
    } catch (err) {
      console.error('Error joining circle:', err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-display text-resonance-cream mb-1">Explore Circles</h3>
          <p className="text-xs font-ui text-resonance-muted uppercase tracking-widest">Find your resonant frequency</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2 border border-resonance-gold/30 text-resonance-gold rounded-full font-ui text-[10px] uppercase tracking-[0.2em] hover:bg-resonance-gold/10 transition-all">
          <Plus size={14} /> Create Circle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-resonance-surface border border-resonance-border rounded-2xl animate-pulse" />
          ))
        ) : circles.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-resonance-surface/20 rounded-3xl border border-resonance-border border-dashed">
            <Users className="w-12 h-12 text-resonance-muted mx-auto mb-4 opacity-30" />
            <p className="text-resonance-muted font-display text-lg">No circles have formed in this sector yet.</p>
            <p className="text-[10px] font-ui text-resonance-gold/60 uppercase tracking-widest mt-2">Be the first to create one</p>
          </div>
        ) : (
          circles.map(circle => (
            <div key={circle.id} className="bg-resonance-surface p-6 rounded-2xl border border-resonance-border hover:border-resonance-gold/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Zap size={40} className="text-resonance-gold" />
              </div>

              <div className="flex justify-between items-start mb-4">
                <h4 className="font-display text-lg text-resonance-cream group-hover:text-resonance-gold transition-colors">{circle.name}</h4>
                {circle.is_private && <Shield size={14} className="text-resonance-muted" />}
              </div>

              <p className="text-sm font-ui text-resonance-muted leading-relaxed mb-6 line-clamp-2">
                {circle.description || "A space for shared exploration and collective resonance."}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-resonance-border/50">
                <div className="flex flex-col">
                  <span className="text-[10px] font-ui uppercase tracking-widest text-resonance-muted">Coherence</span>
                  <span className="text-sm font-bold text-resonance-gold">{circle.coherence_score}</span>
                </div>
                <button 
                  onClick={() => handleJoin(circle.id)}
                  className="flex items-center gap-2 text-xs font-ui text-resonance-cream hover:text-resonance-gold transition-colors"
                >
                  Join Circle <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
