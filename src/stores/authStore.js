import { create } from 'zustand';

// Helper to persist JWT in localStorage
const getToken = () => localStorage.getItem('token') || null;

export const useAuthStore = create((set) => ({
  token: getToken(),
  isAuthenticated: !!getToken(),
  user: null,

  // Login function
  login: (token, userData) => {
    localStorage.setItem('token', token);
    set({ token, user: userData, isAuthenticated: true });
  },

  // Logout function
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null, isAuthenticated: false });
  },

  // Optionally refresh user state
  setUser: (userData) => set({ user: userData }),
}));
