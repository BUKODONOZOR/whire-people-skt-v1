/**
 * Delete Process Use Case
 * Path: src/features/processes/application/use-cases/delete-process.use-case.ts
 */

import { IProcessRepository } from "../../domain/repositories/process.repository.interface";
import { processRepository } from "../../infrastructure/repositories/process.repository.impl";
import { ProcessStatus } from "../../domain/value-objects/process-status.vo";

export class DeleteProcessUseCase {
  constructor(
    private readonly repository: IProcessRepository = processRepository
  ) {}

  async execute(id: string): Promise<boolean> {
    if (!id) {
      throw new Error("Process ID is required");
    }

    try {
      // Get existing process
      const existingProcess = await this.repository.findById(id);
      
      if (!existingProcess) {
        throw new Error(`Process with ID ${id} not found`);
      }
      
      // Check if process can be deleted
      if (existingProcess.status === ProcessStatus.IN_PROGRESS) {
        throw new Error("Cannot delete a process that is in progress");
      }
      
      if (existingProcess.hiredCandidates > 0) {
        throw new Error("Cannot delete a process with hired candidates");
      }
      
      // Delete from repository
      const result = await this.repository.delete(id);
      
      return result;
    } catch (error) {
      console.error(`Error in DeleteProcessUseCase for ID ${id}:`, error);
      throw error;
    }
  }
}