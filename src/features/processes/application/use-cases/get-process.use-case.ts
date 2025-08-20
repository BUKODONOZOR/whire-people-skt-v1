
/**
 * Get Process Use Case
 * Path: src/features/processes/application/use-cases/get-process.use-case.ts
 */

import { Process } from "../../domain/entities/process.entity";
import { IProcessRepository } from "../../domain/repositories/process.repository.interface";
import { processRepository } from "../../infrastructure/repositories/process.repository.impl";

export class GetProcessUseCase {
  constructor(
    private readonly repository: IProcessRepository = processRepository
  ) {}

  async execute(id: string): Promise<Process | null> {
    if (!id) {
      throw new Error("Process ID is required");
    }

    try {
      const process = await this.repository.findById(id);
      
      if (!process) {
        return null;
      }

      // Could add additional business logic here
      // e.g., check permissions, enrich with additional data, etc.
      
      return process;
    } catch (error) {
      console.error(`Error in GetProcessUseCase for ID ${id}:`, error);
      throw new Error("Failed to get process");
    }
  }
}