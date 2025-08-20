
/**
 * Assign Candidates Use Case
 * Path: src/features/processes/application/use-cases/assign-candidates.use-case.ts
 */
import { AddCandidatesToProcessDTO } from "../../shared/types/process.types";
import { IProcessRepository } from "../../domain/repositories/process.repository.interface";
import { processRepository } from "../../infrastructure/repositories/process.repository.impl";

export class AssignCandidatesUseCase {
  constructor(
    private readonly repository: IProcessRepository = processRepository
  ) {}

  async execute(data: AddCandidatesToProcessDTO): Promise<boolean> {
    const { processId, candidateIds } = data;
    
    if (!processId) {
      throw new Error("Process ID is required");
    }
    
    if (!candidateIds || candidateIds.length === 0) {
      throw new Error("At least one candidate ID is required");
    }

    try {
      // Get existing process
      const process = await this.repository.findById(processId);
      
      if (!process) {
        throw new Error(`Process with ID ${processId} not found`);
      }
      
      // Check if process can receive candidates
      if (!process.canAddCandidates) {
        throw new Error("Cannot add candidates to this process in its current status");
      }
      
      // Check capacity
      const availableSlots = process.vacancies - process.activeCandidates;
      if (candidateIds.length > availableSlots) {
        throw new Error(`Cannot add ${candidateIds.length} candidates. Only ${availableSlots} slots available`);
      }
      
      // Add candidates to process
      const result = await this.repository.addCandidates(processId, candidateIds);
      
      return result;
    } catch (error) {
      console.error(`Error in AssignCandidatesUseCase for process ${processId}:`, error);
      throw error;
    }
  }
}
