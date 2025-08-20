import { create } from 'zustand';

// Helper to persist JWT in localStorage
const getToken = () => localStorage.getItem('token') || null;
const getChatSessionId = () => localStorage.getItem('chat_session_id') || null;

export const useAuthStore = create((set) => ({
  token: getToken(),
  chatSessionId: getChatSessionId(),
  isAuthenticated: !!getToken(),
  user: null,

  // Login function
  login: (chatSessionId, token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('chat_session_id', chatSessionId);
    set({ chatSessionId, token, user: userData, isAuthenticated: true });
  },

  // Logout function
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('chat_session_id');
    set({ chatSessionId: null, token: null, user: null, isAuthenticated: false });
  },

  // Optionally refresh user state
  setUser: (userData) => set({ user: userData }),
}));
