/**
 * Main export file for processes module
 * Path: src/features/processes/index.ts
 */

// Domain
export * from "./domain/entities";
export * from "./domain/value-objects";

// Application
export * from "./application/use-cases";

// Infrastructure
export { processRepository } from "./infrastructure/repositories/process.repository.impl";

// Presentation - Components
export * from "./presentation/components";

// Presentation - Hooks
export { useProcesses, useProcessStatistics } from "./presentation/hooks/use-processes";

// Presentation - Actions
export * from "./presentation/actions/process.actions";

// Types
export * from "./shared/types/process.types";

// Constants
export * from "./shared/constants/process.constants";