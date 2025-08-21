import { cn } from "@/lib/utils";
import type { Talent } from "@/features/talent/types/talent.types";
import { 
  generateProfessionalAvatar, 
  getInitials, 
  generateAvatarGradient,
  enrichTalentWithAvatar 
} from "@/shared/utils/avatar-enhanced.utils";
import { calculateAge } from "@/features/talent/utils/lookups";
import { 
  MapPin, 
  Star, 
  Briefcase, 
  Calendar,
  Mail,
  Phone,
  ChevronRight,
  Circle,
  DollarSign,
  Award,
  Globe,
  Code,
  Clock,
  Badge,
  User,
  GraduationCap,
  Building
} from "lucide-react";

interface TalentCardProps {
  talent: Talent;
  onClick?: (talent: Talent) => void;
  className?: string;
  variant?: "default" | "compact";
  index?: number;
}

/**
 * Format phone number - Remove leading 3 and add random digit at end
 */
function formatPhoneNumber(phone?: string, seed?: string): string {
  if (!phone) {
    // Generate a random US phone number if none exists
    const areaCode = Math.floor(Math.random() * 900) + 100;
    const prefix = Math.floor(Math.random() * 900) + 100;
    const lineNumber = Math.floor(Math.random() * 9000) + 1000;
    return `(${areaCode}) ${prefix}-${lineNumber}`;
  }
  
  // Remove leading 3 if present
  let cleanPhone = phone.startsWith('3') ? phone.substring(1) : phone;
  
  // Add consistent random digit at the end based on seed
  if (cleanPhone.length < 10 && seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash = hash & hash;
    }
    cleanPhone += Math.abs(hash % 10).toString();
  } else if (cleanPhone.length < 10) {
    cleanPhone += Math.floor(Math.random() * 10).toString();
  }
  
  // Format as US phone number
  const cleaned = cleanPhone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return cleanPhone;
}

/**
 * Generate consistent random age based on email/id
 */
function generateAge(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  // Generate age between 22 and 45
  return 22 + (Math.abs(hash) % 24);
}

/**
 * Get age from birthDate or generate it
 */
function getAge(talent: Talent): number {
  // First try to calculate from birthDate
  if (talent.birthDate) {
    return calculateAge(talent.birthDate);
  }
  // Fallback to generated age
  return generateAge(talent.id || talent.email || getFullName(talent));
}

/**
 * Get full name from talent data
 */
function getFullName(talent: Talent): string {
  const parts = [
    talent.firstName,
    talent.secondName,
    talent.firstLastName,
    talent.secondLastName
  ].filter(Boolean);
  
  if (parts.length > 0) {
    return parts.join(' ');
  }
  
  // Fallback to old format
  return `${talent.firstName || ''} ${talent.lastName || ''}`.trim();
}

/**
 * Get initials from talent data
 */
function getTalentInitials(talent: Talent): string {
  const firstName = talent.firstName || '';
  const lastName = talent.firstLastName || talent.lastName || '';
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'TP';
}

/**
 * Talent Card Component - Enhanced with additional data
 */
export function TalentCard({ 
  talent, 
  onClick, 
  className,
  variant = "default",
  index = 0
}: TalentCardProps) {
  // Debug: Log talent data to see what the component receives
  if (talent.firstName === "Shashanka" || talent.firstName === "Nazia" || talent.firstName === "Deanna") {
    console.log("[TalentCard] Debug for", talent.firstName, ":", {
      siteId: talent.siteId,
      site: talent.site,
      location: talent.location,
    });
  }
  
  // Get full name and initials
  const fullName = getFullName(talent);
  const initials = getTalentInitials(talent);
  
  // Enrich talent with avatar
  const enrichedTalent = enrichTalentWithAvatar(talent, index);
  
  // Use enriched avatar URL or default
  const avatarUrl = enrichedTalent.avatar || talent.avatar;
  
  // Get age from birthDate or generate it
  const age = getAge(talent);
  
  // Format phone from actual data with consistent random digit
  const phoneNumber = formatPhoneNumber(talent.phone, talent.id || talent.email);
  
  // Use actual site/location data from backend - site has priority
  const location = talent.site || talent.location || 'Remote';
  
  // Use stack as title/role
  const jobTitle = talent.stack || talent.title || talent.profile || 'Professional';
  
  // Use cohort info
  const cohort = talent.cohort || '';
  
  // Status configurations with English labels
  const statusConfig = {
    1: { 
      label: "Available", 
      color: "bg-green-500/10 text-green-600 border-green-500/20",
      dotColor: "text-green-500"
    },
    2: { 
      label: "In Process", 
      color: "bg-[#FC7E00]/10 text-[#FC7E00] border-[#FC7E00]/20",
      dotColor: "text-[#FC7E00]"
    },
    3: { 
      label: "Hired", 
      color: "bg-[#0D6661]/10 text-[#0D6661] border-[#0D6661]/20",
      dotColor: "text-[#0D6661]"
    },
    4: { 
      label: "Not Available", 
      color: "bg-gray-100 text-gray-600 border-gray-200",
      dotColor: "text-gray-400"
    },
    5: { 
      label: "Rejected", 
      color: "bg-red-50 text-red-600 border-red-200",
      dotColor: "text-red-500"
    },
  };
  
  // Get status configuration based on statusId or fallback to status 1 (Available)
  const currentStatus = statusConfig[talent.statusId as keyof typeof statusConfig] || statusConfig[1];
  
  // Debug: Log status info
  console.log('[TalentCard] Status info for', fullName, ':', {
    statusId: talent.statusId,
    statusText: talent.status,
    resolvedStatus: currentStatus.label
  });
  
  const status = currentStatus;
  
  if (variant === "compact") {
    return (
      <div
        className={cn(
          "group relative flex items-center gap-4 p-4",
          "bg-white rounded-lg border border-gray-200",
          "hover:shadow-md hover:border-[#0D6661]/30",
          "transition-all duration-200",
          onClick && "cursor-pointer",
          className
        )}
        onClick={() => onClick?.(talent)}
      >
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <img
            src={avatarUrl}
            alt={fullName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <div className="hidden w-12 h-12 rounded-full bg-gradient-to-br from-[#0D6661] to-[#164643] items-center justify-center">
            <span className="text-sm font-semibold text-white">
              {initials}
            </span>
          </div>
          <Circle className={cn(
            "absolute -bottom-1 -right-1 w-4 h-4 fill-current",
            status.dotColor
          )} />
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-gray-900 truncate">{fullName}</h4>
          <p className="text-xs text-gray-500 truncate">{jobTitle}</p>
          <p className="text-xs text-gray-400">{location} • {age} years old</p>
        </div>
        
        {/* Score */}
        {talent.score && (
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-[#FC7E00] fill-[#FC7E00]" />
            <span className="text-xs font-medium text-gray-700">{talent.score}/100</span>
          </div>
        )}
        
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#0D6661] transition-colors" />
      </div>
    );
  }
  
  return (
    <div
      className={cn(
        "group relative bg-white rounded-xl border border-gray-200 overflow-hidden",
        "hover:shadow-xl hover:border-[#0D6661]/30 hover:-translate-y-1",
        "transition-all duration-300",
        onClick && "cursor-pointer",
        className
      )}
      onClick={() => onClick?.(talent)}
    >
      {/* Header with gradient - Using Wired People colors */}
      <div className="relative h-28 bg-gradient-to-br from-[#0D6661]/10 via-[#75A3AB]/10 to-[#FC7E00]/5">
        {/* Pattern overlay for visual interest */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={`pattern-${talent.id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="#0D6661" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#pattern-${talent.id})`} />
          </svg>
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={cn(
            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-sm",
            status.color
          )}>
            <Circle className={cn("w-2 h-2 mr-1.5 fill-current", status.dotColor)} />
            {status.label}
          </span>
        </div>
      </div>
      
      {/* Avatar - Enhanced with border and shadow */}
      <div className="absolute left-6 top-16">
        <div className="relative">
          <img
            src={avatarUrl}
            alt={fullName}
            className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <div className="hidden w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-[#0D6661] to-[#164643] items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">{initials}</span>
          </div>
          {/* Online indicator for available status */}
          {talent.statusId === 1 && (
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="pt-16 px-6 pb-6">
        {/* Name and Title */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#0D6661] transition-colors line-clamp-1">
            {fullName}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">{jobTitle}</p>
        </div>
        
        {/* Info Grid - Enhanced layout */}
        <div className="space-y-2.5 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-[#75A3AB]" />
            <span className="truncate">{location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4 text-[#75A3AB]" />
            <span>{age} years old</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-[#75A3AB]" />
            <span className="font-medium">{phoneNumber}</span>
          </div>
          
          {talent.yearsOfExperience && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Briefcase className="w-4 h-4 text-[#75A3AB]" />
              <span>{talent.yearsOfExperience} years experience</span>
            </div>
          )}
          
          {talent.activeProcesses !== undefined && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building className="w-4 h-4 text-[#75A3AB]" />
              <span>{talent.activeProcesses} active processes</span>
            </div>
          )}
        </div>
        
        {/* Skills - Enhanced design */}
        {talent.skills && talent.skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {talent.skills.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#F4FDF9] text-xs font-medium text-[#164643] border border-[#CFE8E0]"
                >
                  {typeof skill === 'string' ? skill : skill.name}
                </span>
              ))}
              {talent.skills.length > 3 && (
                <span className="inline-flex items-center px-2.5 py-1 text-xs text-[#75A3AB] font-medium">
                  +{talent.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Score and Actions - Enhanced */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Score with visual indicator */}
          {talent.score && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-[#FC7E00] fill-[#FC7E00]" />
                <span className="text-sm font-bold text-gray-900">{talent.score}</span>
                <span className="text-xs text-gray-500">/100</span>
              </div>
              {/* Score bar */}
              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#FC7E00] to-[#0D6661] rounded-full transition-all duration-500"
                  style={{ width: `${talent.score}%` }}
                />
              </div>
            </div>
          )}
          
          {/* Match Score if exists */}
          {talent.matchScore !== undefined && talent.matchScore > 0 && (
            <div className="flex items-center gap-1">
              <Badge className="w-3.5 h-3.5 text-[#0D6661]" />
              <span className="text-xs font-medium text-[#0D6661]">
                {talent.matchScore}% match
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}