import { toast } from 'sonner';

export class ApiError extends Error {
  constructor(message, statusCode, originalError = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}

export const handleApiError = (error, customMessage = null) => {
  console.error('API Error:', error);

  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    if (status === 401) {
      toast.error('Your session has expired. Please log in again.');
      // You could trigger a logout here if needed
      return;
    }
    if (status === 403) {
      toast.error('You do not have permission to perform this action.');
      return;
    }
    if (status === 404) {
      toast.error('The requested resource was not found.');
      return;
    }
    if (status >= 500) {
      toast.error('An unexpected server error occurred. Please try again later.');
      return;
    }
    toast.error(error.response.data || customMessage || 'An error occurred');
  } else if (error.request) {
    // Request was made but no response received
    toast.error('Unable to connect to the server. Please check your internet connection.');
  } else {
    // Something else happened
    toast.error(customMessage || error.message || 'An unexpected error occurred');
  }
}; 