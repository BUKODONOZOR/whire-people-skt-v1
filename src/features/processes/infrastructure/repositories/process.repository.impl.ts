/**
 * Process Repository Implementation
 * Path: src/features/processes/infrastructure/repositories/process.repository.impl.ts
 */

import { httpClient } from "@/infrastructure/http/http-client";
import { processApiClient } from "../api/process-api-client";
import { Process, ProcessSkill, ProcessLanguage } from "../../domain/entities/process.entity";
import { ProcessStatus } from "../../domain/value-objects/process-status.vo";
import { ProcessPriority } from "../../domain/value-objects/process-priority.vo";
import { IProcessRepository } from "../../domain/repositories/process.repository.interface";
import { ProcessFilters, ProcessPaginatedResponse } from "../../shared/types/process.types";
import { WIRED_PEOPLE_COMPANY_ID, WIRED_PEOPLE_COMPANY_NAME } from "../../shared/constants/process.constants";

export class ProcessRepository implements IProcessRepository {
  private readonly baseEndpoint = "/v1/processes";
  private readonly companyId = WIRED_PEOPLE_COMPANY_ID;
  private readonly companyName = WIRED_PEOPLE_COMPANY_NAME;

  /**
   * Map API response to domain entity
   */
  private mapToDomainEntity(data: any): Process {
    // Adaptador para la estructura del backend de Riwi Talent
    return new Process({
      id: data.id || data.processId,
      name: data.name || data.title,
      description: data.description || "",
      companyId: data.companyId || this.companyId,
      companyName: data.companyName || data.companyEmail || this.companyName,
      companyImage: data.companyImage,
      status: this.mapProcessStatus(data.statusId || data.status),
      statusName: data.statusName,
      priority: this.mapProcessPriority(data.priority),
      vacancies: data.vacancies || 1,
      studentsCount: data.studentsCount || 0,
      location: data.location,
      remote: data.remote || false,
      requiredSkills: this.mapSkills(data.skills || data.processSkills || []),
      requiredLanguages: this.mapLanguages(data.languages || data.processLanguages || []),
      minExperience: data.minExperience,
      maxExperience: data.maxExperience,
      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      currency: data.currency || "USD",
      deadline: data.deadline ? new Date(data.deadline) : undefined,
      createdAt: new Date(data.createdAt || data.createdDate),
      updatedAt: new Date(data.updatedAt || data.modifiedDate || data.createdAt),
      createdById: data.createdById,
      createdByName: data.createdByName || "Admin",
      candidates: [], // Will be loaded separately if needed
      tags: data.tags || [],
    });
  }

  /**
   * Map domain entity to API format
   */
  private mapToApiFormat(process: Partial<Process>): any {
    return {
      name: process.name,
      description: process.description,
      companyId: this.companyId,
      vacancies: process.vacancies,
      statusId: process.status ? this.mapStatusToApiId(process.status) : undefined,
      priority: process.priority,
      location: process.location,
      remote: process.remote,
      skills: process.requiredSkills,
      languages: process.requiredLanguages,
      minExperience: process.minExperience,
      maxExperience: process.maxExperience,
      salaryMin: process.salaryMin,
      salaryMax: process.salaryMax,
      currency: process.currency,
      deadline: process.deadline?.toISOString(),
      tags: process.tags,
    };
  }

  /**
   * Map Riwi Talent status to our ProcessStatus
   */
  private mapProcessStatus(statusId: number | string): ProcessStatus {
    // Handle both number and string status IDs
    const id = typeof statusId === 'string' ? parseInt(statusId, 10) : statusId;
    
    // Riwi Talent status mapping:
    // 1 = "En espera" -> ACTIVE
    // 2 = "En revisión" -> IN_PROGRESS  
    // 3 = "En proceso" -> IN_PROGRESS
    // 4 = "Finalizado" -> COMPLETED
    // 5 = "Cancelado" -> CANCELLED
    const statusMap: Record<number, ProcessStatus> = {
      1: ProcessStatus.ACTIVE,      // En espera
      2: ProcessStatus.IN_PROGRESS, // En revisión
      3: ProcessStatus.IN_PROGRESS, // En proceso
      4: ProcessStatus.COMPLETED,   // Finalizado
      5: ProcessStatus.CANCELLED,   // Cancelado
      0: ProcessStatus.DRAFT,       // Borrador
    };
    
    return statusMap[id] ?? ProcessStatus.ACTIVE;
  }

  /**
   * Map our ProcessStatus to Riwi Talent API status ID
   */
  private mapStatusToApiId(status: ProcessStatus): number {
    const apiStatusMap: Record<ProcessStatus, number> = {
      [ProcessStatus.DRAFT]: 0,
      [ProcessStatus.ACTIVE]: 1,      // En espera
      [ProcessStatus.IN_PROGRESS]: 3, // En proceso
      [ProcessStatus.COMPLETED]: 4,   // Finalizado
      [ProcessStatus.CANCELLED]: 5,   // Cancelado
      [ProcessStatus.ON_HOLD]: 1,     // Default to En espera
    };
    
    return apiStatusMap[status] ?? 1;
  }

  /**
   * Map priority (if not provided, default to MEDIUM)
   */
  private mapProcessPriority(priority: any): ProcessPriority {
    if (typeof priority === "number" && priority >= 1 && priority <= 4) {
      return priority as ProcessPriority;
    }
    return ProcessPriority.MEDIUM;
  }

  /**
   * Map skills from API
   */
  private mapSkills(skills: any[]): ProcessSkill[] {
    if (!Array.isArray(skills)) return [];
    
    return skills.map(skill => ({
      id: skill.id || skill.skillId,
      name: skill.name || skill.skillName || "",
      level: skill.level || skill.skillLevel || 1,
      required: skill.required ?? true,
    }));
  }

  /**
   * Map languages from API
   */
  private mapLanguages(languages: any[]): ProcessLanguage[] {
    if (!Array.isArray(languages)) return [];
    
    return languages.map(lang => ({
      id: lang.id || lang.languageId,
      code: lang.code || lang.languageCode || "EN",
      name: lang.name || lang.languageName || "",
      level: lang.level || lang.languageLevel || "B1",
      required: lang.required ?? false,
    }));
  }

  /**
   * Build query parameters from filters
   */
  private buildQueryParams(filters?: ProcessFilters): Record<string, any> {
    const params: Record<string, any> = {};
    
    // Don't filter by CompanyId in the query params - we'll filter in the response
    // The backend might not support this filter properly
    console.log("[ProcessRepository] Building query params without CompanyId filter");
    
    if (filters) {
      // Search parameter
      if (filters.search) {
        params.Search = filters.search;
      }
      
      // Status filter - map to API status IDs
      if (filters.status && filters.status.length > 0) {
        const statusIds = filters.status.map(s => this.mapStatusToApiId(s));
        // Don't filter by status if we want to see all
        // params.StatusId = statusIds.join(",");
      }
      
      // Priority filter
      if (filters.priority && filters.priority.length > 0) {
        params.Priority = filters.priority.join(",");
      }
      
      // Location filter
      if (filters.location) {
        params.Location = filters.location;
      }
      
      // Remote filter
      if (filters.remote !== undefined) {
        params.Remote = filters.remote;
      }
      
      // Salary filters
      if (filters.minSalary !== undefined) {
        params.MinSalary = filters.minSalary;
      }
      if (filters.maxSalary !== undefined) {
        params.MaxSalary = filters.maxSalary;
      }
      
      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        params.Tags = filters.tags.join(",");
      }
      
      // Pagination parameters (Riwi Talent format)
      params.PageNumber = filters.page || 1;
      params.PageSize = filters.pageSize || 12;
      
      // Sorting
      if (filters.sortBy) {
        params.OrderBy = filters.sortBy;
      }
      if (filters.sortOrder) {
        params.SortDir = filters.sortOrder;
      }
    } else {
      // Default pagination if no filters
      params.PageNumber = 1;
      params.PageSize = 12;
    }
    
    return params;
  }

  /**
   * Get all processes with filters
   */
  async findAll(filters?: ProcessFilters, token?: string): Promise<ProcessPaginatedResponse> {
    try {
      const queryParams = this.buildQueryParams(filters);
      console.log("[ProcessRepository] Fetching processes with params:", queryParams);
      console.log("[ProcessRepository] Company ID:", this.companyId);
      console.log("[ProcessRepository] Endpoint:", this.baseEndpoint);
      console.log("[ProcessRepository] Token provided:", !!token);
      
      // Use the new processApiClient that properly handles auth
      const response = await processApiClient.get<any>(this.baseEndpoint, queryParams, token);
      
      console.log("[ProcessRepository] Raw API response:", response);
      console.log("[ProcessRepository] Response type:", typeof response);
      console.log("[ProcessRepository] Has 'items' property:", 'items' in response);
      
      // Handle Riwi Talent paginated response format
      // Response structure: { items: [...], pageNumber: 1, pageSize: 20, totalCount: 8, ... }
      if (response && typeof response === 'object') {
        // Check if it's the paginated format with 'items' array
        if ('items' in response && Array.isArray(response.items)) {
          console.log("[ProcessRepository] Found 'items' array with", response.items.length, "items");
          console.log("[ProcessRepository] First item (if any):", response.items[0]);
          
          // Map all items without filtering by companyId first to see what we get
          const allProcesses = response.items.map((item: any) => {
            console.log("[ProcessRepository] Processing item with companyId:", item.companyId, "expected:", this.companyId);
            return this.mapToDomainEntity(item);
          });
          
          // Filter by companyId - only show processes from our company
          const processes = allProcesses.filter((process: any) => {
            const matches = process.companyId === this.companyId;
            if (!matches) {
              console.log("[ProcessRepository] Filtered out process:", process.name, "with companyId", process.companyId, "(expected", this.companyId, ")");
            } else {
              console.log("[ProcessRepository] ✓ Keeping process:", process.name, "with matching companyId", process.companyId);
            }
            return matches;
          });
          
          console.log("[ProcessRepository] After filtering:", processes.length, "processes match our company");
          
          return {
            data: processes,
            total: response.totalCount || processes.length,
            page: response.pageNumber || 1,
            pageSize: response.pageSize || processes.length,
            totalPages: response.totalPages || Math.ceil((response.totalCount || processes.length) / (response.pageSize || 12)),
            hasNextPage: response.hasNextPage ?? false,
            hasPreviousPage: response.hasPreviousPage ?? false,
          };
        }
        
        // Check if it's a direct array response (for backward compatibility)
        if (Array.isArray(response)) {
          const processes = response
            .filter((item: any) => item.companyId === this.companyId)
            .map((item: any) => this.mapToDomainEntity(item));
          
          return {
            data: processes,
            total: processes.length,
            page: 1,
            pageSize: processes.length,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          };
        }
        
        // Handle single object response (might be an error or single process)
        if ('data' in response && Array.isArray(response.data)) {
          const processes = response.data
            .filter((item: any) => item.companyId === this.companyId)
            .map((item: any) => this.mapToDomainEntity(item));
          
          return {
            data: processes,
            total: response.total || response.totalCount || processes.length,
            page: response.page || response.pageNumber || 1,
            pageSize: response.pageSize || processes.length,
            totalPages: response.totalPages || 1,
            hasNextPage: response.hasNextPage ?? false,
            hasPreviousPage: response.hasPreviousPage ?? false,
          };
        }
      }
      
      // Fallback for unexpected response format
      console.warn("Unexpected response format from processes API:", response);
      return {
        data: [],
        total: 0,
        page: filters?.page || 1,
        pageSize: filters?.pageSize || 12,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };
      
    } catch (error) {
      console.error("Error fetching processes:", error);
      
      // Return empty result set on error
      return {
        data: [],
        total: 0,
        page: filters?.page || 1,
        pageSize: filters?.pageSize || 12,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }
  }

  /**
   * Get process by ID
   */
  async findById(id: string): Promise<Process | null> {
    try {
      const response = await processApiClient.get<any>(`${this.baseEndpoint}/${id}`);
      
      // Handle different response formats
      const processData = response.data || response;
      
      // Verify it belongs to Wired People (the selected company)
      if (processData.companyId !== this.companyId) {
        console.warn(`Process ${id} does not belong to company ${this.companyId}`);
        return null;
      }
      
      return this.mapToDomainEntity(processData);
    } catch (error) {
      console.error(`Error fetching process ${id}:`, error);
      return null;
    }
  }

  /**
   * Create new process
   */
  async create(data: Partial<Process>): Promise<Process> {
    try {
      // Map to the exact format expected by the backend
      const apiData = {
        companyId: this.companyId, // Always use the configured company
        name: data.name || "",
        description: data.description || "",
        vacancies: data.vacancies || 1,
        statusId: 1, // Default to "En espera" (Active)
        skills: data.requiredSkills?.map(skill => ({
          name: skill.name,
          level: skill.level || 1
        })) || [],
        languages: data.requiredLanguages?.map(lang => ({
          code: lang.code,
          name: lang.name,
          level: lang.level || "B1"
        })) || [],
      };
      
      console.log("Creating process with data:", apiData);
      
      const response = await processApiClient.post<any>(this.baseEndpoint, apiData);
      console.log("Create process response:", response);
      
      // Handle the response which might be wrapped
      const processData = response.data || response;
      return this.mapToDomainEntity(processData);
    } catch (error) {
      console.error("Error creating process:", error);
      throw error;
    }
  }

  /**
   * Update process
   */
  async update(id: string, data: Partial<Process>): Promise<Process> {
    try {
      // First verify the process belongs to our company
      const existing = await this.findById(id);
      if (!existing) {
        throw new Error(`Process ${id} not found or does not belong to company ${this.companyId}`);
      }
      
      const apiData = this.mapToApiFormat(data);
      console.log(`Updating process ${id} with data:`, apiData);
      
      const response = await processApiClient.patch<any>(`${this.baseEndpoint}/${id}`, apiData);
      
      // Handle the response
      const processData = response.data || response;
      return this.mapToDomainEntity(processData);
    } catch (error) {
      console.error(`Error updating process ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete process
   */
  async delete(id: string): Promise<boolean> {
    try {
      // First verify the process belongs to our company
      const existing = await this.findById(id);
      if (!existing) {
        throw new Error(`Process ${id} not found or does not belong to company ${this.companyId}`);
      }
      
      await processApiClient.delete(`${this.baseEndpoint}/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting process ${id}:`, error);
      return false;
    }
  }

  /**
   * Get processes by status
   */
  async findByStatus(status: ProcessStatus): Promise<Process[]> {
    const response = await this.findAll({
      status: [status],
      pageSize: 100,
    });
    return response.data;
  }

  /**
   * Get active processes
   */
  async findActive(): Promise<Process[]> {
    const response = await this.findAll({
      status: [ProcessStatus.ACTIVE, ProcessStatus.IN_PROGRESS],
      pageSize: 100,
    });
    return response.data;
  }

  /**
   * Add candidates to process
   */
  async addCandidates(processId: string, candidateIds: string[]): Promise<boolean> {
    try {
      const response = await processApiClient.post<any>(
        `${this.baseEndpoint}/${processId}/students`,
        {
          studentIds: candidateIds,
        }
      );
      return response.success ?? true;
    } catch (error) {
      console.error(`Error adding candidates to process ${processId}:`, error);
      return false;
    }
  }

  /**
   * Remove candidate from process
   */
  async removeCandidate(processId: string, candidateId: string): Promise<boolean> {
    try {
      await processApiClient.delete(
        `${this.baseEndpoint}/${processId}/students/${candidateId}`
      );
      return true;
    } catch (error) {
      console.error(`Error removing candidate ${candidateId} from process ${processId}:`, error);
      return false;
    }
  }

  /**
   * Get process statistics
   */
  async getStatistics(token?: string): Promise<{
    total: number;
    active: number;
    completed: number;
    cancelled: number;
  }> {
    try {
      // First get all processes for our company to calculate statistics
      const allProcesses = await this.findAll({
        pageSize: 100,
      }, token);
      
      // Calculate statistics from the processes
      const stats = {
        total: allProcesses.total,
        active: 0,
        completed: 0,
        cancelled: 0,
      };
      
      // Count by status
      allProcesses.data.forEach(process => {
        switch (process.status) {
          case ProcessStatus.ACTIVE:
            stats.active++;
            break;
          case ProcessStatus.IN_PROGRESS:
            stats.active++; // Count IN_PROGRESS as active
            break;
          case ProcessStatus.COMPLETED:
            stats.completed++;
            break;
          case ProcessStatus.CANCELLED:
            stats.cancelled++;
            break;
        }
      });
      
      return stats;
    } catch (error) {
      console.error("Error fetching process statistics:", error);
      return {
        total: 0,
        active: 0,
        completed: 0,
        cancelled: 0,
      };
    }
  }
}

// Export singleton instance
export const processRepository = new ProcessRepository();