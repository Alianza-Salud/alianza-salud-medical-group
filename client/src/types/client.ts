export interface Client {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  documentId?: string;
  address?: string;
  verificationCode: string; // Código alfanumérico de 8 caracteres
  userId?: number | null;
  isRegistered: boolean;
  createdAt: string;
}

export interface CreateClientFormData {
  fullName: string;
  email: string;
  phone?: string;
  documentId?: string;
  address?: string;
}
