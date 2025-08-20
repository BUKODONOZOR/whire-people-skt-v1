/**
 * Process Server Actions
 * Path: src/features/processes/presentation/actions/process.actions.ts
 */

"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";
import { 
  ListProcessesUseCase,
  GetProcessUseCase,
  CreateProcessUseCase,
  UpdateProcessUseCase,
  DeleteProcessUseCase,
  AssignCandidatesUseCase,
  GetProcessStatisticsUseCase
} from "../../application/use-cases/";
import { 
  ProcessFilters, 
  CreateProcessDTO, 
  UpdateProcessDTO,
  AddCandidatesToProcessDTO 
} from "../../shared/types/process.types";
import { ProcessStatus } from "../../domain/value-objects/process-status.vo";
import { ProcessPriority } from "../../domain/value-objects/process-priority.vo";

// Validation schemas
const createProcessSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  vacancies: z.number().min(1).max(1000),
  priority: z.nativeEnum(ProcessPriority).optional(),
  location: z.string().optional(),
  remote: z.boolean().optional(),
  requiredSkills: z.array(z.object({
    name: z.string(),
    level: z.number().min(1).max(5),
    required: z.boolean(),
  })).optional(),
  requiredLanguages: z.array(z.object({
    code: z.string(),
    name: z.string(),
    level: z.string(),
    required: z.boolean(),
  })).optional(),
  minExperience: z.number().min(0).max(50).optional(),
  maxExperience: z.number().min(0).max(50).optional(),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  currency: z.string().optional(),
  deadline: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const updateProcessSchema = createProcessSchema.partial().extend({
  status: z.nativeEnum(ProcessStatus).optional(),
});

const processFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.array(z.nativeEnum(ProcessStatus)).optional(),
  priority: z.array(z.nativeEnum(ProcessPriority)).optional(),
  location: z.string().optional(),
  remote: z.boolean().optional(),
  minSalary: z.number().optional(),
  maxSalary: z.number().optional(),
  tags: z.array(z.string()).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

/**
 * Helper function to get token from cookies (server-side)
 */
async function getTokenFromCookies(): Promise<string | null> {
  try {
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get('token') || cookieStore.get('auth_token');
    return tokenCookie?.value || null;
  } catch (error) {
    console.error("[getTokenFromCookies] Error:", error);
    return null;
  }
}

/**
 * Get processes with filters
 */
export async function getProcessesAction(filters?: ProcessFilters, token?: string) {
  try {
    // Get token from parameter or try to get from cookies (server-side)
    const authToken = token || (await getTokenFromCookies());
    
    if (!authToken) {
      console.error("[getProcessesAction] No token available");
      return {
        success: false,
        data: null,
        error: "Authentication required",
      };
    }
    
    // Validate filters
    const validatedFilters = filters 
      ? processFiltersSchema.parse(filters) 
      : undefined;
    
    // Execute use case with token
    const useCase = new ListProcessesUseCase();
    const result = await useCase.execute(validatedFilters, authToken);
    
    return {
      success: true,
      data: result,
      error: null,
    };
  } catch (error) {
    console.error("Error in getProcessesAction:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to get processes",
    };
  }
}

/**
 * Get single process by ID
 */
export async function getProcessAction(id: string) {
  try {
    if (!id) {
      throw new Error("Process ID is required");
    }
    
    const useCase = new GetProcessUseCase();
    const process = await useCase.execute(id);
    
    if (!process) {
      return {
        success: false,
        data: null,
        error: "Process not found",
      };
    }
    
    return {
      success: true,
      data: process.toJSON ? process.toJSON() : process,
      error: null,
    };
  } catch (error) {
    console.error(`Error in getProcessAction for ID ${id}:`, error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to get process",
    };
  }
}

/**
 * Create new process
 */
export async function createProcessAction(data: CreateProcessDTO) {
  try {
    // Validate input
    const validatedData = createProcessSchema.parse(data);
    
    // Execute use case
    const useCase = new CreateProcessUseCase();
    const process = await useCase.execute(validatedData);
    
    // Revalidate pages
    revalidatePath("/processes");
    revalidatePath("/");
    
    return {
      success: true,
      data: process.toJSON ? process.toJSON() : process,
      error: null,
    };
  } catch (error) {
    console.error("Error in createProcessAction:", error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        error: error.errors[0].message,
      };
    }
    
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to create process",
    };
  }
}

/**
 * Update process
 */
export async function updateProcessAction(id: string, data: UpdateProcessDTO) {
  try {
    if (!id) {
      throw new Error("Process ID is required");
    }
    
    // Validate input
    const validatedData = updateProcessSchema.parse(data);
    
    // Execute use case
    const useCase = new UpdateProcessUseCase();
    const process = await useCase.execute(id, validatedData);
    
    // Revalidate pages
    revalidatePath("/processes");
    revalidatePath(`/processes/${id}`);
    
    return {
      success: true,
      data: process.toJSON ? process.toJSON() : process,
      error: null,
    };
  } catch (error) {
    console.error(`Error in updateProcessAction for ID ${id}:`, error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        error: error.errors[0].message,
      };
    }
    
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to update process",
    };
  }
}

/**
 * Delete process
 */
export async function deleteProcessAction(id: string) {
  try {
    if (!id) {
      throw new Error("Process ID is required");
    }
    
    // Execute use case
    const useCase = new DeleteProcessUseCase();
    const result = await useCase.execute(id);
    
    if (result) {
      // Revalidate pages
      revalidatePath("/processes");
      revalidatePath("/");
    }
    
    return {
      success: result,
      error: result ? null : "Failed to delete process",
    };
  } catch (error) {
    console.error(`Error in deleteProcessAction for ID ${id}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete process",
    };
  }
}

/**
 * Assign candidates to process
 */
export async function assignCandidatesToProcessAction(data: AddCandidatesToProcessDTO) {
  try {
    // Validate input
    if (!data.processId) {
      throw new Error("Process ID is required");
    }
    
    if (!data.candidateIds || data.candidateIds.length === 0) {
      throw new Error("At least one candidate must be selected");
    }
    
    // Execute use case
    const useCase = new AssignCandidatesUseCase();
    const result = await useCase.execute(data);
    
    if (result) {
      // Revalidate pages
      revalidatePath(`/processes/${data.processId}`);
      revalidatePath(`/processes/${data.processId}/candidates`);
    }
    
    return {
      success: result,
      error: result ? null : "Failed to assign candidates",
    };
  } catch (error) {
    console.error("Error in assignCandidatesToProcessAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to assign candidates",
    };
  }
}

/**
 * Change process status
 */
export async function changeProcessStatusAction(id: string, status: ProcessStatus) {
  try {
    if (!id) {
      throw new Error("Process ID is required");
    }
    
    // Execute update with just status change
    const useCase = new UpdateProcessUseCase();
    const process = await useCase.execute(id, { status });
    
    // Revalidate pages
    revalidatePath("/processes");
    revalidatePath(`/processes/${id}`);
    
    return {
      success: true,
      data: process.toJSON ? process.toJSON() : process,
      error: null,
    };
  } catch (error) {
    console.error(`Error in changeProcessStatusAction for ID ${id}:`, error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to change process status",
    };
  }
}

/**
 * Get process statistics
 */
export async function getProcessStatisticsAction(token?: string) {
  try {
    // Get token from parameter or cookies
    const authToken = token || (await getTokenFromCookies());
    
    if (!authToken) {
      return {
        success: false,
        data: null,
        error: "Authentication required",
      };
    }
    
    const useCase = new GetProcessStatisticsUseCase();
    const stats = await useCase.execute(authToken);
    
    return {
      success: true,
      data: stats,
      error: null,
    };
  } catch (error) {
    console.error("Error in getProcessStatisticsAction:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to get statistics",
    };
  }
}

/**
 * Search processes
 */
export async function searchProcessesAction(query: string) {
  try {
    if (!query || query.trim().length === 0) {
      return {
        success: true,
        data: [],
        error: null,
      };
    }
    
    const filters: ProcessFilters = {
      search: query,
      pageSize: 10,
      status: [ProcessStatus.ACTIVE, ProcessStatus.IN_PROGRESS],
    };
    
    const useCase = new ListProcessesUseCase();
    const result = await useCase.execute(filters);
    
    return {
      success: true,
      data: result.data,
      error: null,
    };
  } catch (error) {
    console.error("Error in searchProcessesAction:", error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "Failed to search processes",
    };
  }
}

/**
 * Get active processes
 */
export async function getActiveProcessesAction() {
  try {
    const filters: ProcessFilters = {
      status: [ProcessStatus.ACTIVE, ProcessStatus.IN_PROGRESS],
      sortBy: "createdAt",
      sortOrder: "desc",
      pageSize: 100,
    };
    
    const useCase = new ListProcessesUseCase();
    const result = await useCase.execute(filters);
    
    return {
      success: true,
      data: result.data,
      error: null,
    };
  } catch (error) {
    console.error("Error in getActiveProcessesAction:", error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "Failed to get active processes",
    };
  }
}