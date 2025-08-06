import { Suspense } from "react";
import { UsersList } from "@/features/users/components/users-list";
import { UsersFilters } from "@/features/users/components/users-filters";
import { UsersHeader } from "@/features/users/components/users-header";
import { getUsersService } from "@/features/users/services/users.service";
import { LoadingSpinner } from "@/shared/components/loading-spinner";

interface UsersPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    role?: string;
    status?: string;
  }>;
}

/**
 * Users Page - Server Component
 * Fetches data on the server and passes it to client components
 */
export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams;
  
  // Parse search params
  const queryParams = {
    page: params.page ? parseInt(params.page) : 1,
    search: params.search || "",
    filters: {
      role: params.role,
      status: params.status,
    },
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header - Can be a server component */}
      <UsersHeader />
      
      {/* Filters - Client component for interactivity */}
      <UsersFilters initialFilters={queryParams.filters} />
      
      {/* Users List - Server component with suspense */}
      <Suspense 
        key={JSON.stringify(queryParams)} 
        fallback={<LoadingSpinner />}
      >
        <UsersListWrapper params={queryParams} />
      </Suspense>
    </div>
  );
}

/**
 * Wrapper component to fetch data
 * This allows us to use async/await in a server component
 */
async function UsersListWrapper({ 
  params 
}: { 
  params: { 
    page: number; 
    search: string; 
    filters: any;
  } 
}) {
  // Fetch data on the server
  const usersData = await getUsersService.getUsers(params);
  
  // Pass the fetched data to the client component
  return <UsersList initialData={usersData} queryParams={params} />;
}