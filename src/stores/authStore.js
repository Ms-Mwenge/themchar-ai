import { create } from 'zustand';

// Helper functions to manage localStorage
const getToken = () => localStorage.getItem('token') || null;
const getChatSessionId = () => localStorage.getItem('chat_session_id') || null;
const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const useAuthStore = create((set) => ({
  token: getToken(),
  chatSessionId: getChatSessionId(),
  isAuthenticated: !!getToken(),
  user: getUser(),

  // Login function
  login: (chatSessionId, token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('chat_session_id', chatSessionId);
    localStorage.setItem('user', JSON.stringify(userData));
    set({ 
      chatSessionId, 
      token, 
      user: userData, 
      isAuthenticated: true 
    });
  },

  // Logout function
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('chat_session_id');
    localStorage.removeItem('user');
    set({ 
      chatSessionId: null, 
      token: null, 
      user: null, 
      isAuthenticated: false 
    });
  },

  // Update user function
  setUser: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    set({ user: userData });
  },

  // Update token function (optional)
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token, isAuthenticated: !!token });
  },

  // Update chat session function (optional)
  setChatSessionId: (chatSessionId) => {
    localStorage.setItem('chat_session_id', chatSessionId);
    set({ chatSessionId });
  }
}));