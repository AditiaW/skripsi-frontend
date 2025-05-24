import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  userRole: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  userRole: (() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) return null;
    try {
      const decoded = jwtDecode<{ role?: string }>(storedToken);
      return decoded.role || null;
    } catch {
      return null;
    }
  })(),

  login: (token) => {
    try {
      const decoded = jwtDecode<{ role?: string }>(token);
      localStorage.setItem('token', token);
      set({
        token,
        isAuthenticated: true,
        userRole: decoded.role || null,
      });
    } catch (error) {
      console.error('Error decoding token:', error);
      set({ token: null, isAuthenticated: false, userRole: null });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, isAuthenticated: false, userRole: null });
  },
}));

export default useAuthStore;
