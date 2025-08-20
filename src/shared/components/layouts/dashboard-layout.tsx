/**
 * Dashboard Layout with Sidebar
 * Path: src/shared/components/layouts/dashboard-layout.tsx
 */

"use client";

import { Sidebar } from "@/shared/components/navigation/sidebar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className={cn(
        "transition-all duration-300 min-h-screen",
        "lg:ml-64", // Ajustado para el nuevo ancho del sidebar
        className
      )}>
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
