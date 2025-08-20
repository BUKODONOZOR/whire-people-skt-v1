/**
 * Process Entity
 * Path: src/features/processes/domain/entities/process.entity.ts
 */

import { ProcessStatus } from "../value-objects/process-status.vo";
import { ProcessPriority } from "../value-objects/process-priority.vo";

export interface ProcessSkill {
  id?: string;
  name: string;
  level?: number;
  required?: boolean;
}

export interface ProcessLanguage {
  id?: string;
  code: string;
  name: string;
  level?: string;
  required?: boolean;
}

export interface ProcessCandidate {
  id: string;
  name: string;
  email: string;
  status: string;
  appliedAt: Date;
  rating?: number;
  notes?: string;
}

export interface ProcessProps {
  id: string;
  name: string;
  description?: string;
  companyId: string;
  companyName?: string;
  companyEmail?: string;
  companyImage?: string;
  status: ProcessStatus;
  statusName?: string;
  priority?: ProcessPriority;
  vacancies: number;
  studentsCount?: number;
  location?: string;
  remote?: boolean;
  requiredSkills?: ProcessSkill[];
  requiredLanguages?: ProcessLanguage[];
  minExperience?: number;
  maxExperience?: number;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  deadline?: Date;
  createdAt: Date;
  updatedAt?: Date;
  createdById?: string;
  createdByName?: string;
  candidates?: ProcessCandidate[];
  tags?: string[];
}

export class Process {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly companyId: string;
  readonly companyName?: string;
  readonly companyEmail?: string;
  readonly companyImage?: string;
  readonly status: ProcessStatus;
  readonly statusName?: string;
  readonly priority: ProcessPriority;
  readonly vacancies: number;
  readonly studentsCount: number;
  readonly location?: string;
  readonly remote: boolean;
  readonly requiredSkills: ProcessSkill[];
  readonly requiredLanguages: ProcessLanguage[];
  readonly minExperience?: number;
  readonly maxExperience?: number;
  readonly salaryMin?: number;
  readonly salaryMax?: number;
  readonly currency?: string;
  readonly deadline?: Date;
  readonly createdAt: Date;
  readonly updatedAt?: Date;
  readonly createdById?: string;
  readonly createdByName?: string;
  readonly candidates: ProcessCandidate[];
  readonly tags: string[];

  constructor(props: ProcessProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.companyId = props.companyId;
    this.companyName = props.companyName;
    this.companyEmail = props.companyEmail;
    this.companyImage = props.companyImage;
    this.status = props.status;
    this.statusName = props.statusName;
    this.priority = props.priority || ProcessPriority.MEDIUM;
    this.vacancies = props.vacancies;
    this.studentsCount = props.studentsCount || 0;
    this.location = props.location;
    this.remote = props.remote || false;
    this.requiredSkills = props.requiredSkills || [];
    this.requiredLanguages = props.requiredLanguages || [];
    this.minExperience = props.minExperience;
    this.maxExperience = props.maxExperience;
    this.salaryMin = props.salaryMin;
    this.salaryMax = props.salaryMax;
    this.currency = props.currency || "USD";
    this.deadline = props.deadline;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.createdById = props.createdById;
    this.createdByName = props.createdByName;
    this.candidates = props.candidates || [];
    this.tags = props.tags || [];
  }

  /**
   * Check if process is active (can receive applications)
   */
  isActive(): boolean {
    return this.status === ProcessStatus.ACTIVE || this.status === ProcessStatus.IN_PROGRESS;
  }

  /**
   * Check if process has expired
   */
  hasExpired(): boolean {
    if (!this.deadline) return false;
    return new Date() > this.deadline;
  }

  /**
   * Check if process has available vacancies
   */
  hasAvailableVacancies(): boolean {
    return this.studentsCount < this.vacancies;
  }

  /**
   * Get process completion percentage
   */
  getCompletionPercentage(): number {
    if (this.vacancies === 0) return 0;
    return Math.min(100, Math.round((this.studentsCount / this.vacancies) * 100));
  }

  /**
   * Get status color for UI
   */
  getStatusColor(): string {
    const statusColors: Record<ProcessStatus, string> = {
      [ProcessStatus.DRAFT]: "#6b7280",
      [ProcessStatus.ACTIVE]: "#22c55e",
      [ProcessStatus.IN_PROGRESS]: "#3b82f6",
      [ProcessStatus.COMPLETED]: "#8b5cf6",
      [ProcessStatus.CANCELLED]: "#ef4444",
      [ProcessStatus.ON_HOLD]: "#f59e0b",
    };
    return statusColors[this.status] || "#6b7280";
  }

  /**
   * Get priority color for UI
   */
  getPriorityColor(): string {
    const priorityColors: Record<ProcessPriority, string> = {
      [ProcessPriority.LOW]: "#22c55e",
      [ProcessPriority.MEDIUM]: "#3b82f6",
      [ProcessPriority.HIGH]: "#f59e0b",
      [ProcessPriority.URGENT]: "#ef4444",
    };
    return priorityColors[this.priority] || "#3b82f6";
  }

  /**
   * Get priority label
   */
  getPriorityLabel(): string {
    const priorityLabels: Record<ProcessPriority, string> = {
      [ProcessPriority.LOW]: "Low",
      [ProcessPriority.MEDIUM]: "Medium",
      [ProcessPriority.HIGH]: "High",
      [ProcessPriority.URGENT]: "Urgent",
    };
    return priorityLabels[this.priority] || "Medium";
  }

  /**
   * Get status label (use statusName if available, otherwise map from enum)
   */
  getStatusLabel(): string {
    if (this.statusName) {
      return this.statusName;
    }
    
    const statusLabels: Record<ProcessStatus, string> = {
      [ProcessStatus.DRAFT]: "Draft",
      [ProcessStatus.ACTIVE]: "Active",
      [ProcessStatus.IN_PROGRESS]: "In Progress",
      [ProcessStatus.COMPLETED]: "Completed",
      [ProcessStatus.CANCELLED]: "Cancelled",
      [ProcessStatus.ON_HOLD]: "On Hold",
    };
    return statusLabels[this.status] || "Unknown";
  }

  /**
   * Check if a candidate can be added
   */
  canAddCandidate(): boolean {
    return this.isActive() && this.hasAvailableVacancies() && !this.hasExpired();
  }

  /**
   * Calculate days until deadline
   */
  getDaysUntilDeadline(): number | null {
    if (!this.deadline) return null;
    const now = new Date();
    const diff = this.deadline.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Check if process is urgent (deadline within 7 days)
   */
  isUrgent(): boolean {
    const days = this.getDaysUntilDeadline();
    return days !== null && days <= 7 && days >= 0;
  }

  /**
   * Convert to JSON
   */
  toJSON(): any {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      companyId: this.companyId,
      companyName: this.companyName,
      companyEmail: this.companyEmail,
      companyImage: this.companyImage,
      status: this.status,
      statusName: this.statusName,
      statusLabel: this.getStatusLabel(),
      statusColor: this.getStatusColor(),
      priority: this.priority,
      priorityLabel: this.getPriorityLabel(),
      priorityColor: this.getPriorityColor(),
      vacancies: this.vacancies,
      studentsCount: this.studentsCount,
      location: this.location,
      remote: this.remote,
      requiredSkills: this.requiredSkills,
      requiredLanguages: this.requiredLanguages,
      minExperience: this.minExperience,
      maxExperience: this.maxExperience,
      salaryMin: this.salaryMin,
      salaryMax: this.salaryMax,
      currency: this.currency,
      deadline: this.deadline?.toISOString(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt?.toISOString(),
      createdById: this.createdById,
      createdByName: this.createdByName,
      candidates: this.candidates,
      tags: this.tags,
      // Computed properties
      isActive: this.isActive(),
      hasExpired: this.hasExpired(),
      hasAvailableVacancies: this.hasAvailableVacancies(),
      completionPercentage: this.getCompletionPercentage(),
      daysUntilDeadline: this.getDaysUntilDeadline(),
      isUrgent: this.isUrgent(),
      canAddCandidate: this.canAddCandidate(),
    };
  }
}

// Re-export related types
export { ProcessCandidate } from "./process-candidate.entity";