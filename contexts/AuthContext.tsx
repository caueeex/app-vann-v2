/**
 * AuthContext - VANN App
 * Contexto de autenticação
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole } from '@/types/common';
import { User, Parent, Driver } from '@/types/user';
import { clearToken, getToken, saveToken } from '@/services/storage/session';
import { loginRequest, logoutRequest, meRequest, registerRequest } from '@/services/api/auth';

interface AuthContextType {
  user: User | Parent | Driver | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User | Parent | Driver) => void;
}

interface RegisterData {
  email: string;
  cpf: string;
  name: string;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | Parent | Driver | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simular verificação de autenticação ao iniciar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        setUser(null);
        return;
      }

      const currentUser = await meRequest();
      setUser(currentUser);
    } catch {
      await clearToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await loginRequest(email, password);
      await saveToken(response.token);
      setUser(response.user);
    } catch {
      throw new Error('Falha no login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await registerRequest({
        name: data.name,
        email: data.email,
        cpf: data.cpf,
        role: data.role,
      });
      await saveToken(response.token);
      setUser(response.user);
    } catch {
      throw new Error('Falha no cadastro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutRequest();
    } catch {
      // Mesmo com falha no endpoint, limpamos sessao local.
    } finally {
      await clearToken();
      setUser(null);
      setIsLoading(false);
    }
  };

  const updateUser = (updatedUser: User | Parent | Driver) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
