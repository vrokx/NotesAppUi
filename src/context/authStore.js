import { create } from 'zustand';
import API from '../services/api';
import { toast } from 'sonner';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || sessionStorage.getItem('token') || null,

  login: async (email, password, rememberMe = false) => {
    try {
      const res = await API.post('/User/login', { email, password });
      const token = res.data.token;
      
      // Store token based on remember me preference
      if (rememberMe) {
        localStorage.setItem('token', token);
        sessionStorage.removeItem('token');
      } else {
        sessionStorage.setItem('token', token);
        localStorage.removeItem('token');
      }
      
      set({ token, user: { email } });
      toast.success('Logged in successfully');
      return res.data;
    } catch (error) {
      toast.error(error.response?.data || 'Failed to login');
      throw error;
    }
  },

  register: async (email, password, userName) => {
    try {
      const res = await API.post('/User', { 
        email, 
        passwordHash: password,
        userName 
      });
      const loginRes = await API.post('/User/login', { email, password });
      const token = loginRes.data.token;
      
      // For new registrations, store in session storage by default
      sessionStorage.setItem('token', token);
      localStorage.removeItem('token');
      
      set({ token, user: { email } });
      toast.success('Registered successfully');
      return loginRes.data;
    } catch (error) {
      toast.error(error.response?.data || 'Failed to register');
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    set({ token: null, user: null });
    toast.success('Logged out successfully');
  },

  // Initialize auth state from storage
  initAuth: () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      set({ token, user: { email: 'user' } });
    }
  }
}));

// Initialize auth state when the store is created
useAuthStore.getState().initAuth();

// Listen for storage changes across tabs
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'token') {
      if (e.newValue) {
        useAuthStore.setState({ token: e.newValue, user: { email: 'user' } });
      } else {
        useAuthStore.setState({ token: null, user: null });
      }
    }
  });
}

export default useAuthStore;
