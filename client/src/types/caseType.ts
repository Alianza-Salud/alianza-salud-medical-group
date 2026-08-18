export interface CaseType {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface CreateCaseTypeFormData {
  name: string;
  description?: string;
}

export interface UpdateCaseTypeFormData {
  name: string;
  description?: string;
  isActive: boolean;
}
