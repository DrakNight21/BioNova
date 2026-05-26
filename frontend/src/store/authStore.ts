import { create } from 'zustand';
import api from '../lib/axios';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'proposer' | 'customer';
  location: string | null;
  status: 'pending' | 'active' | 'suspended';
  proposer_profile?: {
    id: number;
    farm_name: string;
    verified_at: string | null;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('auth_token'),
  isAuthenticated: !!localStorage.getItem('auth_token'),
  setAuth: (user, token) => {
    localStorage.setItem('auth_token', token);
    set({ user, token, isAuthenticated: true });
  },
  logout: async () => {
    try {
      await api.post('/logout');
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem('auth_token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
  checkAuth: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    try {
      const response = await api.get('/user');
      set({ user: response.data, isAuthenticated: true });
    } catch (e) {
      localStorage.removeItem('auth_token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  }
}));
