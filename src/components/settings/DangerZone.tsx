import { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';
import { AlertTriangle, Download, Trash2, X } from 'lucide-react';

export default function DangerZone() {
  const { user, signOut } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportUserData = async () => {
    if (!user) return;
    setIsExporting(true);
    setError(null);
    try {
      const [reflections, stories] = await Promise.all([
        supabase.from('ai_reflections').select('*').eq('user_id', user.id),
        supabase.from('stories').select('*').eq('user_id', user.id),
      ]);

      const payload = {
        exported_at: new Date().toISOString(),
        user_id: user.id,
        email: user.email,
        reflections: reflections.data || [],
        stories: stories.data || [],
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resonance-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE' || !user) return;
    setIsDeleting(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase.functions.invoke('delete-account');
      
      if (deleteError) throw deleteError;
      
      // Sign out locally
      await signOut();
      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-resonance-danger/5 p-8 rounded-2xl border border-resonance-danger/30 space-y-8 shadow-2xl shadow-resonance-danger/5">
        <div className="flex items-center gap-4 pb-6 border-b border-resonance-danger/20">
          <div className="w-10 h-10 bg-resonance-danger/10 rounded-full flex items-center justify-center border border-resonance-danger/30">
            <AlertTriangle className="w-5 h-5 text-resonance-danger" />
          </div>
          <div>
            <h2 className="text-xl font-display text-resonance-cream">Danger Zone</h2>
            <p className="text-[10px] font-ui uppercase tracking-widest text-resonance-muted mt-0.5">Irreversible actions regarding your presence.</p>
          </div>
        </div>

        {/* Export */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-resonance-bg/30 rounded-xl border border-resonance-border transition-all hover:border-resonance-gold/20">
          <div>
            <p className="font-ui text-sm font-semibold text-resonance-cream">Export Your Data</p>
            <p className="font-ui text-xs text-resonance-muted mt-1 leading-relaxed max-w-md">
              Download a JSON file containing all your reflections, stories, and intentions. 
              We recommend doing this before any account changes.
            </p>
          </div>
          <button
            onClick={exportUserData}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-resonance-border text-resonance-cream rounded-full font-ui text-[10px] uppercase tracking-[0.2em] hover:border-resonance-gold/50 transition-all whitespace-nowrap active:scale-95 disabled:opacity-50"
          >
            {isExporting ? 'Exporting...' : <><Download size={14} /> Export Data</>}
          </button>
        </div>

        {/* Delete */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-resonance-bg/30 rounded-xl border border-resonance-danger/20 transition-all hover:bg-resonance-danger/[0.02] hover:border-resonance-danger/40">
          <div>
            <p className="font-ui text-sm font-semibold text-resonance-danger">Delete Account</p>
            <p className="font-ui text-xs text-resonance-muted mt-1 leading-relaxed max-w-md">
              Permanently delete your account and all associated data. This action is absolute and cannot be undone.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-resonance-danger/10 border border-resonance-danger/30 text-resonance-danger rounded-full font-ui text-[10px] uppercase tracking-[0.2em] hover:bg-resonance-danger hover:text-resonance-cream transition-all whitespace-nowrap active:scale-95"
          >
            <Trash2 size={14} /> Delete Forever
          </button>
        </div>

        {error && (
          <p className="text-xs font-ui text-resonance-danger text-center animate-pulse">{error}</p>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          className="fixed inset-0 bg-resonance-bg/90 backdrop-blur-md z-[100] flex items-center justify-center p-6"
        >
          <div className="bg-resonance-surface border border-resonance-danger/30 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(139,58,58,0.2)] animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-6">
              <h3 id="delete-modal-title" className="font-display text-2xl text-resonance-cream">
                Final Threshold
              </h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-resonance-muted hover:text-resonance-cream transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <p className="font-body text-resonance-muted mb-6 leading-relaxed">
              You are about to dissolve your presence on this platform. This will permanently delete your account, all reflections, and stories.
              <span className="block mt-4 text-resonance-danger font-bold uppercase tracking-widest text-[10px]">This cannot be reversed.</span>
            </p>
            
            <div className="space-y-4">
              <label htmlFor="confirm-delete" className="block font-ui text-[10px] uppercase tracking-widest text-resonance-muted">
                Type <span className="text-resonance-cream font-bold">DELETE</span> to confirm:
              </label>
              <input
                id="confirm-delete"
                type="text"
                value={confirmText}
                onChange={e => setConfirmText(e.target.value)}
                autoFocus
                className="w-full bg-resonance-bg border border-resonance-border rounded-xl px-4 py-4 font-ui text-sm text-resonance-cream focus:border-resonance-danger focus:outline-none transition-colors"
                placeholder="DELETE"
              />
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => { setShowDeleteModal(false); setConfirmText(''); }}
                className="flex-1 py-4 border border-resonance-border text-resonance-muted rounded-full font-ui text-[10px] uppercase tracking-[0.2em] hover:text-resonance-cream hover:border-resonance-gold/30 transition-all"
              >
                Return
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={confirmText !== 'DELETE' || isDeleting}
                className="flex-1 py-4 bg-resonance-danger text-resonance-cream rounded-full font-ui text-[10px] uppercase tracking-[0.2em] font-bold disabled:opacity-40 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-resonance-danger/20"
              >
                {isDeleting ? 'Dissolving...' : 'Dissolve Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
