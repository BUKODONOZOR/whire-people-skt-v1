
/**
 * Get Process Statistics Use Case
 * Path: src/features/processes/application/use-cases/get-statistics.use-case.ts
 */

import { IProcessRepository } from "../../domain/repositories/process.repository.interface";
import { processRepository } from "../../infrastructure/repositories/process.repository.impl";

export class GetProcessStatisticsUseCase {
  constructor(
    private readonly repository: IProcessRepository = processRepository
  ) {}

  async execute(token?: string): Promise<{
    total: number;
    active: number;
    completed: number;
    cancelled: number;
    successRate: number;
    averageTimeToHire: number;
  }> {
    try {
      const stats = await this.repository.getStatistics(token);
      
      // Calculate additional metrics
      const successRate = stats.total > 0 
        ? Math.round((stats.completed / stats.total) * 100) 
        : 0;
      
      // This would need more data from the repository
      const averageTimeToHire = 30; // Default placeholder
      
      return {
        ...stats,
        successRate,
        averageTimeToHire,
      };
    } catch (error) {
      console.error("Error in GetProcessStatisticsUseCase:", error);
      return {
        total: 0,
        active: 0,
        completed: 0,
        cancelled: 0,
        successRate: 0,
        averageTimeToHire: 0,
      };
    }
  }
}