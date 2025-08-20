import { talentRepository } from "@/features/talent/repositories/talent.repository";
import type {
  Talent,
  TalentPaginatedResponse,
  TalentFilters,
  CreateTalentDTO,
  UpdateTalentDTO,
} from "@/features/talent/types/talent.types";
import { cache } from "react";

/**
 * Talent Service for Server Components
 * This service is used in Server Components and can access cookies
 */
class TalentServerService {
  /**
   * Get talents with caching for Server Components
   */
  getTalents = cache(async (filters?: TalentFilters): Promise<TalentPaginatedResponse> => {
    try {
      // Note: The token will be set by the middleware or client-side
      return await talentRepository.findAll(filters);
    } catch (error) {
      console.error("Error in getTalents service:", error);
      return {
        data: [],
        total: 0,
        page: filters?.page || 1,
        pageSize: filters?.pageSize || 10,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }
  });

  /**
   * Get single talent by ID with caching
   */
  getTalentById = cache(async (id: string): Promise<Talent | null> => {
    try {
      return await talentRepository.findById(id);
    } catch (error) {
      console.error(`Error getting talent ${id}:`, error);
      return null;
    }
  });

  /**
   * Get available talents
   */
  getAvailableTalents = cache(async (filters?: Omit<TalentFilters, "status">): Promise<TalentPaginatedResponse> => {
    return await talentRepository.getAvailableTalents(filters);
  });

  /**
   * Search talents by skill
   */
  searchBySkill = cache(async (skillName: string, level?: number): Promise<Talent[]> => {
    return await talentRepository.searchBySkill(skillName, level);
  });

  /**
   * Get talent statistics
   */
  getStatistics = cache(async () => {
    return await talentRepository.getStatistics();
  });

  /**
   * Build default filters
   */
  getDefaultFilters(): TalentFilters {
    return {
      page: 1,
      pageSize: 12,
      sortBy: "score",
      sortOrder: "desc",
      status: [1], // Available by default
    };
  }

  /**
   * Validate filters
   */
  validateFilters(filters: TalentFilters): TalentFilters {
    const validated = { ...filters };
    
    // Ensure page is positive
    if (validated.page && validated.page < 1) {
      validated.page = 1;
    }
    
    // Ensure pageSize is reasonable
    if (validated.pageSize) {
      if (validated.pageSize < 1) validated.pageSize = 1;
      if (validated.pageSize > 100) validated.pageSize = 100;
    }
    
    // Ensure scores are valid
    if (validated.minScore && validated.minScore < 0) validated.minScore = 0;
    if (validated.maxScore && validated.maxScore > 100) validated.maxScore = 100;
    
    return validated;
  }

  /**
   * Format talent for display
   */
  formatTalentDisplay(talent: Talent): {
    fullName: string;
    initials: string;
    displayTitle: string;
    statusLabel: string;
    statusColor: string;
  } {
    const fullName = `${talent.firstName} ${talent.lastName}`.trim();
    const initials = `${talent.firstName[0]}${talent.lastName[0]}`.toUpperCase();
    
    return {
      fullName,
      initials,
      displayTitle: talent.title || "Professional",
      statusLabel: this.getStatusLabel(talent.status),
      statusColor: this.getStatusColor(talent.status),
    };
  }

  /**
   * Get status label
   */
  private getStatusLabel(status: number): string {
    const labels: Record<number, string> = {
      1: "Available",
      2: "In Process",
      3: "Hired",
      4: "Not Available",
      5: "Rejected",
    };
    return labels[status] || "Unknown";
  }

  /**
   * Get status color
   */
  private getStatusColor(status: number): string {
    const colors: Record<number, string> = {
      1: "success",
      2: "warning",
      3: "info",
      4: "muted",
      5: "destructive",
    };
    return colors[status] || "default";
  }
}

// Export singleton instance for server
export const talentServerService = new TalentServerService();