/**
 * Enhanced Talent Page with Fixed Layout and Filters on Right
 * Path: src/app/talent/page.tsx
 */

"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { DashboardLayout } from "@/shared/components/layouts/dashboard-layout";
import { talentClientService } from "@/features/talent/services/talent.client.service";
import { TalentList } from "@/features/talent/components/talent-list";
import { TalentFilters } from "@/features/talent/components/talent-filters";
import { LoadingSpinner } from "@/shared/components/loading-spinner";
import { authService } from "@/features/auth/services/auth.service";
import { httpClient } from "@/infrastructure/http/http-client";
import type { TalentFilters as TalentFiltersType } from "@/features/talent/types/talent.types";
import { 
  Users, 
  Plus,
  Download,
  Upload,
  Filter,
  Search,
  LayoutGrid,
  List,
  SlidersHorizontal,
  RefreshCw,
  UserPlus,
  X
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function TalentPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  
  // Parse filters from URL
  const [filters, setFilters] = useState<TalentFiltersType>({
    page: parseInt(searchParams.get("page") || "1"),
    pageSize: 12,
    search: searchParams.get("search") || undefined,
    status: searchParams.get("status") ? searchParams.get("status")!.split(",").map(Number) : [1],
    skills: searchParams.get("skills") || undefined,
    languages: searchParams.get("languages") || undefined,
    minScore: searchParams.get("minScore") ? parseInt(searchParams.get("minScore")!) : undefined,
    maxScore: searchParams.get("maxScore") ? parseInt(searchParams.get("maxScore")!) : undefined,
    location: searchParams.get("location") || undefined,
    sortBy: searchParams.get("sortBy") || "score",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
  });

  const [isReady, setIsReady] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Check for token
  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      console.log("[TalentPage] Token found, ready to load");
      setIsReady(true);
    } else {
      console.log("[TalentPage] No token found, redirecting to token page");
      window.location.href = "/token";
    }
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.page && filters.page > 1) params.set("page", filters.page.toString());
    if (filters.search) params.set("search", filters.search);
    if (filters.status && filters.status.length > 0) params.set("status", filters.status.join(","));
    if (filters.skills) params.set("skills", filters.skills);
    if (filters.languages) params.set("languages", filters.languages);
    if (filters.minScore) params.set("minScore", filters.minScore.toString());
    if (filters.maxScore) params.set("maxScore", filters.maxScore.toString());
    if (filters.location) params.set("location", filters.location);
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    
    router.replace(newUrl, { scroll: false });
  }, [filters, pathname, router]);

  const handleFiltersChange = (newFilters: Partial<TalentFiltersType>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handleSearch = () => {
    handleFiltersChange({ search: searchTerm });
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F4FDF9] to-white">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-b from-[#F4FDF9] via-white to-gray-50">
        {/* Hero Section con Branding de Wired People */}
        <div className="relative bg-gradient-to-br from-[#0D6661] via-[#0D6661]/95 to-[#164643] text-white overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hero-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                  <circle cx="30" cy="30" r="2" fill="white" />
                  <circle cx="30" cy="30" r="15" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-pattern)" />
            </svg>
          </div>
          
          {/* Content */}
          <div className="relative z-10 px-8 py-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col gap-4">
                <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
                  <Users className="w-10 h-10 text-[#FC7E00]" />
                  Talent Pool Management
                </h1>
                <p className="text-lg text-white/90 max-w-3xl">
                  Manage and connect with pre-vetted professionals in Public Health, IT, and Cybersecurity.
                </p>
              </div>

              {/* Actions Bar */}
              <div className="flex flex-wrap items-center gap-4 mt-8">
                <button className="px-6 py-3 bg-white text-[#0D6661] font-semibold rounded-lg hover:bg-gray-50 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button className="px-6 py-3 bg-[#FC7E00] text-white font-semibold rounded-lg hover:bg-[#e37100] transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg">
                  <UserPlus className="w-4 h-4" />
                  Add Talent
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area with Right Sidebar */}
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          <div className="flex gap-6">
            {/* Main Content - Left Side */}
            <div className="flex-1">
              {/* Search and View Controls */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search Bar */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search talent by name, skills, or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6661] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* View Mode & Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRefresh}
                      className="p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      title="Refresh"
                    >
                      <RefreshCw className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={cn(
                          "p-2 rounded transition-all",
                          viewMode === 'grid' 
                            ? "bg-white text-[#0D6661] shadow-sm" 
                            : "text-gray-600 hover:text-[#0D6661]"
                        )}
                        title="Grid View"
                      >
                        <LayoutGrid className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={cn(
                          "p-2 rounded transition-all",
                          viewMode === 'list' 
                            ? "bg-white text-[#0D6661] shadow-sm" 
                            : "text-gray-600 hover:text-[#0D6661]"
                        )}
                        title="List View"
                      >
                        <List className="w-5 h-5" />
                      </button>
                    </div>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={cn(
                        "p-3 rounded-lg transition-all flex items-center gap-2",
                        showFilters 
                          ? "bg-[#0D6661] text-white" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                      title="Toggle Filters"
                    >
                      <SlidersHorizontal className="w-5 h-5" />
                      <span className="hidden sm:inline">Filters</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Talent List */}
              <TalentList 
                filters={filters}
                onFiltersChange={handleFiltersChange}
                viewMode={viewMode}
              />
            </div>

            {/* Filters Sidebar - Right Side */}
            <div className={cn(
              "transition-all duration-300",
              showFilters ? "w-80" : "w-0 overflow-hidden"
            )}>
              {showFilters && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-6">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Filter className="w-5 h-5 text-[#0D6661]" />
                        Filters
                      </h3>
                      <button
                        onClick={() => handleFiltersChange({
                          status: [1],
                          skills: undefined,
                          languages: undefined,
                          minScore: undefined,
                          maxScore: undefined,
                          location: undefined,
                        })}
                        className="text-sm text-[#FC7E00] hover:text-[#e37100] font-medium"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <TalentFilters 
                      filters={filters}
                      onFiltersChange={handleFiltersChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function TalentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F4FDF9] to-white">
        <LoadingSpinner />
      </div>
    }>
      <TalentPageContent />
    </Suspense>
  );
}