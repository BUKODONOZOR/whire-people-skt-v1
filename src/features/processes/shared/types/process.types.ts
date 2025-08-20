/**
 * Process Types
 * Path: src/features/processes/shared/types/process.types.ts
 */

import { ProcessStatus } from "../../domain/value-objects/process-status.vo";
import { ProcessPriority } from "../../domain/value-objects/process-priority.vo";

// Filter types
export interface ProcessFilters {
  search?: string;
  status?: ProcessStatus[];
  priority?: ProcessPriority[];
  location?: string;
  remote?: boolean;
  minSalary?: number;
  maxSalary?: number;
  tags?: string[];
  assignedTo?: string;
  createdBy?: string;
  createdAfter?: string;
  createdBefore?: string;
  deadlineAfter?: string;
  deadlineBefore?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Response types
export interface ProcessPaginatedResponse {
  data: any[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// DTO types
export interface CreateProcessDTO {
  name: string;
  description?: string;
  vacancies: number;
  priority?: ProcessPriority;
  location?: string;
  remote?: boolean;
  requiredSkills?: Array<{
    name: string;
    level: number;
    required: boolean;
  }>;
  requiredLanguages?: Array<{
    code: string;
    name: string;
    level: string;
    required: boolean;
  }>;
  minExperience?: number;
  maxExperience?: number;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  deadline?: string;
  tags?: string[];
}

export interface UpdateProcessDTO extends Partial<CreateProcessDTO> {
  status?: ProcessStatus;
}

export interface AddCandidatesToProcessDTO {
  processId: string;
  candidateIds: string[];
}

export interface UpdateCandidateStatusDTO {
  processId: string;
  candidateId: string;
  status: number;
  notes?: string;
}

// Form schemas (for validation)
export interface ProcessFormData {
  name: string;
  description?: string;
  vacancies: number;
  priority: ProcessPriority;
  location?: string;
  remote: boolean;
  skills?: string;
  languages?: string;
  minExperience?: number;
  maxExperience?: number;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  deadline?: Date;
  tags?: string;
}