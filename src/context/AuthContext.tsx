import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Role } from '../types';

interface AuthState {
  token: string | null;
  role: Role | null;
  userId: number | null;
  username: string | null;
}

interface AuthContextType extends AuthState {
  login: (token: string, role: Role, userId: number, username: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => ({
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role') as Role | null,
    userId: localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null,
    username: localStorage.getItem('username'),
  }));

  const login = (token: string, role: Role, userId: number, username: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', String(userId));
    localStorage.setItem('username', username);
    setAuth({ token, role, userId, username });
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ token: null, role: null, userId: null, username: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, isAuthenticated: !!auth.token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
