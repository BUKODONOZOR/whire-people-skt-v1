/**
 * Update Process Use Case
 * Path: src/features/processes/application/use-cases/update-process.use-case.ts
 */

import { IProcessRepository } from "../../domain/repositories/process.repository.interface";
import { processRepository } from "../../infrastructure/repositories/process.repository.impl";
import { UpdateProcessDTO } from "../../shared/types/process.types";
import { Process } from "../../domain/entities/process.entity";
import { ProcessStatus } from "../../domain/value-objects/process-status.vo";

export class UpdateProcessUseCase {
  constructor(
    private readonly repository: IProcessRepository = processRepository
  ) {}

  async execute(id: string, data: UpdateProcessDTO): Promise<Process> {
    if (!id) {
      throw new Error("Process ID is required");
    }

    try {
      // Get existing process
      const existingProcess = await this.repository.findById(id);
      
      if (!existingProcess) {
        throw new Error(`Process with ID ${id} not found`);
      }
      
      // Check if process can be updated
      if (!existingProcess.isEditable) {
        throw new Error("Process cannot be updated in its current status");
      }
      
      // Validate updates
      this.validateUpdates(data, existingProcess);
      
      // Apply updates to domain entity
      if (data.name !== undefined) existingProcess.name = data.name;
      if (data.description !== undefined) existingProcess.description = data.description;
      if (data.vacancies !== undefined) existingProcess.vacancies = data.vacancies;
      if (data.priority !== undefined) existingProcess.priority = data.priority;
      if (data.deadline !== undefined) {
        existingProcess.deadline = data.deadline ? new Date(data.deadline) : undefined;
      }
      
      // Handle status changes through domain methods
      if (data.status !== undefined && data.status !== existingProcess.status) {
        this.handleStatusChange(existingProcess, data.status);
      }
      
      // Save to repository
      const updatedProcess = await this.repository.update(id, existingProcess);
      
      return updatedProcess;
    } catch (error) {
      console.error(`Error in UpdateProcessUseCase for ID ${id}:`, error);
      throw error;
    }
  }

  private validateUpdates(data: UpdateProcessDTO, existingProcess: Process): void {
    if (data.name !== undefined) {
      if (!data.name || data.name.trim().length === 0) {
        throw new Error("Process name cannot be empty");
      }
      if (data.name.length > 200) {
        throw new Error("Process name must be less than 200 characters");
      }
    }
    
    if (data.vacancies !== undefined) {
      if (data.vacancies < 1) {
        throw new Error("At least one vacancy is required");
      }
      if (data.vacancies > 1000) {
        throw new Error("Maximum 1000 vacancies allowed");
      }
    }
    
    if (data.salaryMin !== undefined || data.salaryMax !== undefined) {
      const minSalary = data.salaryMin ?? existingProcess.salaryMin;
      const maxSalary = data.salaryMax ?? existingProcess.salaryMax;
      if (minSalary && maxSalary && minSalary > maxSalary) {
        throw new Error("Minimum salary cannot be greater than maximum salary");
      }
    }
    
    if (data.deadline) {
      const deadline = new Date(data.deadline);
      if (deadline < new Date()) {
        throw new Error("Deadline cannot be in the past");
      }
    }
  }

  private handleStatusChange(process: Process, newStatus: ProcessStatus): void {
    switch (newStatus) {
      case ProcessStatus.ACTIVE:
        process.activate();
        break;
      case ProcessStatus.ON_HOLD:
        process.suspend();
        break;
      case ProcessStatus.COMPLETED:
        process.complete();
        break;
      case ProcessStatus.CANCELLED:
        process.cancel();
        break;
      default:
        throw new Error(`Cannot change to status ${newStatus}`);
    }
  }
}
