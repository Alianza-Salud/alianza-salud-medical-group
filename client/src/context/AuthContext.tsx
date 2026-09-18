import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, LoginCredentials, RegisterFormData } from '../types/auth';
import { loginUser, registerUser, fetchCurrentUser, logoutUser } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterFormData) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Verificar sesión existente al cargar la app
  useEffect(() => {
    async function checkAuth() {
      const res = await fetchCurrentUser();
      if (res.success && res.data) {
        setUser(res.data);
      }
      setIsLoading(false);
    }
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const res = await loginUser(credentials);
    if (res.success && res.data) {
      setUser(res.data.user);
      return { success: true, message: res.message };
    }
    return {
      success: false,
      message: res.error?.message || 'Error al iniciar sesión.',
    };
  };

  const register = async (data: RegisterFormData) => {
    const res = await registerUser(data);
    if (res.success && res.data) {
      setUser(res.data.user);
      return { success: true, message: res.message };
    }
    return {
      success: false,
      message: res.error?.message || 'Error al registrar usuario.',
    };
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
