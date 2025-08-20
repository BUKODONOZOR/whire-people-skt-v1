"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { talentClientService } from "@/features/talent/services/talent.client.service";
import { talentRepository } from "@/features/talent/repositories/talent.repository";
import type {
  TalentFilters,
  TalentPaginatedResponse,
  Talent,
  CreateTalentDTO,
  UpdateTalentDTO,
} from "@/features/talent/types/talent.types";
import { useCallback, useMemo, useState } from "react";

/**
 * Query keys for talent data
 */
const talentKeys = {
  all: ["talents"] as const,
  lists: () => [...talentKeys.all, "list"] as const,
  list: (filters: TalentFilters) => [...talentKeys.lists(), filters] as const,
  details: () => [...talentKeys.all, "detail"] as const,
  detail: (id: string) => [...talentKeys.details(), id] as const,
  statistics: () => [...talentKeys.all, "statistics"] as const,
};

/**
 * Hook to fetch paginated talents
 */
export function useTalents(
  filters: TalentFilters = {},
  options?: {
    enabled?: boolean;
    initialData?: TalentPaginatedResponse;
  }
) {
  const validatedFilters = useMemo(
    () => talentClientService.validateFilters(filters),
    [filters]
  );

  return useQuery({
    queryKey: talentKeys.list(validatedFilters),
    queryFn: () => {
      console.log("[useTalents] Fetching with filters:", validatedFilters);
      return talentRepository.findAll(validatedFilters);
    },
    enabled: options?.enabled !== false,
    initialData: options?.initialData,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    // Ensure refetch on mount when page changes
    refetchOnMount: true,
  });
}

/**
 * Hook to fetch single talent
 */
export function useTalent(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: talentKeys.detail(id),
    queryFn: () => talentRepository.findById(id),
    enabled: options?.enabled !== false && !!id,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get talent statistics
 */
export function useTalentStatistics() {
  return useQuery({
    queryKey: talentKeys.statistics(),
    queryFn: () => talentRepository.getStatistics(),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to create talent
 */
export function useCreateTalent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTalentDTO) => talentRepository.create(data),
    onSuccess: (newTalent) => {
      // Invalidate all talent lists
      queryClient.invalidateQueries({ queryKey: talentKeys.lists() });
      
      // Optionally, add the new talent to the cache
      queryClient.setQueryData(talentKeys.detail(newTalent.id), newTalent);
    },
  });
}

/**
 * Hook to update talent
 */
export function useUpdateTalent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTalentDTO }) =>
      talentRepository.update(id, data),
    onSuccess: (updatedTalent, { id }) => {
      // Update the specific talent in cache
      queryClient.setQueryData(talentKeys.detail(id), updatedTalent);
      
      // Invalidate all lists
      queryClient.invalidateQueries({ queryKey: talentKeys.lists() });
    },
  });
}

/**
 * Hook to delete talent
 */
export function useDeleteTalent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => talentRepository.delete(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: talentKeys.detail(id) });
      
      // Invalidate all lists
      queryClient.invalidateQueries({ queryKey: talentKeys.lists() });
    },
  });
}

/**
 * Hook for talent search with debounce
 */
export function useTalentSearch(
  searchTerm: string,
  options?: {
    debounceMs?: number;
    minLength?: number;
  }
) {
  const { debounceMs = 300, minLength = 2 } = options || {};

  const filters: TalentFilters = useMemo(
    () => ({
      search: searchTerm,
      pageSize: 10,
    }),
    [searchTerm]
  );

  return useQuery({
    queryKey: ["talent-search", searchTerm],
    queryFn: () => talentRepository.findAll(filters),
    enabled: searchTerm.length >= minLength,
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to prefetch talent data
 */
export function usePrefetchTalent() {
  const queryClient = useQueryClient();

  const prefetchTalent = useCallback(
    async (id: string) => {
      await queryClient.prefetchQuery({
        queryKey: talentKeys.detail(id),
        queryFn: () => talentRepository.findById(id),
        staleTime: 60 * 1000,
      });
    },
    [queryClient]
  );

  return prefetchTalent;
}

/**
 * Hook to manage talent filters in URL
 */
export function useTalentFilters(defaultFilters?: TalentFilters) {
  const [filters, setFilters] = useState<TalentFilters>(
    defaultFilters || talentClientService.getDefaultFilters()
  );

  const updateFilter = useCallback(
    <K extends keyof TalentFilters>(key: K, value: TalentFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(talentClientService.getDefaultFilters());
  }, []);

  const applyFilters = useCallback((newFilters: Partial<TalentFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  return {
    filters,
    updateFilter,
    resetFilters,
    applyFilters,
  };
}