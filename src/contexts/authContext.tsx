import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Role } from '../types/types';
import userService from '../services/userService';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => User | null;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate loading user from "session"
  useEffect(() => {
    setLoading(true);
    try {
      const userId = window.localStorage.getItem('auth_user_id');
      if (userId) {
        const found = userService.getUserById(userId);
        if (found) {
          setUser(found);
        } else {
          setUser(null);
        }
      }
    } catch {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate login by email (find user by email)
      const users = userService.getUsers();
      const found = users.find((u) => u.email === email);
      if (!found) {
        setError('User not found');
        setUser(null);
        setLoading(false);
        return;
      }
      setUser(found);
      window.localStorage.setItem('auth_user_id', found.id);
    } catch (e) {
      setError('Login failed');
      setUser(null);
    }
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    try {
      window.localStorage.removeItem('auth_user_id');
    } catch {
      // ignore
    }
  }, []);

  const getCurrentUser = useCallback(() => user, [user]);

  const isAdmin = useCallback(() => {
    return user?.role === 'admin';
  }, [user]);

  const value: AuthContextValue = {
    user,
    loading,
    error,
    login,
    logout,
    getCurrentUser,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}