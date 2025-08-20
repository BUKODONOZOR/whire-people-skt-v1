/**
 * Process Repository Interface
 * Path: src/features/processes/domain/repositories/process.repository.interface.ts
 */

import { Process } from "../entities/process.entity";
import { ProcessFilters, ProcessPaginatedResponse } from "../../shared/types/process.types";
import { ProcessStatus } from "../value-objects/process-status.vo";

export interface IProcessRepository {
  findAll(filters?: ProcessFilters, token?: string): Promise<ProcessPaginatedResponse>;
  findById(id: string, token?: string): Promise<Process | null>;
  findByStatus(status: ProcessStatus, token?: string): Promise<Process[]>;
  findActive(token?: string): Promise<Process[]>;
  create(data: Partial<Process>, token?: string): Promise<Process>;
  update(id: string, data: Partial<Process>, token?: string): Promise<Process>;
  delete(id: string, token?: string): Promise<boolean>;
  addCandidates(processId: string, candidateIds: string[], token?: string): Promise<boolean>;
  removeCandidate(processId: string, candidateId: string, token?: string): Promise<boolean>;
  getStatistics(token?: string): Promise<{
    total: number;
    active: number;
    completed: number;
    cancelled: number;
  }>;
}
