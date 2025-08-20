/**
 * useProcesses Hook
 * Path: src/features/processes/presentation/hooks/use-processes.ts
 */

"use client";

import { useState, useEffect, useTransition } from "react";
import { 
  getProcessesAction, 
  getProcessAction,
  createProcessAction,
  updateProcessAction,
  deleteProcessAction,
  getProcessStatisticsAction
} from "../actions/process.actions";
import { ProcessFilters, CreateProcessDTO, UpdateProcessDTO } from "../../shared/types/process.types";

export function useProcesses(initialFilters?: ProcessFilters) {
  const [processes, setProcesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProcessFilters>(initialFilters || {
    page: 1,
    pageSize: 12,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 12,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [isPending, startTransition] = useTransition();

  // Load processes
  const loadProcesses = async (customFilters?: ProcessFilters) => {
    setLoading(true);
    setError(null);
    
    const filtersToUse = customFilters || filters;
    
    try {
      const result = await getProcessesAction(filtersToUse);
      
      if (result.success && result.data) {
        setProcesses(result.data.data);
        setPagination({
          total: result.data.total,
          page: result.data.page,
          pageSize: result.data.pageSize,
          totalPages: result.data.totalPages,
          hasNextPage: result.data.hasNextPage,
          hasPreviousPage: result.data.hasPreviousPage,
        });
      } else {
        setError(result.error || "Failed to load processes");
      }
    } catch (err) {
      console.error("Error loading processes:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Get single process
  const getProcess = async (id: string) => {
    try {
      const result = await getProcessAction(id);
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || "Failed to get process");
      }
    } catch (err) {
      console.error(`Error getting process ${id}:`, err);
      throw err;
    }
  };

  // Create process
  const createProcess = async (data: CreateProcessDTO) => {
    startTransition(async () => {
      try {
        const result = await createProcessAction(data);
        if (result.success) {
          await loadProcesses(); // Reload list
          return result.data;
        } else {
          throw new Error(result.error || "Failed to create process");
        }
      } catch (err) {
        console.error("Error creating process:", err);
        throw err;
      }
    });
  };

  // Update process
  const updateProcess = async (id: string, data: UpdateProcessDTO) => {
    startTransition(async () => {
      try {
        const result = await updateProcessAction(id, data);
        if (result.success) {
          await loadProcesses(); // Reload list
          return result.data;
        } else {
          throw new Error(result.error || "Failed to update process");
        }
      } catch (err) {
        console.error(`Error updating process ${id}:`, err);
        throw err;
      }
    });
  };

  // Delete process
  const deleteProcess = async (id: string) => {
    startTransition(async () => {
      try {
        const result = await deleteProcessAction(id);
        if (result.success) {
          await loadProcesses(); // Reload list
          return true;
        } else {
          throw new Error(result.error || "Failed to delete process");
        }
      } catch (err) {
        console.error(`Error deleting process ${id}:`, err);
        throw err;
      }
    });
  };

  // Update filters
  const updateFilters = (newFilters: Partial<ProcessFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    loadProcesses(updatedFilters);
  };

  // Change page
  const changePage = (page: number) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
    loadProcesses(updatedFilters);
  };

  // Load on mount
  useEffect(() => {
    loadProcesses();
  }, []);

  return {
    // Data
    processes,
    pagination,
    filters,
    loading: loading || isPending,
    error,
    
    // Actions
    loadProcesses,
    getProcess,
    createProcess,
    updateProcess,
    deleteProcess,
    updateFilters,
    changePage,
    
    // Utilities
    refresh: () => loadProcesses(),
  };
}

/**
 * useProcessStatistics Hook
 */
export function useProcessStatistics() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    cancelled: 0,
    successRate: 0,
    averageTimeToHire: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getProcessStatisticsAction();
      if (result.success && result.data) {
        setStats(result.data);
      } else {
        setError(result.error || "Failed to load statistics");
      }
    } catch (err) {
      console.error("Error loading statistics:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    error,
    refresh: loadStatistics,
  };
}