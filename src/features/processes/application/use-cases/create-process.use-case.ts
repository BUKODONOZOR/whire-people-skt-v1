/**
 * Create Process Use Case
 * Path: src/features/processes/application/use-cases/create-process.use-case.ts
 */

import { CreateProcessDTO } from "../../shared/types/process.types";
import { WIRED_PEOPLE_COMPANY_ID, WIRED_PEOPLE_COMPANY_NAME } from "../../shared/constants/process.constants";
import { IProcessRepository } from "../../domain/repositories/process.repository.interface";
import { processRepository } from "../../infrastructure/repositories/process.repository.impl";
import { Process } from "../../domain/entities/process.entity";

export class CreateProcessUseCase {
  constructor(
    private readonly repository: IProcessRepository = processRepository
  ) {}

  async execute(data: CreateProcessDTO): Promise<Process> {
    try {
      // Validate input
      this.validateInput(data);
      
      // Create domain entity
      const process = Process.create({
        ...data,
        companyId: WIRED_PEOPLE_COMPANY_ID,
        companyName: WIRED_PEOPLE_COMPANY_NAME,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
      });
      
      // Save to repository
      const savedProcess = await this.repository.create(process);
      
      return savedProcess;
    } catch (error) {
      console.error("Error in CreateProcessUseCase:", error);
      throw new Error("Failed to create process");
    }
  }

  private validateInput(data: CreateProcessDTO): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error("Process name is required");
    }
    
    if (data.name.length > 200) {
      throw new Error("Process name must be less than 200 characters");
    }
    
    if (data.vacancies < 1) {
      throw new Error("At least one vacancy is required");
    }
    
    if (data.vacancies > 1000) {
      throw new Error("Maximum 1000 vacancies allowed");
    }
    
    if (data.salaryMin && data.salaryMax && data.salaryMin > data.salaryMax) {
      throw new Error("Minimum salary cannot be greater than maximum salary");
    }
    
    if (data.minExperience && data.maxExperience && data.minExperience > data.maxExperience) {
      throw new Error("Minimum experience cannot be greater than maximum experience");
    }
    
    if (data.deadline) {
      const deadline = new Date(data.deadline);
      if (deadline < new Date()) {
        throw new Error("Deadline cannot be in the past");
      }
    }
  }
}
