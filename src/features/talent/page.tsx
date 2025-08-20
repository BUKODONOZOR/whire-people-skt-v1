import { Suspense } from "react";
import { talentService } from "@/features/talent/services/talent.service";
import { TalentList } from "@/features/talent/components/talent-list";
import { TalentFilters } from "@/features/talent/components/talent-filters";
import { LoadingSpinner } from "@/shared/components/loading-spinner";
import type { TalentFilters as TalentFiltersType } from "@/features/talent/types/talent.types";

interface TalentPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    skills?: string;
    languages?: string;
    minScore?: string;
    maxScore?: string;
    location?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

/**
 * Talent Page - Server Component
 * Fetches initial data on the server
 */
export default async function TalentPage({ searchParams }: TalentPageProps) {
  const params = await searchParams;
  
  // Parse and validate filters from URL
  const filters: TalentFiltersType = {
    page: params.page ? parseInt(params.page) : 1,
    pageSize: 12,
    search: params.search || undefined,
    status: params.status ? params.status.split(",").map(Number) : [1],
    skills: params.skills || undefined,
    languages: params.languages || undefined,
    minScore: params.minScore ? parseInt(params.minScore) : undefined,
    maxScore: params.maxScore ? parseInt(params.maxScore) : undefined,
    location: params.location || undefined,
    sortBy: params.sortBy || "score",
    sortOrder: (params.sortOrder as "asc" | "desc") || "desc",
  };
  
  // Validate filters
  const validatedFilters = talentService.validateFilters(filters);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-brand-primary/5 via-brand-primary/10 to-brand-accent/5 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Find Your Next
              <span className="text-brand-primary"> Expert</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect with pre-vetted professionals in Public Health, IT, and Cybersecurity. 
              Our talent pool is ready to contribute to your organization's success.
            </p>
          </div>
          
          {/* Stats */}
          <Suspense fallback={<StatsLoading />}>
            <TalentStats />
          </Suspense>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <TalentFilters initialFilters={validatedFilters} />
          </aside>
          
          {/* Talent List */}
          <main className="lg:col-span-3">
            <Suspense 
              key={JSON.stringify(validatedFilters)} 
              fallback={<TalentListLoading />}
            >
              <TalentListWrapper filters={validatedFilters} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}

/**
 * Wrapper to fetch data on server
 */
async function TalentListWrapper({ filters }: { filters: TalentFiltersType }) {
  // Fetch initial data on the server
  const initialData = await talentService.getTalents(filters);
  
  return (
    <TalentList 
      initialData={initialData} 
      filters={filters}
    />
  );
}

/**
 * Stats Component
 */
async function TalentStats() {
  const stats = await talentService.getStatistics();
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      <StatCard 
        label="Total Talents" 
        value={stats.total.toLocaleString()} 
        color="text-brand-primary"
      />
      <StatCard 
        label="Available Now" 
        value={stats.available.toLocaleString()} 
        color="text-success"
      />
      <StatCard 
        label="In Process" 
        value={stats.inProcess.toLocaleString()} 
        color="text-warning"
      />
      <StatCard 
        label="Successfully Placed" 
        value={stats.hired.toLocaleString()} 
        color="text-info"
      />
    </div>
  );
}

/**
 * Stat Card Component
 */
function StatCard({ 
  label, 
  value, 
  color 
}: { 
  label: string; 
  value: string; 
  color: string;
}) {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

/**
 * Loading Components
 */
function TalentListLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-muted rounded animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function StatsLoading() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-20 bg-card rounded-lg border border-border animate-pulse" />
      ))}
    </div>
  );
}