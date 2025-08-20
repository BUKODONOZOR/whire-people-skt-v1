import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  label?: string;
}

/**
 * Loading Spinner Component
 * Reusable loading indicator with Wired People brand colors
 */
export function LoadingSpinner({ 
  size = "md", 
  className,
  label = "Loading..."
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-4",
  };
  
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div
        className={cn(
          "animate-spin rounded-full",
          "border-solid border-muted border-t-brand-primary",
          sizeClasses[size]
        )}
        role="status"
        aria-label={label}
      >
        <span className="sr-only">{label}</span>
      </div>
      {label && size !== "sm" && (
        <p className="text-sm text-muted-foreground animate-pulse">{label}</p>
      )}
    </div>
  );
}

/**
 * Page Loading Component
 * Full page loading state
 */
export function PageLoading({ message = "Loading page..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card rounded-lg shadow-lg p-8">
        <LoadingSpinner size="lg" label={message} />
      </div>
    </div>
  );
}

/**
 * Skeleton Loader
 * For content placeholders
 */
export function Skeleton({ 
  className,
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
      {...props}
    />
  );
}

/**
 * Content Loader
 * Grid of skeleton cards
 */
export function ContentLoader({ 
  count = 6,
  columns = 3 
}: { 
  count?: number;
  columns?: number;
}) {
  return (
    <div className={cn(
      "grid gap-6",
      columns === 1 && "grid-cols-1",
      columns === 2 && "grid-cols-1 md:grid-cols-2",
      columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}