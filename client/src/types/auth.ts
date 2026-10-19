export type UserRole = 'client' | 'lawyer' | 'auxiliar_admisiones' | 'admin';

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterFormData {
  verificationCode: string; // Código alfanumérico de 8 caracteres
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
  };
  error?: {
    message: string;
    status: number;
  };
}
