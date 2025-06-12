import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  userRole: string | null;
  user: { name?: string; email?: string } | null;
  login: (token: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => {
  const storedToken = localStorage.getItem('token');
  let decoded: { role?: string; name?: string; email?: string } | null = null;

  if (storedToken) {
    try {
      decoded = jwtDecode(storedToken);
    } catch {
      decoded = null;
    }
  }

  return {
    token: storedToken || null,
    isAuthenticated: !!storedToken,
    userRole: decoded?.role || null,
    user: decoded ? { name: decoded.name, email: decoded.email } : null,

    login: (token) => {
      try {
        const decoded = jwtDecode<{ role?: string; name?: string; email?: string }>(token);
        localStorage.setItem('token', token);
        set({
          token,
          isAuthenticated: true,
          userRole: decoded.role || null,
          user: { name: decoded.name, email: decoded.email },
        });
      } catch (error) {
        console.error('Error decoding token:', error);
        set({ token: null, isAuthenticated: false, userRole: null, user: null });
      }
    },

    logout: () => {
      localStorage.removeItem('token');
      set({ token: null, isAuthenticated: false, userRole: null, user: null });
    },
  };
});

export default useAuthStore;
