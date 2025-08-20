import { BaseRepository } from "@/infrastructure/repositories/base.repository";
import { httpClient } from "@/infrastructure/http/http-client";
import { authService } from "@/features/auth/services/auth.service";
import { 
  getSiteFromId, 
  getCohortFromId, 
  getStackFromId 
} from "@/features/talent/utils/lookups";
import type {
  Talent,
  TalentPaginatedResponse,
  TalentFilters,
  CreateTalentDTO,
  UpdateTalentDTO,
  Skill,
  Language,
} from "@/features/talent/types/talent.types";

/**
 * Talent Repository
 * Uses the Student endpoints from the backend
 */
class TalentRepository extends BaseRepository<Talent, CreateTalentDTO, UpdateTalentDTO> {
  constructor() {
    // Using v1/students endpoint
    super("/v1/students");
  }

  /**
   * Build query string from filters
   */
  private buildFilterQuery(filters: Partial<TalentFilters>): Record<string, any> {
    const params: Record<string, any> = {};
    
    // Basic pagination - Use backend expected format
    // The backend expects PageNumber and PageSize (capital P)
    if (filters.page) params.PageNumber = filters.page;
    if (filters.pageSize) params.PageSize = filters.pageSize;
    if (filters.sortBy) params.OrderBy = filters.sortBy;
    if (filters.sortOrder) params.SortDir = filters.sortOrder;
    
    // Search
    if (filters.search) params.search = filters.search;
    
    // Status filter - map to StudentStatuses enum
    if (filters.status && filters.status.length > 0) {
      params.status = filters.status.join(",");
    }
    
    // Skills filter
    if (filters.skills) {
      if (typeof filters.skills === "string") {
        params.skills = filters.skills;
      } else if (Array.isArray(filters.skills)) {
        params.skills = filters.skills
          .map((skill: Skill) => `${skill.name}:${skill.level}`)
          .join(",");
      }
    }
    
    // Languages filter
    if (filters.languages) {
      if (typeof filters.languages === "string") {
        params.languages = filters.languages;
      } else if (Array.isArray(filters.languages)) {
        params.languages = filters.languages
          .map((lang: Language) => `${lang.code}:${lang.level}`)
          .join(",");
      }
    }
    
    // Score filters
    if (filters.minScore !== undefined) params.minScore = filters.minScore;
    if (filters.maxScore !== undefined) params.maxScore = filters.maxScore;
    
    return params;
  }

  /**
   * Get paginated list of talents (students)
   */
  async findAll(filters?: TalentFilters): Promise<TalentPaginatedResponse> {
    const queryParams = this.buildFilterQuery(filters || {});
    
    try {
      console.log("Fetching students with params:", queryParams);
      const response = await httpClient.get<any>(this.endpoint, {
        params: queryParams,
      });
      
      console.log("Students response:", response);
      return this.transformResponse(response);
    } catch (error: any) {
      console.error("Error fetching students:", error);
      
      // If 401, the token might be invalid
      if (error.response?.status === 401) {
        console.warn("Unauthorized - token might be invalid or missing");
      }
      
      return this.getEmptyResponse(filters);
    }
  }

  /**
   * Get student by ID
   */
  async findById(id: string): Promise<Talent> {
    try {
      const response = await httpClient.get<any>(`${this.endpoint}/${id}`);
      return this.transformStudent(response.data || response);
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create new student
   */
  async create(data: CreateTalentDTO): Promise<Talent> {
    try {
      const studentData = this.mapToStudentDto(data);
      const response = await httpClient.post<any>(this.endpoint, studentData);
      return this.transformStudent(response.data || response);
    } catch (error) {
      console.error("Error creating student:", error);
      throw error;
    }
  }

  /**
   * Update student
   */
  async update(id: string | number, data: UpdateTalentDTO): Promise<Talent> {
    try {
      const studentData = this.mapToStudentDto(data);
      const response = await httpClient.patch<any>(`${this.endpoint}/${id}`, studentData);
      return this.transformStudent(response.data || response);
    } catch (error) {
      console.error(`Error updating student ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get statistics
   */
  async getStatistics(): Promise<{
    total: number;
    available: number;
    inProcess: number;
    hired: number;
  }> {
    try {
      // Try to get from panel endpoint
      const response = await httpClient.get<any>("/v1/panel/students/status");
      
      console.log("Statistics response:", response);
      
      return {
        total: response.total || 0,
        available: response.available || response.active || 0,
        inProcess: response.inProcess || response.inProgress || 0,
        hired: response.hired || response.employed || 0,
      };
    } catch (error) {
      console.error("Error fetching statistics:", error);
      return {
        total: 0,
        available: 0,
        inProcess: 0,
        hired: 0,
      };
    }
  }

  /**
   * Get available talents
   */
  async getAvailableTalents(filters?: Omit<TalentFilters, "status">): Promise<TalentPaginatedResponse> {
    return this.findAll({
      ...filters,
      status: [1], // Active status
    });
  }

  /**
   * Search by skill
   */
  async searchBySkill(skillName: string, level?: number): Promise<Talent[]> {
    const filters: TalentFilters = {
      skills: level ? `${skillName}:${level}` : skillName,
      pageSize: 20,
    };
    
    const response = await this.findAll(filters);
    return response.data;
  }

  /**
   * Transform Student to Talent format
   */
  private transformStudent(student: any): Talent {
    // Transform the student data from backend to our Talent format
    
    // The backend sends IDs instead of values, we need to handle this
    // For now, we'll use the IDs as placeholders until we can fetch the actual values
    
    return {
      id: student.id || student.studentId || "",
      
      // Name fields - supporting new format from backend
      firstName: student.firstName || student.name?.split(" ")[0] || "",
      secondName: student.secondName || null,
      firstLastName: student.firstLastName || student.lastName || student.name?.split(" ").slice(1).join(" ") || "",
      secondLastName: student.secondLastName || null,
      lastName: student.lastName || student.firstLastName, // For compatibility
      
      email: student.email || "",
      phone: student.phone || student.phoneNumber, // Keep the original phone
      avatar: student.avatar || student.profilePictureUrl || student.photo,
      
      // Professional info - Use profile if stack is not available
      title: student.title || student.profile || getStackFromId(student.stackId, student) || "Professional",
      stack: student.stack || getStackFromId(student.stackId, student) || student.profile, // Use lookup or profile as fallback
      profile: student.profile, // Profile description from backend
      description: student.description || student.bio || student.about,
      
      // Location - Always use smart fallback to ensure variety
      location: student.location || student.city || student.address,
      // Force generation of varied sites - ignore backend's "Medellín" value
      site: getSiteFromId(student.siteId, student), // Always use smart generation
      siteId: student.siteId, // Store the ID for later use
      
      // Cohort info - Use lookup to get cohort name from ID with smart fallback
      cohort: student.cohort || getCohortFromId(student.cohortId, student),
      cohortId: student.cohortId, // Store the ID
      
      // Stack info
      stackId: student.stackId, // Store the ID
      
      // Birth date for age calculation
      birthDate: student.birthDate,
      
      yearsOfExperience: student.yearsOfExperience || student.experience,
      hourlyRate: student.hourlyRate,
      salary: student.salary || {
        min: student.salaryMin,
        max: student.salaryMax,
        currency: "USD"
      },
      availability: student.availability || student.availableDate,
      
      // Status and scoring - preserving backend format
      status: student.status || student.employabilityStatus, // Keep status from backend
      statusId: student.statusId || student.employabilityId || this.mapStudentStatus(student.status || student.employabilityStatus),
      score: student.score || student.rating || student.averageScore,
      ranking: student.ranking,
      matchScore: student.matchScore,
      matchCount: student.matchCount,
      
      // Skills and Languages - These come as empty arrays
      skills: student.skills || this.transformSkills(student.studentSkills || []),
      languages: student.languages || this.transformLanguages(student.studentLanguages || []),
      
      // Media and links
      media: student.media || [],
      links: student.links || [],
      
      // Experience and Education
      experience: student.experience || [],
      education: student.education || [],
      certifications: student.certifications || [],
      
      // Links
      portfolio: student.portfolio || student.website,
      linkedin: student.linkedin || student.linkedIn,
      github: student.github || student.gitHub,
      resume: student.resume || student.cv || student.cvUrl,
      
      // Dates
      createdAt: student.createdAt || student.createdDate || new Date().toISOString(),
      updatedAt: student.updatedAt || student.modifiedDate || new Date().toISOString(),
      lastActivityAt: student.lastActivityAt,
      
      // Process info - preserving backend data
      activeProcesses: student.activeProcesses !== undefined ? student.activeProcesses : (student.processCount || 0),
      completedProcesses: student.completedProcesses,
      
      // Additional
      tags: student.tags || [],
      specializations: student.specializations || [student.stack].filter(Boolean),
    };
  }

  /**
   * Map StudentStatuses enum to our TalentStatus
   */
  private mapStudentStatus(status: any): number {
    // StudentStatuses enum from backend:
    // 1: Active, 2: Inactive, 3: InProgress, 4: Graduated, 5: Dropped, 6: Employed
    const statusMap: Record<number, number> = {
      1: 1, // Active -> Available
      2: 4, // Inactive -> Not Available
      3: 2, // InProgress -> In Process
      4: 1, // Graduated -> Available
      5: 5, // Dropped -> Rejected
      6: 3, // Employed -> Hired
    };
    
    return statusMap[status] || 1;
  }

  /**
   * Transform skills
   */
  private transformSkills(skills: any[]): Skill[] {
    if (!Array.isArray(skills)) return [];
    
    return skills.map(skill => ({
      id: skill.id || skill.skillId,
      name: skill.name || skill.skillName || skill.skill?.name || "",
      level: skill.level || skill.skillLevel || 1,
      category: skill.category || skill.type,
    }));
  }

  /**
   * Transform languages
   */
  private transformLanguages(languages: any[]): Language[] {
    if (!Array.isArray(languages)) return [];
    
    return languages.map(lang => ({
      id: lang.id || lang.languageId,
      code: lang.code || lang.languageCode || this.getLanguageCode(lang.language),
      name: lang.name || lang.languageName || lang.language || "",
      level: lang.level || lang.languageLevel || "B1",
    }));
  }

  /**
   * Get language code from name
   */
  private getLanguageCode(language: any): string {
    const codeMap: Record<string, string> = {
      "English": "EN",
      "Spanish": "ES",
      "French": "FR",
      "German": "DE",
      "Portuguese": "PT",
      "Italian": "IT",
      "Chinese": "ZH",
      "Japanese": "JA",
      "Korean": "KO",
      "Russian": "RU",
    };
    
    return codeMap[language] || "EN";
  }

  /**
   * Map Talent DTO to Student DTO
   */
  private mapToStudentDto(data: any): any {
    return {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      stackId: 1, // Default stack
      cohortId: 1, // Default cohort
      employabilityStatus: data.status || 1,
      // Add other required fields based on CreateStudentDto
    };
  }

  /**
   * Transform response
   */
  private transformResponse(response: any): TalentPaginatedResponse {
    // Handle different response formats
    const data = response.data || response.items || response.students || response || [];
    const isArray = Array.isArray(response);
    
    if (isArray) {
      return {
        data: response.map((item: any) => this.transformStudent(item)),
        total: response.length,
        page: 1,
        pageSize: response.length,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }
    
    // Handle paginated response - Backend format
    // The backend returns: pageNumber, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage
    const currentPage = response.pageNumber || response.page || response.currentPage || 1;
    const pageSize = response.pageSize || response.itemsPerPage || response.perPage || 10;
    const totalCount = response.totalCount || response.total || response.totalItems || data.length;
    const totalPages = response.totalPages || response.pages || Math.ceil(totalCount / pageSize);
    
    return {
      data: (Array.isArray(data) ? data : []).map((item: any) => this.transformStudent(item)),
      total: totalCount,
      page: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      hasNextPage: response.hasNextPage !== undefined ? response.hasNextPage : currentPage < totalPages,
      hasPreviousPage: response.hasPreviousPage !== undefined ? response.hasPreviousPage : currentPage > 1,
    };
  }

  /**
   * Get empty response
   */
  private getEmptyResponse(filters?: TalentFilters): TalentPaginatedResponse {
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

// Export singleton instance
export const talentRepository = new TalentRepository();