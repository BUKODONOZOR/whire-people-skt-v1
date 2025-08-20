/**
 * Enhanced Process Card Component
 * Path: src/features/processes/presentation/components/process-card.tsx
 */

"use client";

import { ProcessStatus } from "../../domain/value-objects/process-status.vo";
import { ProcessPriority } from "../../domain/value-objects/process-priority.vo";
import { enhanceProcessData } from "@/shared/utils/process-mock-data.utils";
import { cn } from "@/lib/utils";
import { 
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign,
  Briefcase,
  AlertCircle,
  TrendingUp,
  Star,
  ChevronRight,
  Building2,
  Target
} from "lucide-react";

interface ProcessCardProps {
  process: any;
  onClick?: () => void;
  index?: number;
}

export function ProcessCard({ process: rawProcess, onClick, index = 0 }: ProcessCardProps) {
  // Enhance process data with mock details
  const process = enhanceProcessData(rawProcess, index);
  
  // Get status display info with Wired People colors
  const getStatusBadge = () => {
    const statusColors: Record<string, string> = {
      [ProcessStatus.DRAFT]: "bg-gray-100 text-gray-600 border-gray-200",
      [ProcessStatus.ACTIVE]: "bg-green-50 text-green-700 border-green-200",
      [ProcessStatus.IN_PROGRESS]: "bg-[#FC7E00]/10 text-[#FC7E00] border-[#FC7E00]/20",
      [ProcessStatus.COMPLETED]: "bg-[#0D6661]/10 text-[#0D6661] border-[#0D6661]/20",
      [ProcessStatus.CANCELLED]: "bg-red-50 text-red-600 border-red-200",
      [ProcessStatus.ON_HOLD]: "bg-yellow-50 text-yellow-600 border-yellow-200",
    };
    
    const color = statusColors[process.status] || "bg-gray-100 text-gray-600 border-gray-200";
    const label = process.statusLabel || "Unknown";
    
    return (
      <span className={cn(
        "inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border",
        color
      )}>
        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
        {label}
      </span>
    );
  };

  // Get priority indicator with enhanced visual
  const getPriorityIndicator = () => {
    if (!process.priority) return null;
    
    const priorityConfig: Record<number, { color: string, icon: any, label: string }> = {
      [ProcessPriority.LOW]: { 
        color: "bg-gray-400", 
        icon: null,
        label: "Low"
      },
      [ProcessPriority.MEDIUM]: { 
        color: "bg-blue-500", 
        icon: null,
        label: "Medium"
      },
      [ProcessPriority.HIGH]: { 
        color: "bg-[#FC7E00]", 
        icon: TrendingUp,
        label: "High"
      },
      [ProcessPriority.URGENT]: { 
        color: "bg-red-500", 
        icon: AlertCircle,
        label: "Urgent"
      },
    };
    
    const config = priorityConfig[process.priority] || priorityConfig[ProcessPriority.MEDIUM];
    
    return (
      <>
        <div 
          className={cn("w-1 h-full absolute left-0 top-0 rounded-l-lg", config.color)}
          title={`${config.label} Priority`}
        />
        {config.icon && process.isUrgent && (
          <div className="absolute top-3 left-3">
            <config.icon className={cn("w-4 h-4", 
              process.priority === ProcessPriority.URGENT ? "text-red-500" : "text-[#FC7E00]"
            )} />
          </div>
        )}
      </>
    );
  };

  // Format date with relative time
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
    
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  // Format salary range
  const formatSalary = () => {
    if (!process.salaryMin && !process.salaryMax) return null;
    
    const min = process.salaryMin ? `$${(process.salaryMin / 1000).toFixed(0)}k` : '';
    const max = process.salaryMax ? `$${(process.salaryMax / 1000).toFixed(0)}k` : '';
    
    if (min && max) return `${min} - ${max}`;
    return min || max;
  };

  // Calculate fill percentage for vacancies with color
  const fillPercentage = process.fillPercentage || 0;
  const getFillColor = () => {
    if (fillPercentage >= 80) return "bg-green-500";
    if (fillPercentage >= 50) return "bg-[#FC7E00]";
    return "bg-[#0D6661]";
  };

  // Deadline urgency
  const getDeadlineColor = () => {
    if (!process.daysUntilDeadline) return "text-gray-500";
    if (process.daysUntilDeadline <= 7) return "text-red-600 font-semibold";
    if (process.daysUntilDeadline <= 14) return "text-[#FC7E00] font-medium";
    return "text-gray-600";
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative bg-white border rounded-xl p-4 sm:p-5 transition-all duration-300 cursor-pointer group min-h-[320px]",
        "hover:shadow-xl hover:border-[#0D6661]/30 hover:-translate-y-1",
        process.isUrgent && "border-[#FC7E00]/20",
        "overflow-hidden"
      )}
    >
      {getPriorityIndicator()}
      
      {/* Background Pattern for visual interest */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <pattern id={`pattern-${process.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1.5" fill="#0D6661" />
          </pattern>
          <rect width="100" height="100" fill={`url(#pattern-${process.id})`} />
        </svg>
      </div>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4 pl-3">
        <div className="flex-1 pr-3">
          <div className="flex items-start gap-2 mb-2">
            {process.icon && (
              <span className="text-xl flex-shrink-0" title={process.department}>
                {process.icon}
              </span>
            )}
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-[#0D6661] transition-colors leading-tight">
              {process.name}
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              {process.companyName || "Wired People Inc."}
            </span>
            {process.department && (
              <span className={cn(
                "px-2 py-1 rounded-full text-xs border",
                process.departmentColor || "bg-gray-100 text-gray-600 border-gray-200"
              )}>
                {process.department}
              </span>
            )}
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Description */}
      {process.description && (
        <p className="text-xs text-gray-600 mb-4 line-clamp-2 pl-3">
          {process.description}
        </p>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 pl-3">
        {/* Positions */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#F4FDF9] rounded-lg flex-shrink-0">
            <Users className="w-4 h-4 text-[#0D6661]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Positions</p>
            <p className="text-sm font-semibold text-gray-900">
              {process.studentsCount || 0}/{process.vacancies}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#F4FDF9] rounded-lg flex-shrink-0">
            <MapPin className="w-4 h-4 text-[#0D6661]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Location</p>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {process.remote ? "🌐 Remote" : process.location || "On-site"}
            </p>
          </div>
        </div>

        {/* Salary Range */}
        {formatSalary() && (
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#F4FDF9] rounded-lg flex-shrink-0">
              <DollarSign className="w-4 h-4 text-[#0D6661]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Salary</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatSalary()}
              </p>
            </div>
          </div>
        )}

        {/* Deadline */}
        {process.deadline && (
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#F4FDF9] rounded-lg flex-shrink-0">
              <Clock className="w-4 h-4 text-[#0D6661]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Deadline</p>
              <p className={cn("text-sm font-medium", getDeadlineColor())}>
                {process.daysUntilDeadline > 0 
                  ? `${process.daysUntilDeadline} days left`
                  : "Expired"
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Skills */}
      {process.requiredSkills && process.requiredSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4 pl-3">
          {process.requiredSkills.slice(0, 3).map((skill: any, idx: number) => (
            <span
              key={idx}
              className={cn(
                "px-2.5 py-1 text-xs rounded-md border",
                skill.required 
                  ? "bg-[#CFE8E0] text-[#164643] border-[#75A3AB]/30 font-medium"
                  : "bg-gray-50 text-gray-600 border-gray-200"
              )}
            >
              {skill.name}
              {skill.level && (
                <span className="ml-1 opacity-60">L{skill.level}</span>
              )}
            </span>
          ))}
          {process.requiredSkills.length > 3 && (
            <span className="px-2.5 py-1 text-xs text-[#75A3AB] font-medium">
              +{process.requiredSkills.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Tags */}
      {process.tags && process.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4 pl-3">
          {process.tags.map((tag: string, idx: number) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-[#F4FDF9] text-[#0D6661] rounded"
            >
              <Target className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Progress Bar with enhanced design */}
      <div className="mt-auto pt-4 pl-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-gray-600">Recruitment Progress</span>
          <span className={cn(
            "text-xs font-bold",
            fillPercentage >= 80 ? "text-green-600" : 
            fillPercentage >= 50 ? "text-[#FC7E00]" : "text-[#0D6661]"
          )}>
            {fillPercentage}%
          </span>
        </div>
        <div className="relative w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500 relative",
              getFillColor()
            )}
            style={{ width: `${fillPercentage}%` }}
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
          {/* Milestone markers */}
          <div className="absolute top-0 left-1/4 w-0.5 h-full bg-gray-300" />
          <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gray-300" />
          <div className="absolute top-0 left-3/4 w-0.5 h-full bg-gray-300" />
        </div>
      </div>

      {/* Footer with Posted Date and Action */}
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 pl-3">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>Posted {formatDate(process.createdAt)}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#0D6661] transition-colors" />
      </div>

      {/* Hover Overlay Effect */}
      <div className="absolute inset-0 rounded-xl ring-2 ring-[#0D6661] ring-opacity-0 group-hover:ring-opacity-20 transition-all duration-200 pointer-events-none" />
    </div>
  );
}