/**
 * Core Talent Types
 * Adaptado del modelo de Developers pero renombrado a Talent
 */

// Status Types
export enum TalentStatus {
  AVAILABLE = 1,
  IN_PROCESS = 2,
  HIRED = 3,
  NOT_AVAILABLE = 4,
  REJECTED = 5,
}

export const TalentStatusLabels: Record<TalentStatus, string> = {
  [TalentStatus.AVAILABLE]: "Available",
  [TalentStatus.IN_PROCESS]: "In Process",
  [TalentStatus.HIRED]: "Hired",
  [TalentStatus.NOT_AVAILABLE]: "Not Available",
  [TalentStatus.REJECTED]: "Rejected",
};

export const TalentStatusColors: Record<TalentStatus, string> = {
  [TalentStatus.AVAILABLE]: "success",
  [TalentStatus.IN_PROCESS]: "warning",
  [TalentStatus.HIRED]: "info",
  [TalentStatus.NOT_AVAILABLE]: "muted",
  [TalentStatus.REJECTED]: "destructive",
};

// Skill Level
export enum SkillLevel {
  BEGINNER = 1,
  INTERMEDIATE = 2,
  ADVANCED = 3,
  EXPERT = 4,
}

// Language Level
export enum LanguageLevel {
  A1 = "A1",
  A2 = "A2",
  B1 = "B1",
  B2 = "B2",
  C1 = "C1",
  C2 = "C2",
  NATIVE = "NATIVE",
}

// Core Entities
export interface Skill {
  id?: string;
  name: string;
  level: SkillLevel;
  category?: string;
}

export interface Language {
  id?: string;
  code: string;
  name: string;
  level: LanguageLevel;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
  technologies?: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

// Main Talent Entity
export interface Talent {
  id: string;
  
  // Name fields - supporting both old and new format
  firstName: string;
  secondName?: string | null;
  firstLastName?: string;
  secondLastName?: string | null;
  lastName?: string; // Legacy field for compatibility
  
  email: string;
  phone?: string;
  avatar?: string;
  
  // Professional Info
  title?: string; // e.g., "Senior Full Stack Developer"
  stack?: string; // Technical stack/role from API
  stackId?: string; // Stack UUID from backend
  profile?: string; // Profile description
  description?: string;
  
  // Location Info
  location?: string;
  site?: string; // Site location (e.g., "Medellín")
  siteId?: string; // Site UUID from backend
  
  // Cohort/Group Info
  cohort?: string; // e.g., "Cohorte 2"
  cohortId?: string; // Cohort UUID from backend
  
  // Personal Info
  birthDate?: string; // Birth date for age calculation
  
  // Professional Details
  yearsOfExperience?: number;
  hourlyRate?: string; // e.g., "$75-100/hr"
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  availability?: string; // e.g., "Immediate", "2 weeks", "1 month"
  
  // Status and Scoring
  status?: TalentStatus | string; // Can be enum or string from API
  statusId?: number; // Status ID from API
  employabilityId?: number; // Employability ID from backend
  score?: number; // 0-100
  ranking?: number;
  matchScore?: number; // Match percentage
  matchCount?: number; // Number of matches
  
  // Skills and Languages
  skills?: (Skill | string)[]; // Can be objects or strings
  languages?: Language[];
  
  // Media and Links
  media?: any[]; // Media files
  links?: any[]; // External links
  
  // Experience and Education
  experience?: Experience[];
  education?: Education[];
  certifications?: any[]; // Certifications list
  
  // Additional Info
  portfolio?: string;
  linkedin?: string;
  github?: string;
  resume?: string;
  
  // Metadata
  createdAt?: string;
  updatedAt?: string;
  lastActivityAt?: string;
  
  // Process Info
  activeProcesses?: number;
  completedProcesses?: number;
  
  // Tags for categorization
  tags?: string[];
  specializations?: string[]; // e.g., ["Public Health", "Cybersecurity", "IT"]
}

// API Response Types
export interface TalentPaginatedResponse {
  data: Talent[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Filter Types
export interface TalentFilters {
  search?: string;
  status?: TalentStatus[];
  statusId?: number[];
  skills?: string | Skill[];
  mappedSkills?: string;
  languages?: string | Language[];
  mappedLanguages?: string;
  specializations?: string[];
  minScore?: number;
  maxScore?: number;
  minExperience?: number;
  maxExperience?: number;
  availability?: string[];
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  tags?: string[];
  
  // Pagination
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// DTO Types for API
export interface CreateTalentDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title: string;
  description?: string;
  location?: string;
  yearsOfExperience?: number;
  skills?: Skill[];
  languages?: Language[];
  specializations?: string[];
}

export interface UpdateTalentDTO extends Partial<CreateTalentDTO> {
  status?: TalentStatus;
  score?: number;
}