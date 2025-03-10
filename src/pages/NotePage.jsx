import React, { useEffect } from 'react';
import useNoteStore from '../context/noteStore';
import { Button, Input } from '@/components/ui/input';

export default function NotesPage() {
  const { notes, fetchNotes, addNote } = useNoteStore();

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div>
      <h2>My Notes</h2>
      <Input placeholder="Add a note..." />
      <Button onClick={() => addNote({ content: 'New Note' })}>Add</Button>

      {notes.map((note) => (
        <div key={note.id}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
        </div>
      ))}
    </div>
  );
}
