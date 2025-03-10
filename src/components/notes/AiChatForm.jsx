import React, { useState } from 'react';
import MyInput from '../ui/Input';
import MyButton from '../ui/Button';
import { toast } from 'sonner';
import API from '../../services/api';
import { handleApiError } from '../../utils/errorHandler';
import { validatePrompt } from '../../utils/validation';
import { Bot } from 'lucide-react';

export default function AiChatForm({ onNoteCreated }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      setError(null);
      const { isValid, errors } = validatePrompt(prompt);
      if (!isValid) {
        setError(errors.prompt);
        toast.error(errors.prompt);
        return;
      }

      setLoading(true);
      const res = await API.post('/Chat/generate', JSON.stringify(prompt.trim()), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      onNoteCreated(res.data);
      setPrompt('');
      toast.success('AI tasks generated successfully!');
    } catch (error) {
      handleApiError(error, 'Failed to generate AI tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <MyInput
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              setError(null);
            }}
            onKeyPress={handleKeyPress}
            placeholder="What do you want to learn? (e.g., 'I want to learn Python')"
            className="w-full pl-11 pr-4"
            error={error}
            disabled={loading}
          />
          <Bot className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-gray" />
        </div>
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <MyButton 
            onClick={handleSubmit} 
            disabled={loading || !prompt.trim()}
            className="bg-lime hover:bg-lime/90 text-white"
          >
            {loading ? 'Generating...' : 'Generate Tasks'}
          </MyButton>
          <p className="text-sm text-light-gray">
            Press Enter to generate
          </p>
        </div>

        <div className="p-4 bg-background rounded-lg space-y-2">
          <h3 className="font-medium text-navy">How it works:</h3>
          <ul className="text-sm text-navy/60 space-y-1">
            <li>1. Enter what you want to learn</li>
            <li>2. AI will generate a list of 21 tasks</li>
            <li>3. Tasks will be saved as a checklist note</li>
            <li>4. Track your progress by checking off completed tasks</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 