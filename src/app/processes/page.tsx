/**
 * Enhanced Processes Page
 * Path: src/app/processes/page.tsx
 */

"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/shared/components/layouts/dashboard-layout";
import { ProcessList } from "@/features/processes/presentation/components/process-list";
import { ProcessFilters } from "@/features/processes/presentation/components/process-filters";
import { CreateProcessModal } from "@/features/processes/presentation/components/create-process-modal";
import { ProcessDetailModal } from "@/features/processes/presentation/components/process-detail-modal";
import { LoadingSpinner } from "@/shared/components/loading-spinner";
import { ProcessHubIcon, WiredPeopleLogo } from "@/shared/components/ui/logos";
import { authService } from "@/features/auth/services/auth.service";
import { httpClient } from "@/infrastructure/http/http-client";
import { ProcessStatus } from "@/features/processes/domain/value-objects/process-status.vo";
import { ProcessPriority } from "@/features/processes/domain/value-objects/process-priority.vo";
import type { ProcessFilters as ProcessFiltersType } from "@/features/processes/shared/types/process.types";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  TrendingUp, 
  Users, 
  Target, 
  Clock,
  Building2,
  Filter,
  Search,
  LayoutGrid
} from "lucide-react";

export default function ProcessesPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<ProcessFiltersType>({
    page: 1,
    pageSize: 12,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  
  const [isReady, setIsReady] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      console.log("[ProcessesPage] Token found, ready to load processes");
      setIsReady(true);
    } else {
      console.log("[ProcessesPage] No token found, redirecting to token page");
      window.location.href = "/token";
    }
  }, []);

  const handleProcessClick = (process: any) => {
    setSelectedProcess(process);
    setShowDetailModal(true);
  };

  const handleFiltersChange = (newFilters: Partial<ProcessFiltersType>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
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
      {/* Enhanced Hero Section with Wired People branding */}
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
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D6661]/50 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-between items-start">
            <div className="max-w-3xl">
              {/* Badge with Logo */}
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
                <WiredPeopleLogo variant="icon-only" size="sm" className="w-6 h-6" />
                <span>Wired People Recruitment Platform</span>
              </div>
              
              {/* Title with Icon */}
              <div className="flex items-center gap-4 mb-4">
                <ProcessHubIcon size="100" className="flex-shrink-0" />
                <h1 className="text-4xl md:text-5xl font-bold">
                  Recruitment
                  <span className="text-[#FC7E00]"> Process Hub</span>
                </h1>
              </div>
              
              {/* Description */}
              <p className="text-lg text-white/90 mb-6 leading-relaxed">
                Streamline your talent acquisition with our comprehensive recruitment management system. 
                Track candidates, manage positions, and build exceptional teams for Public Health, IT, and Cybersecurity roles.
              </p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-white/80">Active Positions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#FC7E00]" />
                  <span className="text-sm text-white/80">Talent Pipeline</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-white/60" />
                  <span className="text-sm text-white/80">Strategic Hiring</span>
                </div>
              </div>
            </div>
            
            {/* Action Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="group flex items-center gap-2 px-6 py-3 bg-[#FC7E00] hover:bg-[#e37100] text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
              Create New Process
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Content Header with Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-900">Active Processes</h2>
            <span className="px-3 py-1 bg-[#CFE8E0] text-[#164643] rounded-full text-sm font-medium">
              Live Positions
            </span>
          </div>
          
          {/* Search Bar */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search processes..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6661]/20 focus:border-[#0D6661] w-64"
                onChange={(e) => handleFiltersChange({ search: e.target.value })}
              />
            </div>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <LayoutGrid className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Process List - Main Content */}
          <main className="xl:col-span-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <ProcessList 
                filters={filters}
                onProcessClick={handleProcessClick}
              />
            </div>
          </main>
          
          {/* Sidebar */}
          <aside className="xl:col-span-1 space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
                <button className="text-xs text-[#0D6661] hover:text-[#164643] font-medium">
                  Clear all
                </button>
              </div>
              <ProcessFilters 
                filters={filters}
                onChange={handleFiltersChange}
              />
            </div>
            
            {/* Quick Stats */}
            <ProcessStats />
            
            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-[#0D6661] to-[#164643] rounded-xl p-4 text-white">
              <h3 className="text-sm font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm">
                  📊 View Analytics
                </button>
                <button className="w-full text-left px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm">
                  📥 Import Candidates
                </button>
                <button className="w-full text-left px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm">
                  📤 Export Report
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Create Process Modal */}
      <CreateProcessModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          window.location.reload();
        }}
      />

      {/* Process Detail Modal */}
      <ProcessDetailModal
        process={selectedProcess}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedProcess(null);
        }}
      />
      </div>
    </DashboardLayout>
  );
}

/**
 * Enhanced Process Stats Component
 */
function ProcessStats() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = authService.getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    
    import("@/features/processes/presentation/actions/process.actions")
      .then(({ getProcessStatisticsAction }) => getProcessStatisticsAction(token))
      .then(result => {
        if (result.success && result.data) {
          setStats(result.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const statItems = [
    { label: "Total Processes", value: stats.total, color: "#0D6661", icon: "📊", bgColor: "bg-[#CFE8E0]" },
    { label: "Active", value: stats.active, color: "#22c55e", icon: "✅", bgColor: "bg-green-50" },
    { label: "Completed", value: stats.completed, color: "#8b5cf6", icon: "🎯", bgColor: "bg-purple-50" },
    { label: "Cancelled", value: stats.cancelled, color: "#ef4444", icon: "❌", bgColor: "bg-red-50" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-[#0D6661]" />
        Statistics Overview
      </h3>
      <div className="space-y-3">
        {statItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
            style={{ borderLeftWidth: "3px", borderLeftColor: item.color }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 ${item.bgColor} rounded-lg flex items-center justify-center text-sm`}>
                {item.icon}
              </div>
              <span className="text-sm text-gray-600">{item.label}</span>
            </div>
            <span className="text-xl font-bold" style={{ color: item.color }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
      
      {/* Progress Overview */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 mb-2">Completion Rate</div>
        <div className="flex gap-1 h-2">
          <div 
            className="bg-green-500 rounded-l"
            style={{ width: `${stats.total ? (stats.completed / stats.total) * 100 : 0}%` }}
          />
          <div 
            className="bg-[#FC7E00]"
            style={{ width: `${stats.total ? (stats.active / stats.total) * 100 : 0}%` }}
          />
          <div 
            className="bg-gray-300 rounded-r flex-1"
          />
        </div>
      </div>
    </div>
  );
}