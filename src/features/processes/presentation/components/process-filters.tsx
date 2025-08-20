/**
 * Enhanced Process Filters Component
 * Path: src/features/processes/presentation/components/process-filters.tsx
 */

"use client";

import { useState } from "react";
import { ProcessStatus } from "../../domain/value-objects/process-status.vo";
import { ProcessPriority } from "../../domain/value-objects/process-priority.vo";
import type { ProcessFilters as ProcessFiltersType } from "../../shared/types/process.types";
import {
  FilterContainer,
  FilterSection,
  StatusFilter,
  PriorityFilter,
  SearchFilter,
  RangeFilter,
  SelectFilter,
  PROCESS_STATUS_OPTIONS,
  DEPARTMENT_OPTIONS
} from "@/shared/components/ui/enhanced-filters";
import {
  Target,
  AlertTriangle,
  DollarSign,
  MapPin,
  Calendar,
  Building2,
  Users,
  Briefcase
} from "lucide-react";

interface ProcessFiltersProps {
  filters: ProcessFiltersType;
  onChange: (filters: Partial<ProcessFiltersType>) => void;
}

export function ProcessFilters({ filters, onChange }: ProcessFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key: keyof ProcessFiltersType, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onChange({ [key]: value });
  };

  const handleStatusChange = (statuses: string[]) => {
    // Convert string array to ProcessStatus enum array
    const processStatuses = statuses.map(status => {
      switch (status) {
        case "draft": return ProcessStatus.DRAFT;
        case "active": return ProcessStatus.ACTIVE;
        case "in-progress": return ProcessStatus.IN_PROGRESS;
        case "completed": return ProcessStatus.COMPLETED;
        case "cancelled": return ProcessStatus.CANCELLED;
        case "on-hold": return ProcessStatus.ON_HOLD;
        default: return ProcessStatus.ACTIVE;
      }
    });
    handleFilterChange("status", processStatuses);
  };

  const handlePriorityChange = (priorities: string[]) => {
    // Convert string array to ProcessPriority enum array
    const processPriorities = priorities.map(priority => {
      switch (priority) {
        case "low": return ProcessPriority.LOW;
        case "medium": return ProcessPriority.MEDIUM;
        case "high": return ProcessPriority.HIGH;
        case "urgent": return ProcessPriority.URGENT;
        default: return ProcessPriority.MEDIUM;
      }
    });
    handleFilterChange("priority", processPriorities);
  };

  const handleReset = () => {
    const defaultFilters: ProcessFiltersType = {
      page: 1,
      pageSize: 12,
      status: [ProcessStatus.ACTIVE, ProcessStatus.IN_PROGRESS],
      sortBy: "createdAt",
      sortOrder: "desc"
    };
    setLocalFilters(defaultFilters);
    onChange(defaultFilters);
  };

  // Convert current filters to string arrays for the UI components
  const currentStatusStrings = (localFilters.status || []).map(status => {
    switch (status) {
      case ProcessStatus.DRAFT: return "draft";
      case ProcessStatus.ACTIVE: return "active";
      case ProcessStatus.IN_PROGRESS: return "in-progress";
      case ProcessStatus.COMPLETED: return "completed";
      case ProcessStatus.CANCELLED: return "cancelled";
      case ProcessStatus.ON_HOLD: return "on-hold";
      default: return "active";
    }
  });

  const currentPriorityStrings = (localFilters.priority || []).map(priority => {
    switch (priority) {
      case ProcessPriority.LOW: return "low";
      case ProcessPriority.MEDIUM: return "medium";
      case ProcessPriority.HIGH: return "high";
      case ProcessPriority.URGENT: return "urgent";
      default: return "medium";
    }
  });

  const locationOptions = [
    { value: "remote", label: "Remote", icon: MapPin },
    { value: "chicago", label: "Chicago, IL", icon: MapPin },
    { value: "seattle", label: "Seattle, WA", icon: MapPin },
    { value: "austin", label: "Austin, TX", icon: MapPin },
    { value: "miami", label: "Miami, FL", icon: MapPin }
  ];

  const sortOptions = [
    { value: "createdAt", label: "Date Created" },
    { value: "updatedAt", label: "Last Updated" },
    { value: "deadline", label: "Deadline" },
    { value: "name", label: "Process Name" },
    { value: "priority", label: "Priority" }
  ];

  return (
    <FilterContainer onClear={handleReset}>
      {/* Search */}
      <FilterSection title="Search" icon={Target}>
        <SearchFilter
          value={localFilters.search || ""}
          onChange={(value) => handleFilterChange("search", value)}
          placeholder="Search processes..."
        />
      </FilterSection>

      {/* Status */}
      <FilterSection title="Status" icon={Target} collapsible defaultExpanded>
        <StatusFilter
          value={currentStatusStrings}
          onChange={handleStatusChange}
          options={PROCESS_STATUS_OPTIONS}
        />
      </FilterSection>

      {/* Priority */}
      <FilterSection title="Priority" icon={AlertTriangle} collapsible defaultExpanded>
        <PriorityFilter
          value={currentPriorityStrings}
          onChange={handlePriorityChange}
        />
      </FilterSection>

      {/* Department */}
      <FilterSection title="Department" icon={Building2} collapsible>
        <StatusFilter
          value={localFilters.department ? [localFilters.department] : []}
          onChange={(values) => handleFilterChange("department", values[0] || undefined)}
          options={DEPARTMENT_OPTIONS}
        />
      </FilterSection>

      {/* Location */}
      <FilterSection title="Location" icon={MapPin} collapsible>
        <SelectFilter
          value={localFilters.location || ""}
          onChange={(value) => handleFilterChange("location", value || undefined)}
          options={locationOptions}
          placeholder="Any location"
        />
      </FilterSection>

      {/* Salary Range */}
      <FilterSection title="Salary Range" icon={DollarSign} collapsible>
        <RangeFilter
          min={30000}
          max={200000}
          value={[
            localFilters.minSalary || 30000,
            localFilters.maxSalary || 200000
          ]}
          onChange={([min, max]) => {
            handleFilterChange("minSalary", min);
            handleFilterChange("maxSalary", max);
          }}
          label="Annual Salary"
          prefix="$"
        />
      </FilterSection>

      {/* Team Size */}
      <FilterSection title="Team Size" icon={Users} collapsible>
        <RangeFilter
          min={1}
          max={50}
          value={[
            localFilters.minTeamSize || 1,
            localFilters.maxTeamSize || 50
          ]}
          onChange={([min, max]) => {
            handleFilterChange("minTeamSize", min);
            handleFilterChange("maxTeamSize", max);
          }}
          label="Number of Positions"
          suffix=" positions"
        />
      </FilterSection>

      {/* Sort Options */}
      <FilterSection title="Sort By" icon={Briefcase} collapsible>
        <div className="space-y-3">
          <SelectFilter
            value={localFilters.sortBy || "createdAt"}
            onChange={(value) => handleFilterChange("sortBy", value)}
            options={sortOptions}
            placeholder="Sort by..."
          />
          
          <div className="flex gap-2">
            <button
              onClick={() => handleFilterChange("sortOrder", "asc")}
              className={`flex-1 px-3 py-2 text-xs rounded-lg border transition-colors ${
                localFilters.sortOrder === "asc"
                  ? "bg-[#0D6661] text-white border-[#0D6661]"
                  : "bg-white text-gray-700 border-gray-200 hover:border-[#0D6661]"
              }`}
            >
              Ascending
            </button>
            <button
              onClick={() => handleFilterChange("sortOrder", "desc")}
              className={`flex-1 px-3 py-2 text-xs rounded-lg border transition-colors ${
                localFilters.sortOrder === "desc"
                  ? "bg-[#0D6661] text-white border-[#0D6661]"
                  : "bg-white text-gray-700 border-gray-200 hover:border-[#0D6661]"
              }`}
            >
              Descending
            </button>
          </div>
        </div>
      </FilterSection>

      {/* Advanced Filters */}
      <FilterSection title="Advanced" icon={Calendar} collapsible defaultExpanded={false}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Created After
            </label>
            <input
              type="date"
              value={localFilters.createdAfter || ""}
              onChange={(e) => handleFilterChange("createdAfter", e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6661]/20 focus:border-[#0D6661]"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Deadline Before
            </label>
            <input
              type="date"
              value={localFilters.deadlineBefore || ""}
              onChange={(e) => handleFilterChange("deadlineBefore", e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6661]/20 focus:border-[#0D6661]"
            />
          </div>
        </div>
      </FilterSection>
    </FilterContainer>
  );
}
