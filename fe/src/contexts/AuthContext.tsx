import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';
import type { User } from '../lib/types';

interface AuthContextType {
  user: User | null;
  signin: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  signout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const signin = async (username: string, password: string) => {
    const data = await api.auth.signin({ username, password });
    localStorage.setItem('token', data.token);
    setUser({ token: data.token });
  };

  const signup = async (username: string, password: string) => {
    await api.auth.signup({ username, password });
  };

  const signout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signin, signup, signout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
