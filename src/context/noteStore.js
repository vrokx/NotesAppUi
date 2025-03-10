import { create } from 'zustand';
import API from '../services/api';
import { toast } from 'sonner';

const useNoteStore = create((set) => ({
  notes: [],
  loading: false,
  error: null,

  fetchNotes: async () => {
    try {
      set({ loading: true });
      const res = await API.get('/Notes');
      set({ notes: res.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error('Failed to fetch notes');
      throw error;
    }
  },

  createNote: async (title, content) => {
    try {
      if (!title?.trim() || !content?.trim()) {
        toast.error('Title and content are required');
        return;
      }

      const newNote = {
        title: title.trim(),
        content: content.trim(),
        isAiGenerated: false,
      };
      
      const res = await API.post('/Notes', newNote);
      set((state) => ({ notes: [...state.notes, res.data] }));
      toast.success('Note created successfully');
      return res.data;
    } catch (error) {
      console.error('Failed to create note:', error);
      toast.error(error.response?.data || 'Failed to create note');
      throw error;
    }
  },

  updateNote: async (id, title, content) => {
    try {
      if (!title?.trim() || !content?.trim()) {
        toast.error('Title and content are required');
        return;
      }

      const updatedNote = {
        id,
        title: title.trim(),
        content: content.trim(),
      };
      
      const res = await API.put(`/Notes/${id}`, updatedNote);
      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id ? { ...note, ...updatedNote } : note
        ),
      }));
      toast.success('Note updated successfully');
      return res.data;
    } catch (error) {
      console.error('Failed to update note:', error);
      toast.error(error.response?.data || 'Failed to update note');
      throw error;
    }
  },

  deleteNote: async (id) => {
    try {
      await API.delete(`/Notes/${id}`);
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
      }));
      toast.success('Note deleted successfully');
    } catch (error) {
      console.error('Failed to delete note:', error);
      toast.error(error.response?.data || 'Failed to delete note');
      throw error;
    }
  },
}));

export default useNoteStore;
