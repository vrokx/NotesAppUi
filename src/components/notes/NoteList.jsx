import React, { useEffect, useState } from "react";
import useNoteStore from "../../context/noteStore";
import useAuthStore from "../../context/authStore";
import NoteItem from "./NoteItem";
import MyButton from "../ui/button";
import Modal from "../ui/modal";
import { Plus, Bot, LogOut, Moon, Sun } from "lucide-react";
import { handleApiError } from "../../utils/errorHandler";
import { validateNote } from "../../utils/validation";
import { toast } from "sonner";
import CreateNoteForm from "./CreateNoteForm";
import AiChatForm from "./AiChatForm";
import { useNavigate } from "react-router-dom";
import Masonry from 'react-masonry-css';

export default function NoteList() {
  const { notes, fetchNotes } = useNoteStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const breakpointColumns = {
    default: 5,
    1920: 5,
    1536: 4,
    1280: 4,
    1024: 3,
    768: 2,
    640: 2,
    480: 1
  };

  useEffect(() => {
    const loadNotes = async () => {
      try {
        await fetchNotes();
      } catch (error) {
        handleApiError(error, 'Failed to load notes');
      } finally {
        setInitialLoading(false);
      }
    };
    loadNotes();

    // Load dark mode preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    try {
      logout();
      navigate("/");
      toast.success('Logged out successfully');
    } catch (error) {
      handleApiError(error, 'Failed to logout');
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-navy p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-ocean border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-navy dark:text-background">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-52 bg-background dark:bg-navy">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background dark:bg-navy border-b border-light-gray dark:border-background/10">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl sm:text-3xl font-bold text-navy dark:text-background">My Notes</h1>
            <div className="flex items-center gap-2 sm:gap-4">
              <MyButton onClick={toggleDarkMode} variant="ghost" className="text-navy dark:text-background">
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </MyButton>
              <MyButton onClick={handleLogout} variant="ghost" className="text-navy dark:text-background">
                <LogOut className="w-5 h-5" />
              </MyButton>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-16">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {notes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-navy/60 dark:text-background/60 text-lg">
                You don't have any notes yet. Create one or use AI to generate tasks!
              </p>
            </div>
          ) : (
            <Masonry
              breakpointCols={breakpointColumns}
              className="flex -ml-3 sm:-ml-4 w-auto"
              columnClassName="pl-3 sm:pl-4 bg-clip-padding"
            >
              {notes.map((note) => (
                <div key={note.id} className="mb-3 sm:mb-4">
                  <NoteItem note={note} />
                </div>
              ))}
            </Masonry>
          )}
        </div>
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-40">
        <button
          onClick={() => setIsAiModalOpen(true)}
          className="p-4 bg-lime text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group"
        >
          <Bot className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="p-4 bg-ocean text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group"
        >
          <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Note"
      >
        <CreateNoteForm
          onSuccess={() => {
            setIsCreateModalOpen(false);
            fetchNotes();
          }}
        />
      </Modal>

      <Modal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        title="Generate Learning Tasks with AI"
      >
        <AiChatForm
          onNoteCreated={() => {
            setIsAiModalOpen(false);
            fetchNotes();
          }}
        />
      </Modal>
    </div>
  );
}
