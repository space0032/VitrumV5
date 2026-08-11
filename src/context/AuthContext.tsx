import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AuthUser } from '../types';
import { authRepository, RegisterPayload } from '../services/authRepository';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../utils/api';

interface AuthContextType {
  authUser: AuthUser | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (identifier: string, password: string) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const readStoredUser = (): AuthUser | null => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_USER_KEY) || 'null');
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => readStoredUser());
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(() => Boolean(localStorage.getItem(AUTH_TOKEN_KEY)));

  // Restore/validate the session on boot so a refresh keeps the user signed in.
  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setIsAuthLoading(false);
      return;
    }

    authRepository
      .me()
      .then((user) => {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        setAuthUser(user);
      })
      .catch(() => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
        setAuthUser(null);
      })
      .finally(() => setIsAuthLoading(false));
  }, []);

  const login = async (identifier: string, password: string): Promise<AuthUser> => {
    const { token, user } = await authRepository.login(identifier, password);
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    setAuthUser(user);
    return user;
  };

  const register = (payload: RegisterPayload): Promise<AuthUser> => authRepository.register(payload);

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<void> => {
    await authRepository.changePassword(currentPassword, newPassword, confirmPassword);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setAuthUser(null);
  };

  const value = useMemo<AuthContextType>(
    () => ({
      authUser,
      isAuthenticated: Boolean(authUser),
      isAuthLoading,
      login,
      register,
      changePassword,
      logout,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authUser, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
