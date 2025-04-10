import { create } from 'zustand';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token') || null, 
  isAuthenticated: !!localStorage.getItem('token'), 
  login: (token) => {
    localStorage.setItem('token', token); 
    set({ token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token'); 
    set({ token: null, isAuthenticated: false });
  },
}));

export default useAuthStore;