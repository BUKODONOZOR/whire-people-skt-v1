import { talentRepository } from "@/features/talent/repositories/talent.repository";
import { enhanceTalentData } from "@/shared/utils/mock-data.utils";
import type {
  Talent,
  TalentPaginatedResponse,
  TalentFilters,
  CreateTalentDTO,
  UpdateTalentDTO,
} from "@/features/talent/types/talent.types";

/**
 * Talent Service for Client Components
 * This service is used in Client Components with React Query
 */
class TalentClientService {
  /**
   * Get talents
   */
  async getTalents(filters?: TalentFilters): Promise<TalentPaginatedResponse> {
    try {
      const response = await talentRepository.findAll(filters);
      
      // Enhance talent data with mock details for better presentation
      const enhancedData = response.data.map((talent, index) => 
        enhanceTalentData(talent, ((filters?.page || 1) - 1) * (filters?.pageSize || 12) + index)
      );
      
      return {
        ...response,
        data: enhancedData
      };
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
  }

  /**
   * Get single talent by ID
   */
  async getTalentById(id: string): Promise<Talent | null> {
    try {
      const talent = await talentRepository.findById(id);
      // Enhance single talent data
      return talent ? enhanceTalentData(talent) : null;
    } catch (error) {
      console.error(`Error getting talent ${id}:`, error);
      return null;
    }
  }

  /**
   * Get available talents
   */
  async getAvailableTalents(filters?: Omit<TalentFilters, "status">): Promise<TalentPaginatedResponse> {
    return await talentRepository.getAvailableTalents(filters);
  }

  /**
   * Search talents by skill
   */
  async searchBySkill(skillName: string, level?: number): Promise<Talent[]> {
    return await talentRepository.searchBySkill(skillName, level);
  }

  /**
   * Get talent statistics
   */
  async getStatistics() {
    return await talentRepository.getStatistics();
  }

  /**
   * Create new talent
   */
  async createTalent(data: CreateTalentDTO): Promise<Talent> {
    return await talentRepository.create(data);
  }

  /**
   * Update talent
   */
  async updateTalent(id: string, data: UpdateTalentDTO): Promise<Talent> {
    return await talentRepository.update(id, data);
  }

  /**
   * Delete talent
   */
  async deleteTalent(id: string): Promise<void> {
    return await talentRepository.delete(id);
  }

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
}

// Export singleton instance for client
export const talentClientService = new TalentClientService();