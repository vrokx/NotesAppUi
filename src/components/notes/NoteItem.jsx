import React, { useState, useEffect } from 'react';
import useNoteStore from '../../context/noteStore';
import MyButton from '../ui/button';
import MyInput from '../ui/input';
import Modal from '../ui/modal';
import { handleApiError } from '../../utils/errorHandler';
import { validateNote } from '../../utils/validation';
import { toast } from 'sonner';
import { Bot, Edit2, Trash2, Check, X, Maximize2 } from 'lucide-react';

export default function NoteItem({ note }) {
  const { updateNote, deleteNote } = useNoteStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editedNote, setEditedNote] = useState({
    title: note.title,
    content: note.content,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [taskStates, setTaskStates] = useState(() => {
    // Initialize from localStorage or default to empty object
    const saved = localStorage.getItem(`note-${note.id}-tasks`);
    return saved ? JSON.parse(saved) : {};
  });

  // Save task states to localStorage whenever they change
  useEffect(() => {
    if (note.isAiGenerated) {
      localStorage.setItem(`note-${note.id}-tasks`, JSON.stringify(taskStates));
    }
  }, [taskStates, note.id]);

  const handleUpdate = async () => {
    try {
      setErrors({});
      const { isValid, errors } = validateNote(editedNote.title, editedNote.content);
      if (!isValid) {
        setErrors(errors);
        return;
      }

      setLoading(true);
      await updateNote(note.id, editedNote.title, editedNote.content);
      setIsEditing(false);
      toast.success('Note updated successfully');
    } catch (error) {
      handleApiError(error, 'Failed to update note');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteNote(note.id);
      // Clean up localStorage when note is deleted
      localStorage.removeItem(`note-${note.id}-tasks`);
      toast.success('Note deleted successfully');
    } catch (error) {
      handleApiError(error, 'Failed to delete note');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskToggle = (index) => {
    setTaskStates(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const renderContent = (isPreview = true) => {
    if (note.isAiGenerated) {
      const tasks = note.content.split('\n').filter(task => task.trim());
      const completedTasks = Object.values(taskStates).filter(Boolean).length;
      const progress = (completedTasks / tasks.length) * 100;

  return (
        <div className="space-y-4">
          <div className={`space-y-2 ${isPreview ? "max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-light-gray/50 hover:scrollbar-thumb-light-gray scrollbar-track-transparent pr-2" : ""}`}>
            {tasks.map((task, index) => (
              <div 
                key={index} 
                className="flex items-start gap-2 group hover:bg-background dark:hover:bg-navy rounded-lg p-2 -mx-2 transition-colors"
              >
                <button
                  onClick={() => handleTaskToggle(index)}
                  className={`mt-0.5 w-4 h-4 rounded border transition-colors flex items-center justify-center flex-shrink-0 ${
                    taskStates[index]
                      ? 'bg-lime border-lime text-white'
                      : 'border-light-gray hover:border-lime'
                  }`}
                >
                  {taskStates[index] && <Check className="w-3 h-3" />}
                </button>
                <span className={`text-sm ${
                  taskStates[index] ? 'line-through text-light-gray' : 'text-navy dark:text-background'
                }`}>
                  {task.replace(/^\d+\.\s*/, '')}
                </span>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <div className="h-1.5 bg-light-gray dark:bg-background/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-lime transition-all duration-500" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-light-gray dark:text-background/60">
              {completedTasks} of {tasks.length} tasks completed
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className={isPreview ? "max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-light-gray/50 hover:scrollbar-thumb-light-gray scrollbar-track-transparent pr-2" : ""}>
        <p className="text-sm text-navy dark:text-background whitespace-pre-wrap break-words">{note.content}</p>
      </div>
    );
  };

  const renderEditForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <MyInput
          value={editedNote.title}
          onChange={(e) => setEditedNote({ ...editedNote, title: e.target.value })}
          placeholder="Title"
          error={errors.title}
          className="dark:bg-navy dark:text-background dark:border-background/20"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>
      <div className="space-y-2">
        <textarea
          value={editedNote.content}
          onChange={(e) => setEditedNote({ ...editedNote, content: e.target.value })}
          className={`w-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ocean dark:bg-navy dark:text-background dark:border-background/20 ${
            errors.content ? 'border-red-500' : 'border-light-gray'
          }`}
          rows={8}
          placeholder="Content"
        />
        {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            setIsEditing(false);
            setErrors({});
            setEditedNote({ title: note.title, content: note.content });
          }}
          className="p-2 text-navy dark:text-background hover:bg-light-gray/20 dark:hover:bg-background/10 rounded-lg transition-colors"
          disabled={loading}
        >
          <X className="w-4 h-4" />
        </button>
        <button
          onClick={handleUpdate}
          className="p-2 text-ocean hover:bg-ocean/10 rounded-lg transition-colors"
          disabled={loading}
        >
          <Check className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="group bg-white dark:bg-navy-light rounded-xl shadow-sm border border-light-gray dark:border-background/10 p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start gap-4 mb-3">
          <h3 className="font-medium text-navy dark:text-background line-clamp-2">{note.title}</h3>
          {note.isAiGenerated && (
            <Bot className="w-4 h-4 text-ocean flex-shrink-0" />
          )}
        </div>
        {renderContent(true)}
        <div className="flex justify-end gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsViewModalOpen(true)}
            className="p-2 text-navy dark:text-background hover:bg-light-gray/20 dark:hover:bg-background/10 rounded-lg transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
            disabled={loading}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={note.title}
        size="lg"
      >
        <div className="max-h-[70vh] overflow-y-auto">
          {isEditing ? renderEditForm() : renderContent(false)}
          {!isEditing && (
            <div className="flex justify-end gap-2 mt-4">
              <MyButton
                onClick={() => setIsEditing(true)}
                variant="ghost"
                className="text-navy dark:text-background"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </MyButton>
              <MyButton
                onClick={handleDelete}
                variant="ghost"
                className="text-red-500"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </MyButton>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
