/**
 * List Processes Use Case
 * Path: src/features/processes/application/use-cases/list-processes.use-case.ts
 */

import { IProcessRepository } from "../../domain/repositories/process.repository.interface";
import { ProcessFilters, ProcessPaginatedResponse } from "../../shared/types/process.types";
import { processRepository } from "../../infrastructure/repositories/process.repository.impl";

export class ListProcessesUseCase {
  constructor(
    private readonly repository: IProcessRepository = processRepository
  ) {}

  async execute(filters?: ProcessFilters, token?: string): Promise<ProcessPaginatedResponse> {
    try {
      // Apply business rules to filters
      const validatedFilters = this.validateFilters(filters);
      
      // Get processes from repository with token
      const result = await this.repository.findAll(validatedFilters, token);
      
      // Transform for presentation if needed
      return {
        ...result,
        data: result.data.map(process => process.toJSON ? process.toJSON() : process),
      };
    } catch (error) {
      console.error("Error in ListProcessesUseCase:", error);
      throw new Error("Failed to list processes");
    }
  }

  private validateFilters(filters?: ProcessFilters): ProcessFilters {
    if (!filters) return {};
    
    return {
      ...filters,
      page: Math.max(1, filters.page || 1),
      pageSize: Math.min(100, Math.max(1, filters.pageSize || 12)),
      sortOrder: filters.sortOrder || "desc",
      sortBy: filters.sortBy || "createdAt",
    };
  }
}


