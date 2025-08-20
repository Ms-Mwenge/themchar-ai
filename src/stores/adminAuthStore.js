import { create } from 'zustand';

// Helper functions to manage localStorage
const getToken = () => localStorage.getItem('token') || null;
const getUser = () => {
  const userStr = localStorage.getItem('AdminUser');
  return userStr ? JSON.parse(userStr) : null;
};

export const useAuthStore = create((set) => ({
  token: getToken(),
  isAuthenticated: !!getToken(),
  user: getUser(),

  // Login function
  login: (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('AdminUser', JSON.stringify(userData));
    set({ 
      token, 
      user: userData, 
      isAuthenticated: true 
    });
  },

  // Logout function
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('AdminUser');
    set({ 
      token: null, 
      user: null, 
      isAuthenticated: false 
    });
  },

  // Update user function
  setUser: (userData) => {
    localStorage.setItem('AdminUser', JSON.stringify(userData));
    set({ user: userData });
  },

  // Update token function (optional)
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token, isAuthenticated: !!token });
  },

}));