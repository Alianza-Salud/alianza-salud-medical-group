export type LawyerRoleType = 'lawyer' | 'medical_specialist';

export interface Lawyer {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  specialty: string;
  roleType: LawyerRoleType;
  isActive: boolean;
  createdAt: string;
}

export interface CreateLawyerFormData {
  fullName: string;
  email: string;
  phone?: string;
  specialty: string;
  roleType: LawyerRoleType;
}
