/**
 * Enhanced Talent Filters Component
 * Path: src/features/talent/components/talent-filters.tsx
 */

"use client";

import { useState } from "react";
import type { TalentFilters as TalentFiltersType } from "@/features/talent/types/talent.types";
import { cn } from "@/lib/utils";
import {
  Users,
  Star,
  MapPin,
  Briefcase,
  Code2,
  Languages,
  Clock,
  DollarSign,
  Award,
  Globe,
  GraduationCap,
  Calendar,
  ChevronDown,
  ChevronUp,
  Check,
  X
} from "lucide-react";

interface TalentFiltersProps {
  filters: TalentFiltersType;
  onFiltersChange: (filters: Partial<TalentFiltersType>) => void;
  className?: string;
}

export function TalentFilters({
  filters,
  onFiltersChange,
  className
}: TalentFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['status', 'skills', 'score'])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Status options
  const statusOptions = [
    { value: 1, label: "Available", color: "bg-green-500" },
    { value: 2, label: "In Process", color: "bg-[#FC7E00]" },
    { value: 3, label: "Hired", color: "bg-[#0D6661]" },
    { value: 4, label: "Not Available", color: "bg-gray-400" },
    { value: 5, label: "Rejected", color: "bg-red-500" }
  ];

  // Skills options
  const skillsOptions = [
    "React", "Node.js", "Python", "Java", "AWS",
    "Docker", "Kubernetes", "TypeScript", "GraphQL",
    "PostgreSQL", "MongoDB", "Redis", "ElasticSearch",
    "Machine Learning", "Data Science", "DevOps",
    "Cybersecurity", "Blockchain", "Mobile Development", "Anatomy", "Physiology", "Biochemistry", "Pharmacology",
    "Pathology", "Microbiology", "Immunology", "Genetics",
    "Public Health", "Epidemiology", "Clinical Research",
    "Medical Imaging", "Nursing", "Surgery", "Pediatrics",
    "Internal Medicine", "Psychiatry", "Cardiology",
    "Emergency Medicine", "Telemedicine", "Network Security", "Application Security", "Cloud Security",
    "Penetration Testing", "Ethical Hacking", "Cryptography",
    "Incident Response", "Digital Forensics", "Malware Analysis",
    "Security Auditing", "Identity and Access Management",
    "Threat Intelligence", "Risk Assessment", "Zero Trust Security",
    "Vulnerability Management", "SOC Operations", "Red Teaming",
    "Blue Teaming", "Security Compliance", "Cyber Threat Hunting"

  ];

  // Languages options
  const languageOptions = [
    "English", "Spanish", "French", "German",
    "Portuguese", "Italian", "Chinese", "Japanese",
    "Korean", "Arabic", "Russian", "Hindi"
  ];

  // Location options
  const locationOptions = [
    "Remote ", "Alabama", "Alaska", "Arizona", "Arkansas", "California",
    "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
    "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
    "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
    "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];

  const handleStatusToggle = (statusValue: number) => {
    const currentStatus = filters.status || [];
    const newStatus = currentStatus.includes(statusValue)
      ? currentStatus.filter(s => s !== statusValue)
      : [...currentStatus, statusValue];

    onFiltersChange({ status: newStatus.length > 0 ? newStatus : [1] });
  };

  const handleSkillsChange = (skill: string) => {
    const currentSkills = filters.skills ? filters.skills.split(',') : [];
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];

    onFiltersChange({ skills: newSkills.length > 0 ? newSkills.join(',') : undefined });
  };

  const handleLanguagesChange = (language: string) => {
    const currentLanguages = filters.languages ? filters.languages.split(',') : [];
    const newLanguages = currentLanguages.includes(language)
      ? currentLanguages.filter(l => l !== language)
      : [...currentLanguages, language];

    onFiltersChange({ languages: newLanguages.length > 0 ? newLanguages.join(',') : undefined });
  };

  const handleLocationChange = (location: string) => {
    onFiltersChange({ location: location === filters.location ? undefined : location });
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Status Filter */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('status')}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#0D6661]" />
            Status
          </h4>
          {expandedSections.has('status') ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {expandedSections.has('status') && (
          <div className="space-y-2">
            {statusOptions.map(option => {
              const isSelected = (filters.status || []).includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => handleStatusToggle(option.value)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all",
                    isSelected
                      ? "bg-[#F4FDF9] border border-[#0D6661] text-[#0D6661]"
                      : "hover:bg-gray-50 text-gray-700"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", option.color)} />
                    {option.label}
                  </span>
                  {isSelected && <Check className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Score Range Filter */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('score')}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Star className="w-4 h-4 text-[#FC7E00]" />
            Match Score
          </h4>
          {expandedSections.has('score') ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {expandedSections.has('score') && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Min"
                value={filters.minScore || ''}
                onChange={(e) => onFiltersChange({
                  minScore: e.target.value ? parseInt(e.target.value) : undefined
                })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6661] focus:border-transparent"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Max"
                value={filters.maxScore || ''}
                onChange={(e) => onFiltersChange({
                  maxScore: e.target.value ? parseInt(e.target.value) : undefined
                })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6661] focus:border-transparent"
              />
            </div>

            {/* Quick score ranges */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: "90+", min: 90, max: 100 },
                { label: "80-89", min: 80, max: 89 },
                { label: "70-79", min: 70, max: 79 },
                { label: "60+", min: 60, max: 100 }
              ].map(range => (
                <button
                  key={range.label}
                  onClick={() => onFiltersChange({
                    minScore: range.min,
                    maxScore: range.max
                  })}
                  className={cn(
                    "px-3 py-1 text-xs rounded-full transition-all",
                    filters.minScore === range.min && filters.maxScore === range.max
                      ? "bg-[#0D6661] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Skills Filter */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('skills')}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-[#75A3AB]" />
            Skills
          </h4>
          {expandedSections.has('skills') ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {expandedSections.has('skills') && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {skillsOptions.map(skill => {
              const isSelected = filters.skills?.includes(skill);
              return (
                <button
                  key={skill}
                  onClick={() => handleSkillsChange(skill)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all text-left",
                    isSelected
                      ? "bg-[#F4FDF9] border border-[#0D6661] text-[#0D6661]"
                      : "hover:bg-gray-50 text-gray-700"
                  )}
                >
                  {skill}
                  {isSelected && <Check className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Languages Filter */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('languages')}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Languages className="w-4 h-4 text-[#164643]" />
            Languages
          </h4>
          {expandedSections.has('languages') ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {expandedSections.has('languages') && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {languageOptions.map(language => {
              const isSelected = filters.languages?.includes(language);
              return (
                <button
                  key={language}
                  onClick={() => handleLanguagesChange(language)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all text-left",
                    isSelected
                      ? "bg-[#F4FDF9] border border-[#0D6661] text-[#0D6661]"
                      : "hover:bg-gray-50 text-gray-700"
                  )}
                >
                  {language}
                  {isSelected && <Check className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Location Filter */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('location')}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#FC7E00]" />
            Location
          </h4>
          {expandedSections.has('location') ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {expandedSections.has('location') && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {locationOptions.map(location => {
              const isSelected = filters.location === location;
              return (
                <button
                  key={location}
                  onClick={() => handleLocationChange(location)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all text-left",
                    isSelected
                      ? "bg-[#F4FDF9] border border-[#0D6661] text-[#0D6661]"
                      : "hover:bg-gray-50 text-gray-700"
                  )}
                >
                  {location}
                  {isSelected && <Check className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Sort Options */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#75A3AB]" />
          Sort By
        </h4>
        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            onFiltersChange({ sortBy, sortOrder: sortOrder as 'asc' | 'desc' });
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6661] focus:border-transparent"
        >
          <option value="score-desc">Highest Score</option>
          <option value="score-asc">Lowest Score</option>
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
        </select>
      </div>
    </div>
  );
}