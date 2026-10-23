import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  demoLogin: (role: UserRole) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Map a UserRole to the correct dashboard path */
export const getDashboardForRole = (role: UserRole | string): string => {
  switch (role) {
    case 'COMMAND_CENTER':
      return '/command/dashboard';
    case 'RESCUE_TEAM':
    case 'MEDICAL_RESPONDER':
      return '/responder/dashboard';
    case 'SHELTER_MANAGER':
      return '/shelter/dashboard';
    case 'CITIZEN':
    default:
      return '/citizen/dashboard';
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('displaceos_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // On mount — only restore session if a token exists; never auto-kick on temporary network glitch
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('displaceos_token');
      const storedUser = localStorage.getItem('displaceos_user');

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          // parse error
        }
      }

      if (storedToken) {
        try {
          const res = await api.getMe();
          if (res?.user) {
            setUser(res.user);
            localStorage.setItem('displaceos_user', JSON.stringify(res.user));
          }
        } catch (err: any) {
          // If 401 Unauthorized specifically, clear session. Otherwise retain cached user session!
          if (err?.message?.includes('401') || err?.message?.includes('Session expired')) {
            localStorage.removeItem('displaceos_token');
            localStorage.removeItem('displaceos_user');
            setToken(null);
            setUser(null);
          }
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password });
      localStorage.setItem('displaceos_token', res.token);
      localStorage.setItem('displaceos_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      navigate(getDashboardForRole(res.user.role), { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (role: UserRole) => {
    setIsLoading(true);
    try {
      const res = await api.demoLogin(role);
      localStorage.setItem('displaceos_token', res.token);
      localStorage.setItem('displaceos_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      navigate(getDashboardForRole(role), { replace: true });
    } catch (err) {
      console.error('Demo login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      localStorage.setItem('displaceos_token', res.token);
      localStorage.setItem('displaceos_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      navigate(getDashboardForRole(res.user.role), { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('displaceos_token');
    localStorage.removeItem('displaceos_user');
    setToken(null);
    setUser(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  const switchRole = async (role: UserRole) => {
    await demoLogin(role);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, demoLogin, register, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
