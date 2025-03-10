import React, { useState } from 'react';
import MyInput from '../ui/input';
import MyButton from '../ui/button';
import { handleApiError } from '../../utils/errorHandler';
import { validateNote } from '../../utils/validation';
import { toast } from 'sonner';
import useNoteStore from '../../context/noteStore';

export default function CreateNoteForm({ onSuccess }) {
  const { createNote } = useNoteStore();
  const [note, setNote] = useState({ title: '', content: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setErrors({});
      const { isValid, errors } = validateNote(note.title, note.content);
      if (!isValid) {
        setErrors(errors);
        return;
      }

      setLoading(true);
      await createNote(note.title, note.content);
      toast.success('Note created successfully');
      onSuccess?.();
    } catch (error) {
      handleApiError(error, 'Failed to create note');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <MyInput
          value={note.title}
          onChange={(e) => setNote({ ...note, title: e.target.value })}
          placeholder="Note title"
          error={errors.title}
          disabled={loading}
          className="w-full"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <textarea
          value={note.content}
          onChange={(e) => setNote({ ...note, content: e.target.value })}
          onKeyDown={handleKeyPress}
          className={`w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ocean transition-shadow ${
            errors.content ? 'border-red-500' : 'border-light-gray'
          }`}
          rows={6}
          placeholder="Write your note here..."
          disabled={loading}
        />
        {errors.content && (
          <p className="text-red-500 text-sm">{errors.content}</p>
        )}
      </div>

      <div className="flex justify-between items-center pt-2">
        <MyButton
          onClick={handleSubmit}
          disabled={loading || (!note.title.trim() && !note.content.trim())}
          className="bg-ocean hover:bg-ocean/90 text-white"
        >
          {loading ? 'Creating...' : 'Create Note'}
        </MyButton>
        <p className="text-sm text-light-gray">
          Press Ctrl + Enter to create
        </p>
      </div>
    </div>
  );
} 