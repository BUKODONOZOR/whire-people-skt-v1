/**
 * Enhanced Filter Components with Professional Icons
 * Path: src/shared/components/ui/enhanced-filters.tsx
 */

"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { 
  Search,
  Filter,
  CheckCircle2,
  Circle,
  AlertTriangle,
  XCircle,
  Clock,
  Pause,
  FileText,
  TrendingUp,
  BarChart3,
  Star,
  Target,
  Zap,
  Users,
  ArrowUp,
  ArrowDown,
  Minus,
  ChevronDown,
  SlidersHorizontal,
  DollarSign,
  MapPin,
  Calendar
} from "lucide-react";

interface FilterSectionProps {
  title: string;
  icon?: any;
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export function FilterSection({ 
  title, 
  icon: Icon, 
  children, 
  className,
  collapsible = false,
  defaultExpanded = true 
}: FilterSectionProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  return (
    <div className={cn("space-y-3", className)}>
      <div 
        className={cn(
          "flex items-center gap-2",
          collapsible && "cursor-pointer hover:text-[#0D6661] transition-colors"
        )}
        onClick={collapsible ? () => setIsExpanded(!isExpanded) : undefined}
      >
        {Icon && <Icon className="w-4 h-4 text-[#0D6661]" />}
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {collapsible && (
          <ChevronDown className={cn(
            "w-4 h-4 text-gray-400 transition-transform ml-auto",
            isExpanded && "rotate-180"
          )} />
        )}
      </div>
      {(!collapsible || isExpanded) && (
        <div className="space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

interface StatusFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: Array<{
    value: string;
    label: string;
    icon?: any;
    color?: string;
    count?: number;
  }>;
}

export function StatusFilter({ value, onChange, options }: StatusFilterProps) {
  const handleToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      {options.map((option) => {
        const Icon = option.icon || Circle;
        const isSelected = value.includes(option.value);
        
        return (
          <label
            key={option.value}
            className="group flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleToggle(option.value)}
              className="sr-only"
            />
            <div className={cn(
              "flex items-center justify-center w-4 h-4 rounded border-2 transition-all",
              isSelected
                ? "bg-[#0D6661] border-[#0D6661]"
                : "border-gray-300 group-hover:border-[#0D6661]"
            )}>
              {isSelected && (
                <CheckCircle2 className="w-3 h-3 text-white" />
              )}
            </div>
            
            <div className="flex items-center gap-2 flex-1">
              <Icon 
                className="w-4 h-4" 
                style={{ color: option.color || "#6B7280" }}
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {option.label}
              </span>
              {option.count !== undefined && (
                <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {option.count}
                </span>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
}

interface PriorityFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function PriorityFilter({ value, onChange }: PriorityFilterProps) {
  const priorityOptions = [
    {
      value: "low",
      label: "Low Priority",
      icon: Minus,
      color: "#6B7280"
    },
    {
      value: "medium", 
      label: "Medium Priority",
      icon: Circle,
      color: "#3B82F6"
    },
    {
      value: "high",
      label: "High Priority", 
      icon: TrendingUp,
      color: "#FC7E00"
    },
    {
      value: "urgent",
      label: "Urgent Priority",
      icon: AlertTriangle,
      color: "#EF4444"
    }
  ];

  return (
    <StatusFilter 
      value={value}
      onChange={onChange}
      options={priorityOptions}
    />
  );
}

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchFilter({ 
  value, 
  onChange, 
  placeholder = "Search...",
  className 
}: SearchFilterProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6661]/20 focus:border-[#0D6661] transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded"
        >
          <XCircle className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </div>
  );
}

interface RangeFilterProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  label: string;
  prefix?: string;
  suffix?: string;
}

export function RangeFilter({ 
  min, 
  max, 
  value, 
  onChange, 
  label,
  prefix = "",
  suffix = "" 
}: RangeFilterProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-xs text-gray-500">
          {prefix}{value[0]}{suffix} - {prefix}{value[1]}{suffix}
        </span>
      </div>
      
      <div className="px-3">
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            value={value[0]}
            onChange={(e) => onChange([parseInt(e.target.value), value[1]])}
            className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <input
            type="range"
            min={min}
            max={max}
            value={value[1]}
            onChange={(e) => onChange([value[0], parseInt(e.target.value)])}
            className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
      
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="number"
            min={min}
            max={max}
            value={value[0]}
            onChange={(e) => onChange([parseInt(e.target.value) || min, value[1]])}
            className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#0D6661]"
            placeholder="Min"
          />
        </div>
        <div className="flex-1">
          <input
            type="number"
            min={min}
            max={max}
            value={value[1]}
            onChange={(e) => onChange([value[0], parseInt(e.target.value) || max])}
            className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#0D6661]"
            placeholder="Max"
          />
        </div>
      </div>
    </div>
  );
}

interface SelectFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
    icon?: any;
    color?: string;
  }>;
  placeholder?: string;
}

export function SelectFilter({ value, onChange, options, placeholder = "Select..." }: SelectFilterProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6661]/20 focus:border-[#0D6661] bg-white appearance-none cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

interface FilterContainerProps {
  children: React.ReactNode;
  onClear?: () => void;
  className?: string;
}

export function FilterContainer({ children, onClear, className }: FilterContainerProps) {
  return (
    <div className={cn("bg-white rounded-xl shadow-sm border border-gray-100 p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-[#0D6661]" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        {onClear && (
          <button
            onClick={onClear}
            className="text-sm text-[#0D6661] hover:text-[#164643] font-medium transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}

// Process Status Options
export const PROCESS_STATUS_OPTIONS = [
  {
    value: "draft",
    label: "Draft",
    icon: FileText,
    color: "#6B7280"
  },
  {
    value: "active", 
    label: "Active",
    icon: CheckCircle2,
    color: "#22C55E"
  },
  {
    value: "in-progress",
    label: "In Progress", 
    icon: Clock,
    color: "#FC7E00"
  },
  {
    value: "completed",
    label: "Completed",
    icon: Target,
    color: "#0D6661"
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: XCircle,
    color: "#EF4444"
  },
  {
    value: "on-hold",
    label: "On Hold",
    icon: Pause,
    color: "#F59E0B"
  }
];

// Talent Status Options
export const TALENT_STATUS_OPTIONS = [
  {
    value: "1",
    label: "Available",
    icon: CheckCircle2,
    color: "#22C55E"
  },
  {
    value: "2",
    label: "In Process",
    icon: Clock,
    color: "#FC7E00"
  },
  {
    value: "3",
    label: "Hired",
    icon: Target,
    color: "#0D6661"
  },
  {
    value: "4",
    label: "Not Available", 
    icon: Circle,
    color: "#6B7280"
  },
  {
    value: "5",
    label: "Rejected",
    icon: XCircle,
    color: "#EF4444"
  }
];

// Department Options
export const DEPARTMENT_OPTIONS = [
  {
    value: "it",
    label: "Information Technology",
    icon: Zap,
    color: "#0D6661"
  },
  {
    value: "cybersecurity",
    label: "Cybersecurity", 
    icon: Target,
    color: "#FC7E00"
  },
  {
    value: "health",
    label: "Public Health",
    icon: Users,
    color: "#75A3AB"
  }
];
