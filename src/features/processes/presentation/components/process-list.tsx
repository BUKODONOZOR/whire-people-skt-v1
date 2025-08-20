/**
 * Process List Component
 * Path: src/features/processes/presentation/components/process-list.tsx
 */

"use client";

import { useState, useEffect, useTransition } from "react";
import { ProcessCard } from "./process-card";
import { LoadingSpinner } from "@/shared/components/loading-spinner";
import { getProcessesAction } from "../actions/process.actions";
import { ProcessFilters } from "../../shared/types/process.types";
import { authService } from "@/features/auth/services/auth.service";
import type { Process } from "../../domain/entities/process.entity";

interface ProcessListProps {
  filters: ProcessFilters;
  onProcessClick?: (process: any) => void;
}

export function ProcessList({ filters, onProcessClick }: ProcessListProps) {
  const [processes, setProcesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 12,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    loadProcesses();
  }, [filters]);

  const loadProcesses = async () => {
    console.log("[ProcessList] Loading processes with filters:", filters);
    setLoading(true);
    setError(null);
    
    // Get token from client-side
    const token = authService.getToken();
    if (!token) {
      console.error("[ProcessList] No token available in client");
      setError("Authentication required. Please set a token.");
      setLoading(false);
      return;
    }
    
    startTransition(async () => {
      try {
        console.log("[ProcessList] Calling getProcessesAction with token...");
        const result = await getProcessesAction(filters, token);
        console.log("[ProcessList] Action result:", result);
        
        if (result.success && result.data) {
          console.log("[ProcessList] Success! Got data:", result.data);
          setProcesses(result.data.data || []);
          setPagination({
            total: result.data.total || 0,
            page: result.data.page || 1,
            pageSize: result.data.pageSize || 12,
            totalPages: result.data.totalPages || 0,
            hasNextPage: result.data.hasNextPage || false,
            hasPreviousPage: result.data.hasPreviousPage || false,
          });
        } else {
          console.error("[ProcessList] Error from action:", result.error);
          setError(result.error || "Failed to load processes");
        }
      } catch (err) {
        console.error("[ProcessList] Exception loading processes:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    });
  };

  const handlePageChange = (newPage: number) => {
    const newFilters = { ...filters, page: newPage };
    loadProcesses();
  };

  if (loading && !isPending) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: {error}</p>
        <button
          onClick={loadProcesses}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (processes.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No processes found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new process.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results summary */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
          {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{" "}
          {pagination.total} processes
        </span>
        <span className="text-xs text-gray-400">
          {isPending && "Updating..."}
        </span>
      </div>

      {/* Process grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {processes.map((process, index) => (
          <ProcessCard
            key={process.id}
            process={process}
            onClick={() => onProcessClick?.(process)}
            index={(pagination.page - 1) * pagination.pageSize + index}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-4">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={!pagination.hasPreviousPage || isPending}
            className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={isPending}
                  className={`px-3 py-1 text-sm border rounded-md ${
                    pageNum === pagination.page
                      ? "bg-[#0b5d5b] text-white"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            {pagination.totalPages > 5 && (
              <>
                <span className="px-2">...</span>
                <button
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={isPending}
                  className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
                >
                  {pagination.totalPages}
                </button>
              </>
            )}
          </div>
          
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={!pagination.hasNextPage || isPending}
            className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

