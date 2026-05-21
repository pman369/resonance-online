import React, { useEffect, useState } from 'react';
import { Users, Plus, Shield, ArrowRight, Zap, X } from 'lucide-react';
import { Circle, fetchCircles, joinCircle, createCircle } from '../../../api/communityClient';
import { useAuth } from '../../../lib/AuthContext';

export const CircleList: React.FC = () => {
  const { user } = useAuth();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

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
      loadCircles();
    } catch (err) {
      console.error('Error joining circle:', err);
    }
  };

  const handleCreateCircle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createCircle(name.trim(), description.trim(), isPrivate);
      setShowCreateModal(false);
      setName('');
      setDescription('');
      setIsPrivate(false);
      loadCircles();
    } catch (err) {
      console.error('Error creating circle:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-display text-resonance-cream mb-1">Explore Circles</h3>
          <p className="text-xs font-ui text-resonance-muted uppercase tracking-widest">Find your resonant frequency</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-2 border border-resonance-gold/30 text-resonance-gold rounded-full font-ui text-[10px] uppercase tracking-[0.2em] hover:bg-resonance-gold/10 transition-all"
        >
          <Plus size={14} /> Create Circle
        </button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-resonance-bg/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-resonance-surface w-full max-w-md rounded-2xl border border-resonance-border p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-display text-resonance-cream">Initiate Sector</h4>
              <button onClick={() => setShowCreateModal(false)} className="text-resonance-muted hover:text-resonance-gold transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCircle} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-ui uppercase tracking-widest text-resonance-gold">Circle Name</label>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., The Shadow Workers"
                  className="w-full bg-resonance-bg border border-resonance-border rounded-xl px-4 py-3 text-resonance-cream font-ui focus:border-resonance-gold focus:outline-none transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-ui uppercase tracking-widest text-resonance-gold">Focus / Theme</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What wavelength does this circle broadcast on?"
                  className="w-full bg-resonance-bg border border-resonance-border rounded-xl px-4 py-3 text-resonance-cream font-ui focus:border-resonance-gold focus:outline-none transition-colors min-h-[100px]"
                />
              </div>

              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={() => setIsPrivate(!isPrivate)}
                  className={`w-10 h-6 rounded-full transition-colors relative ${isPrivate ? 'bg-resonance-gold' : 'bg-resonance-border'}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-resonance-bg rounded-full transition-transform ${isPrivate ? 'translate-x-4' : ''}`} />
                </button>
                <span className="text-xs font-ui text-resonance-muted">Private Sector (Invitation Only)</span>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting || !name.trim()}
                className="w-full bg-resonance-gold text-resonance-bg py-3 rounded-xl font-ui font-bold uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Manifesting...' : 'Establish Circle'}
              </button>
            </form>
          </div>
        </div>
      )}

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
