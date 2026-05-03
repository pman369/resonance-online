import { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, WifiOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useOfflineStatus } from '../hooks/useOfflineStatus';
import { addToOfflineQueue } from '../utils/offlineSync';

interface Note {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isOnline = useOfflineStatus();

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setNotes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes');
      console.error('Error loading notes:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function addNote() {
    if (!newNote.trim()) return;

    setIsSaving(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('You must be logged in to create notes');
        setIsSaving(false);
        return;
      }

      const noteData = { content: newNote, user_id: user.id };

      if (!isOnline) {
        const optimisticNote: Note = {
          id: crypto.randomUUID(),
          content: newNote,
          created_at: new Date().toISOString(),
          user_id: user.id
        };
        addToOfflineQueue('NOTE', noteData);
        setNotes((prev: Note[]) => [optimisticNote, ...prev]);
        setNewNote('');
        return;
      }

      const { data, error } = await supabase
        .from('notes')
        .insert([noteData])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setNotes((prev: Note[]) => [data, ...prev]);
        setNewNote('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note');
      console.error('Error creating note:', err);
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteNote(id: string) {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNotes((prev: Note[]) => prev.filter((note: Note) => note.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
      console.error('Error deleting note:', err);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <BookOpen className="w-8 h-8 text-resonance-gold" />
        <h2 className="text-3xl font-display text-resonance-cream">Notes</h2>
      </div>

      {!isOnline && (
        <div className="bg-resonance-gold/10 p-4 rounded-xl border border-resonance-gold/20 flex items-center gap-3">
          <WifiOff size={18} className="text-resonance-gold" />
          <p className="text-sm text-resonance-muted">Offline Mode: Notes will be stored locally and synced when you're back online.</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 p-6 rounded-xl border border-red-200">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Add Note Form */}
      <div className="bg-resonance-surface p-6 rounded-xl border border-resonance-border shadow-xl">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="What's on your mind? Capture a reflection..."
          className="w-full h-32 p-4 bg-resonance-bg border-2 border-resonance-border rounded-lg text-resonance-cream focus:border-resonance-gold focus:outline-none resize-none font-body"
        />
        <button
          onClick={addNote}
          disabled={isSaving || !newNote.trim()}
          className="mt-4 flex items-center space-x-2 bg-resonance-gold hover:brightness-110 disabled:bg-resonance-surface disabled:text-resonance-muted text-resonance-bg px-6 py-3 rounded-lg transition-all font-ui font-bold"
        >
          <Plus className="w-5 h-5" />
          <span>{isSaving ? 'Storing...' : 'Store Reflection'}</span>
        </button>
      </div>

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="bg-resonance-surface p-8 rounded-xl border border-resonance-border text-center">
          <BookOpen className="w-12 h-12 text-resonance-muted mx-auto mb-4" />
          <p className="text-resonance-muted">No notes yet. Add your first reflection above.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {notes.map((note) => (
            <div key={note.id} className="bg-resonance-surface p-6 rounded-xl border border-resonance-border relative group">
              <div className="flex justify-between items-start">
                <p className="text-resonance-cream whitespace-pre-wrap flex-1 font-body">{note.content}</p>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="ml-4 text-resonance-muted hover:text-resonance-danger transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-resonance-muted mt-3 font-ui uppercase tracking-widest">
                {new Date(note.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
