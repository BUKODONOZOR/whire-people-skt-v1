"use client";

import { useState, useCallback, useEffect } from "react";
import { useTalents } from "@/features/talent/hooks/use-talents";
import { TalentCard } from "@/features/talent/components/talent-card";
import { TalentDetailModal } from "@/features/talent/components/talent-detail-modal";
import { LoadingSpinner } from "@/shared/components/loading-spinner";
import { ChevronLeft, ChevronRight, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Talent, TalentFilters, TalentPaginatedResponse } from "@/features/talent/types/talent.types";

interface TalentListProps {
  initialData?: TalentPaginatedResponse;
  filters: TalentFilters;
  onFilterChange?: (filters: TalentFilters) => void;
  onTalentClick?: (talent: Talent) => void;
}

/**
 * Talent List Component
 * Client component for interactivity (pagination, view toggle, etc.)
 */
export function TalentList({ 
  initialData, 
  filters, 
  onFilterChange,
  onTalentClick 
}: TalentListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTalent, setSelectedTalent] = useState<Talent | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Use page from filters directly instead of local state
  const currentPage = filters.page || 1;
  
  // Fetch talents with React Query - use filters directly
  const { data, isLoading, error, isFetching } = useTalents(
    filters,
    { initialData }
  );
  
  // Handle page change
  const handlePageChange = useCallback((newPage: number) => {
    // Call onFilterChange with updated page
    onFilterChange?.({ ...filters, page: newPage });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filters, onFilterChange]);
  
  // Handle talent click
  const handleTalentClick = useCallback((talent: Talent) => {
    if (onTalentClick) {
      onTalentClick(talent);
    } else {
      setSelectedTalent(talent);
      setIsModalOpen(true);
    }
  }, [onTalentClick]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive">Error loading talents</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please make sure you're authenticated
        </p>
        <button 
          onClick={() => window.location.href = "/token"}
          className="mt-4 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-dark"
        >
          Go to Token Page
        </button>
      </div>
    );
  }
  
  // Empty state
  if (!data?.data || data.data.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
          <LayoutGrid className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No talents found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or search criteria
        </p>
      </div>
    );
  }
  
  const { data: talents, total, totalPages, hasNextPage, hasPreviousPage } = data;
  
  return (
    <>
      <div className="space-y-6">
        {/* Header with count and view toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              Available Talent
            </h2>
            <p className="text-muted-foreground">
              {total} professional{total !== 1 ? "s" : ""} found
            </p>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "grid" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "list" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Loading overlay for refetching */}
        <div className="relative">
          {isFetching && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          )}
          
          {/* Talent Grid/List */}
          <div className={cn(
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-3"
          )}>
            {talents.map((talent, index) => (
              <TalentCard
                key={talent.id}
                talent={talent}
                onClick={handleTalentClick}
                variant={viewMode === "list" ? "compact" : "default"}
                index={(currentPage - 1) * (filters.pageSize || 12) + index}
              />
            ))}
          </div>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              Showing page {currentPage} of {totalPages}
            </p>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPreviousPage || currentPage <= 1}
                className={cn(
                  "inline-flex items-center gap-1 px-4 py-2 rounded-lg",
                  "text-sm font-medium transition-all duration-200",
                  hasPreviousPage && currentPage > 1
                    ? "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-[#0D6661]/30"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50 border border-gray-200"
                )}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              
              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={cn(
                        "w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200",
                        pageNum === currentPage
                          ? "bg-[#0D6661] text-white shadow-md hover:bg-[#164643]"
                          : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-[#0D6661]/30"
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage || currentPage >= totalPages}
                className={cn(
                  "inline-flex items-center gap-1 px-4 py-2 rounded-lg",
                  "text-sm font-medium transition-all duration-200",
                  hasNextPage && currentPage < totalPages
                    ? "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-[#0D6661]/30"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50 border border-gray-200"
                )}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Talent Detail Modal */}
      <TalentDetailModal
        talent={selectedTalent}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTalent(undefined);
        }}
      />
    </>
  );
}