export interface CaseUpdate {
  id: number;
  createdByName: string;
  title: string;
  description: string;
  stageName: string;
  createdAt: string;
}

export interface LegalCase {
  id: number;
  caseCode: string;
  verificationCode: string;
  clientId?: number;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  userId?: number | null;
  serviceSlug: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'closed';
  stage: string;
  assignedLawyerName: string;
  lawyerId?: number | null;
  createdAt: string;
  updates?: CaseUpdate[];
}

export interface CreateCaseFormData {
  clientId: number;
  serviceSlug: string;
  title: string;
  description: string;
  lawyerId?: number | null;
  assignedLawyerName?: string;
}

export interface AddUpdateFormData {
  title: string;
  description: string;
  stageName?: string;
}
