import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BookOpen, Plus, Trash2 } from 'lucide-react';

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

      const { data, error } = await supabase
        .from('notes')
        .insert([{ content: newNote, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setNotes(prev => [data, ...prev]);
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

      setNotes(prev => prev.filter(note => note.id !== id));
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
        <BookOpen className="w-8 h-8 text-indigo-600" />
        <h2 className="text-3xl font-bold">Notes</h2>
      </div>

      {error && (
        <div className="bg-red-50 p-6 rounded-xl border border-red-200">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Add Note Form */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="What's on your mind? Capture a reflection..."
          className="w-full h-32 p-4 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none resize-none"
        />
        <button
          onClick={addNote}
          disabled={isSaving || !newNote.trim()}
          className="mt-4 flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>{isSaving ? 'Storing...' : 'Store Reflection'}</span>
        </button>
      </div>

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No notes yet. Add your first reflection above.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {notes.map((note) => (
            <div key={note.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 relative group">
              <div className="flex justify-between items-start">
                <p className="text-gray-700 whitespace-pre-wrap flex-1">{note.content}</p>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="ml-4 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-3">
                {new Date(note.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
