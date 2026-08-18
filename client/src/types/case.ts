export interface CaseUpdate {
  id: number;
  createdByName: string;
  title: string;
  description: string;
  stageName: string;
  createdAt: string;
}

export interface CaseDocument {
  id: number;
  caseId: number;
  name: string;
  type: string;
  description?: string;
  filePath?: string;
  originalName?: string;
  uploadedByName?: string;
  status: string;
  visibleToClient: boolean;
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
  caseType?: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'closed';
  stage: string;
  assignedLawyerName: string;
  lawyerId?: number | null;
  createdAt: string;
  updates?: CaseUpdate[];
  documents?: CaseDocument[];
}

export interface CreateCaseFormData {
  clientId: number;
  serviceSlug: string;
  caseType?: string;
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

export interface AddDocumentFormData {
  name: string;
  type?: string;
  description?: string;
  visibleToClient: boolean;
  file?: File;
}
