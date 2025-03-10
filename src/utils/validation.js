export const validateNote = (title, content) => {
  const errors = {};

  if (!title?.trim()) {
    errors.title = 'Title is required';
  } else if (title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters long';
  } else if (title.trim().length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }

  if (!content?.trim()) {
    errors.content = 'Content is required';
  } else if (content.trim().length > 5000) {
    errors.content = 'Content must be less than 5000 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validatePrompt = (prompt) => {
  const errors = {};

  if (!prompt?.trim()) {
    errors.prompt = 'Please enter what you want to learn';
  } else if (prompt.trim().length < 5) {
    errors.prompt = 'Please be more specific about what you want to learn';
  } else if (prompt.trim().length > 200) {
    errors.prompt = 'Prompt must be less than 200 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}; 