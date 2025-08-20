/**
 * Skills Service
 * Path: src/features/processes/infrastructure/services/skills.service.ts
 */

import { httpClient } from "@/infrastructure/http/http-client";

export interface Skill {
  id: string;
  name: string;
  stackId?: number;
  stackName?: string;
}

class SkillsService {
  private baseEndpoint = "/v1/skills";
  private cachedSkills: Skill[] | null = null;
  private lastFetch: number = 0;
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  /**
   * Get all available skills
   */
  async getAllSkills(): Promise<Skill[]> {
    try {
      // Return cached if still valid
      if (this.cachedSkills && (Date.now() - this.lastFetch) < this.cacheTimeout) {
        return this.cachedSkills;
      }

      const response = await httpClient.get<any[]>(this.baseEndpoint);
      
      // Map response to our Skill interface
      const skills = (response || []).map(skill => ({
        id: skill.id || skill.skillId,
        name: skill.name || skill.skillName || "",
        stackId: skill.stackId,
        stackName: skill.stackName,
      }));

      // Update cache
      this.cachedSkills = skills;
      this.lastFetch = Date.now();

      return skills;
    } catch (error) {
      console.error("Error fetching skills:", error);
      return this.cachedSkills || [];
    }
  }

  /**
   * Search skills by name
   */
  async searchSkills(query: string): Promise<Skill[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const allSkills = await this.getAllSkills();
    const searchTerm = query.toLowerCase();
    
    return allSkills.filter(skill => 
      skill.name.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Get popular/common skills
   */
  async getPopularSkills(): Promise<Skill[]> {
    const popularSkillNames = [
      "JavaScript", "TypeScript", "React", "Node.js", "Python",
      "Java", "C#", ".NET", "SQL", "MongoDB", "AWS", "Docker",
      "Git", "REST API", "GraphQL", "HTML", "CSS", "Angular",
      "Vue.js", "PHP", "Laravel", "Spring Boot", "Kubernetes"
    ];

    const allSkills = await this.getAllSkills();
    
    return allSkills.filter(skill => 
      popularSkillNames.some(name => 
        skill.name.toLowerCase() === name.toLowerCase()
      )
    ).slice(0, 20);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cachedSkills = null;
    this.lastFetch = 0;
  }
}

export const skillsService = new SkillsService();