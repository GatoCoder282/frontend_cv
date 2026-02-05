'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/authService';
import { UserResponse } from '@/types';

interface AuthContextType {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario al iniciar
  useEffect(() => {
    const loadUser = () => {
      const storedUser = authService.getUser();
      const storedToken = authService.getToken();
      console.log('AuthContext - Cargando usuario:', {
        storedUser,
        hasToken: !!storedToken,
      });
      setUser(storedUser);
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    console.log('AuthContext - Iniciando login...');
    const userData = await authService.login({ email, password });
    console.log('AuthContext - Login exitoso:', userData);
    setUser(userData);
  };

  const register = async (username: string, email: string, password: string) => {
    console.log('AuthContext - Registrando usuario...');
    await authService.register({ username, email, password });
    console.log('AuthContext - Registro exitoso');
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Calcular valores derivados basados en el estado actual
  const isAuthenticated = !!user && !!authService.getToken();
  const isAdmin = user ? ['ADMIN', 'SUPERADMIN'].includes(user.role.toUpperCase()) : false;
  const isSuperAdmin = user?.role.toUpperCase() === 'SUPERADMIN';

  console.log('AuthContext - Valores calculados:', {
    user,
    userRole: user?.role,
    userRoleUpperCase: user?.role.toUpperCase(),
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    roleCheck: user ? ['ADMIN', 'SUPERADMIN'].includes(user.role.toUpperCase()) : 'no user',
  });

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}
