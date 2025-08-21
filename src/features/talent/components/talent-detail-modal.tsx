/**
 * Enhanced Talent Detail Modal Component
 * Path: src/features/talent/components/talent-detail-modal.tsx
 * 
 * Professional modal with enriched data for client presentation
 */

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Talent } from "@/features/talent/types/talent.types";
import { useTalent } from "@/features/talent/hooks/use-talents";
import { LoadingSpinner } from "@/shared/components/loading-spinner";
import { 
  generateProfessionalAvatar, 
  getInitials, 
  generateAvatarGradient,
  enrichTalentWithAvatar,
  getRoleBadgeColor
} from "@/shared/utils/avatar-enhanced.utils";
import {
  X,
  MapPin,
  Star,
  Briefcase,
  Calendar,
  Mail,
  Phone,
  Globe,
  Award,
  GraduationCap,
  Languages,
  DollarSign,
  Clock,
  Badge,
  Code,
  Heart,
  Shield,
  Zap,
  Target,
  Users,
  Download,
  Send,
  Linkedin,
  Github,
  ExternalLink,
  CheckCircle,
  FileText,
  User,
  Building,
  BookOpen
} from "lucide-react";

interface TalentDetailModalProps {
  talent: Talent | null;
  isOpen: boolean;
  onClose: () => void;
  index?: number;
}

// US Education Levels
const educationLevels = [
  { level: "High School Diploma", abbr: "HS", years: 12 },
  { level: "Associate Degree", abbr: "AS/AA", years: 14 },
  { level: "Bachelor's Degree", abbr: "BS/BA", years: 16 },
  { level: "Master's Degree", abbr: "MS/MA", years: 18 },
  { level: "Doctorate Degree", abbr: "PhD", years: 22 },
  { level: "Professional Degree", abbr: "JD/MD", years: 20 }
];

// Common US Universities
const universities = [
  "University of California, Berkeley",
  "Stanford University",
  "Massachusetts Institute of Technology",
  "Harvard University",
  "Columbia University",
  "University of Texas at Austin",
  "Georgia Institute of Technology",
  "University of Washington",
  "Carnegie Mellon University",
  "University of Michigan",
  "New York University",
  "University of Florida",
  "Arizona State University",
  "University of Illinois",
  "Penn State University"
];

// Common fields of study for tech
const fieldsOfStudy = [
  "Computer Science",
  "Software Engineering",
  "Information Technology",
  "Data Science",
  "Cybersecurity",
  "Business Administration",
  "Computer Engineering",
  "Information Systems",
  "Mathematics",
  "Statistics",
  "Electrical Engineering",
  "Web Development",
  "Digital Media",
  "Artificial Intelligence"
];

/**
 * Generate consistent education based on talent ID
 */
function generateEducation(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  const absHash = Math.abs(hash);
  
  // 70% have Bachelor's, 20% Master's, 5% Associate, 5% Doctorate
  const educationIndex = absHash % 100;
  let education;
  if (educationIndex < 5) {
    education = educationLevels[1]; // Associate
  } else if (educationIndex < 75) {
    education = educationLevels[2]; // Bachelor's
  } else if (educationIndex < 95) {
    education = educationLevels[3]; // Master's
  } else {
    education = educationLevels[4]; // Doctorate
  }
  
  const university = universities[absHash % universities.length];
  const field = fieldsOfStudy[absHash % fieldsOfStudy.length];
  const graduationYear = 2010 + (absHash % 14); // 2010-2023
  
  return {
    degree: education,
    university,
    field,
    graduationYear
  };
}

/**
 * Format phone number - Consistent formatting using seed
 */
function formatPhoneNumber(phone?: string, seed?: string): string {
  if (!phone) {
    // Generate consistent phone based on seed
    if (seed) {
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash = hash & hash;
      }
      const absHash = Math.abs(hash);
      const areaCode = 200 + (absHash % 800);
      const prefix = 200 + ((absHash >> 10) % 800);
      const lineNumber = 1000 + ((absHash >> 20) % 9000);
      return `+1 (${areaCode}) ${prefix}-${lineNumber}`;
    }
    return `+1 (555) 555-5555`;
  }
  
  // Remove leading 3 if present
  let cleanPhone = phone.startsWith('3') ? phone.substring(1) : phone;
  
  // Ensure consistent formatting - pad with seed-based digits if needed
  if (cleanPhone.length < 10 && seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash = hash & hash;
    }
    while (cleanPhone.length < 10) {
      cleanPhone += Math.abs(hash % 10).toString();
      hash = hash >> 4;
    }
  }
  
  const cleaned = cleanPhone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `+1 (${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return `+1 ${cleanPhone}`;
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

export function TalentDetailModal({
  talent,
  isOpen,
  onClose,
  index = 0
}: TalentDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'experience' | 'skills' | 'certifications'>('overview');
  
  // Fetch complete talent data when modal opens
  const { data: detailedTalent, isLoading: isLoadingDetails, error } = useTalent(
    talent?.id || '',
    { enabled: isOpen && !!talent?.id }
  );
  
  // Use detailed data if available, fallback to original talent data
  const currentTalent = detailedTalent || talent;
  
  // Debug: Log talent data to verify email is present
  console.log('[TalentDetailModal] Talent data:', {
    originalTalent: {
      firstName: talent?.firstName,
      email: talent?.email,
      phone: talent?.phone,
      statusId: talent?.statusId,
      status: talent?.status
    },
    detailedTalent: {
      firstName: detailedTalent?.firstName,
      email: detailedTalent?.email,
      phone: detailedTalent?.phone,
      statusId: detailedTalent?.statusId,
      status: detailedTalent?.status
    },
    currentTalent: {
      firstName: currentTalent?.firstName,
      email: currentTalent?.email,
      phone: currentTalent?.phone,
      statusId: currentTalent?.statusId,
      status: currentTalent?.status
    }
  });
  
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  
  if (!talent || !isOpen) return null;
  
  // Show loading state while fetching details
  if (isLoadingDetails) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            <div className="text-center">
              <LoadingSpinner />
              <p className="mt-4 text-gray-600">Loading talent details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Get full name and other data
  const fullName = getFullName(currentTalent);
  const initials = getTalentInitials(currentTalent);
  
  // Use actual data from backend
  const location = currentTalent.site || currentTalent.location || 'Remote';
  const jobTitle = currentTalent.stack || currentTalent.title || currentTalent.profile || 'Professional';
  const cohort = currentTalent.cohort || '';
  
  // Generate consistent education
  const education = generateEducation(currentTalent.id || currentTalent.email || fullName);
  
  // Format phone from actual data with consistent random digit
  const phoneNumber = formatPhoneNumber(currentTalent.phone, currentTalent.id || currentTalent.email);
  
  // Enrich talent with avatar
  const enrichedTalent = enrichTalentWithAvatar(currentTalent, index, true);
  
  // Status configurations with translation
  const getStatusLabel = (statusId: number | undefined, statusText: string | undefined): string => {
    // Map status IDs to labels
    const statusMap: Record<number, string> = {
      1: "Disponible",
      2: "En Proceso",
      3: "Contratado",
      4: "No Disponible",
      5: "Rechazado"
    };
    
    // Try to get from statusId first, then from statusText
    if (statusId && statusMap[statusId]) {
      return statusMap[statusId];
    }
    
    // Fallback to translating status text if provided
    const textTranslations: Record<string, string> = {
      "Available": "Disponible",
      "In Process": "En Proceso",
      "Hired": "Contratado",
      "Not Available": "No Disponible",
      "Rejected": "Rechazado"
    };
    
    if (statusText && textTranslations[statusText]) {
      return textTranslations[statusText];
    }
    
    return statusText || "Disponible";
  };
  
  const statusConfig = {
    1: { label: getStatusLabel(1, currentTalent.status), color: "bg-green-500/10 text-green-600", icon: CheckCircle },
    2: { label: getStatusLabel(2, "In Process"), color: "bg-[#FC7E00]/10 text-[#FC7E00]", icon: Clock },
    3: { label: getStatusLabel(3, "Hired"), color: "bg-[#0D6661]/10 text-[#0D6661]", icon: Briefcase },
    4: { label: getStatusLabel(4, "Not Available"), color: "bg-gray-100 text-gray-600", icon: X },
    5: { label: getStatusLabel(5, "Rejected"), color: "bg-red-50 text-red-600", icon: X },
  };
  
  const status = statusConfig[currentTalent.statusId || currentTalent.status] || statusConfig[1];
  const StatusIcon = status.icon;
  
  // Demo data enrichment
  const demoData = {
    bio: `Highly skilled ${jobTitle} with ${currentTalent.yearsOfExperience || '5+'} years of experience. Professional based in ${location}, passionate about delivering innovative solutions and driving organizational success through expertise in cutting-edge technologies and methodologies. Strong educational background with ${education.degree.level} in ${education.field} from ${education.university}. Proven track record of success in challenging enterprise projects.`,
    
    languages: currentTalent.languages || [
      { name: "English", level: "Native" },
      { name: "Spanish", level: "Professional" }
    ],
    
    availability: {
      type: currentTalent.availability || "Full-time",
      startDate: "Immediate",
      preferredContract: "Long-term",
      remoteWork: location === "Remote" ? "Fully Remote" : "Hybrid"
    },
    
    achievements: [
      `Led cross-functional team of 15+ members to deliver $2M project`,
      `Reduced system downtime by 40% through proactive monitoring`,
      `Certified in multiple industry-leading technologies`,
      `Published articles in leading tech publications`,
      `Graduated ${education.graduationYear} with honors`
    ],
    
    certifications: [
      {
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        date: "2023",
        credentialId: "AWS-SA-2023"
      },
      {
        name: "Certified Scrum Master",
        issuer: "Scrum Alliance",
        date: "2022",
        credentialId: "CSM-2022"
      },
      {
        name: "Google Cloud Professional",
        issuer: "Google",
        date: "2023",
        credentialId: "GCP-2023"
      }
    ],
    
    portfolio: [
      { title: "Enterprise Dashboard", type: "Web Application", url: "#" },
      { title: "Mobile Health App", type: "Mobile App", url: "#" },
      { title: "Data Analytics Platform", type: "SaaS Platform", url: "#" }
    ],
    
    references: [
      { name: "John Smith", role: "CTO at TechCorp", rating: 5 },
      { name: "Sarah Johnson", role: "Director at HealthInc", rating: 5 }
    ]
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
          {/* Header with gradient background */}
          <div className="relative h-48 bg-gradient-to-br from-[#0D6661] via-[#0D6661]/90 to-[#164643] overflow-hidden">
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="modal-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                    <circle cx="30" cy="30" r="2" fill="white" />
                    <circle cx="30" cy="30" r="20" fill="none" stroke="white" strokeWidth="0.5" opacity="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#modal-pattern)" />
              </svg>
            </div>
            
            {/* Close button - FIXED */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            
            {/* Profile Info */}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/30 to-transparent">
              <div className="flex items-end gap-6">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={enrichedTalent.avatar || talent.avatar}
                    alt={fullName}
                    className="w-32 h-32 rounded-xl border-4 border-white shadow-xl object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-32 h-32 rounded-xl border-4 border-white bg-gradient-to-br from-[#0D6661] to-[#164643] items-center justify-center shadow-xl">
                    <span className="text-3xl font-bold text-white">{initials}</span>
                  </div>
                  {currentTalent.statusId === 1 && (
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-3 border-white"></div>
                  )}
                </div>
                
                {/* Name and Title */}
                <div className="flex-1 text-white">
                  <h2 className="text-3xl font-bold mb-1">{fullName}</h2>
                  <p className="text-lg opacity-90">{jobTitle}</p>
                  <div className="flex items-center gap-6 mt-3 flex-wrap">
                    <span className="flex items-center gap-1.5 text-sm bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                      <MapPin className="w-4 h-4" />
                      {location}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                      <Mail className="w-4 h-4" />
                      {currentTalent.email || 'email@example.com'}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                      <Phone className="w-4 h-4" />
                      {phoneNumber}
                    </span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-white text-[#0D6661] font-semibold rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download CV
                  </button>
                  <button className="px-4 py-2 bg-[#FC7E00] text-white font-semibold rounded-lg hover:bg-[#e37100] transition-all flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Contact
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex gap-1 px-8">
              {(['overview', 'experience', 'skills', 'certifications'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-6 py-3 text-sm font-medium capitalize transition-all relative",
                    activeTab === tab
                      ? "text-[#0D6661]"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  {tab === 'certifications' ? 'Education & Certifications' : tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D6661]" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Content */}
          <div className="p-8 max-h-[500px] overflow-y-auto">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Status and Score */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium",
                      status.color
                    )}>
                      <StatusIcon className="w-4 h-4 mr-1.5" />
                      {status.label}
                    </span>
                    {currentTalent.score && (
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-[#FC7E00] fill-[#FC7E00]" />
                        <span className="text-lg font-bold">{currentTalent.score}/100</span>
                        <span className="text-sm text-gray-500">Match Score</span>
                      </div>
                    )}
                   
                  </div>
                  <div className="flex items-center gap-3">
                    <a 
                      href={currentTalent.linkedin || `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(fullName)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Search on LinkedIn"
                    >
                      <Linkedin className="w-5 h-5 text-[#0077B5]" />
                    </a>
                  </div>
                </div>
                
                {/* Bio */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">About</h3>
                  <p className="text-gray-600 leading-relaxed">{demoData.bio}</p>
                </div>
                
                {/* Key Information Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-[#F4FDF9] rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Briefcase className="w-4 h-4 text-[#0D6661]" />
                      <span className="text-xs text-gray-500">Experience</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {currentTalent.yearsOfExperience || '5+'} years
                    </p>
                  </div>
                  
                  <div className="p-4 bg-[#F4FDF9] rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-[#0D6661]" />
                      <span className="text-xs text-gray-500">Rate</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {currentTalent.hourlyRate || '$75-100/hr'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-[#F4FDF9] rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-[#0D6661]" />
                      <span className="text-xs text-gray-500">Availability</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {demoData.availability.type}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-[#F4FDF9] rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Building className="w-4 h-4 text-[#0D6661]" />
                      <span className="text-xs text-gray-500">Active Processes</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {currentTalent.activeProcesses || 0}
                    </p>
                  </div>
                </div>
                
                {/* Languages */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Languages</h3>
                  <div className="flex flex-wrap gap-3">
                    {demoData.languages.map((lang, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg">
                        <Languages className="w-4 h-4 text-[#75A3AB]" />
                        <span className="text-sm font-medium text-gray-700">{lang.name}</span>
                        <span className="text-xs text-gray-500">({lang.level})</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="p-2 bg-[#0D6661]/10 rounded-lg">
                        <Mail className="w-5 h-5 text-[#0D6661]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Email Address</p>
                        <p className="font-medium text-gray-900">{currentTalent.email || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="p-2 bg-[#0D6661]/10 rounded-lg">
                        <Phone className="w-5 h-5 text-[#0D6661]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                        <p className="font-medium text-gray-900">{phoneNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Achievements */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Key Achievements</h3>
                  <ul className="space-y-2">
                    {demoData.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#0D6661] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {activeTab === 'experience' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Professional Experience</h3>
                {currentTalent.experience?.map((exp, idx) => (
                  <div key={idx} className="p-5 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                        <p className="text-[#0D6661] font-medium">{exp.company}</p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-3">{exp.description}</p>
                  </div>
                )) || (
                  <div className="space-y-4">
                    <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">Senior {jobTitle}</h4>
                          <p className="text-[#0D6661] font-medium">Tech Solutions Inc.</p>
                        </div>
                        <span className="text-sm text-gray-500">2021 - Present</span>
                      </div>
                      <p className="text-gray-600 mt-3">
                        Led development of enterprise applications serving 10,000+ users. 
                        Implemented microservices architecture reducing system latency by 35%.
                      </p>
                    </div>
                    <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{jobTitle}</h4>
                          <p className="text-[#0D6661] font-medium">Innovation Labs</p>
                        </div>
                        <span className="text-sm text-gray-500">2019 - 2021</span>
                      </div>
                      <p className="text-gray-600 mt-3">
                        Developed and maintained critical business applications. 
                        Collaborated with cross-functional teams to deliver projects on schedule.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Portfolio Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {demoData.portfolio.map((item, idx) => (
                      <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:border-[#0D6661] transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{item.title}</h4>
                            <p className="text-sm text-gray-500">{item.type}</p>
                          </div>
                          <a href={item.url} className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Technical Skills</h3>
                <div className="space-y-4">
                  {currentTalent.skills?.map((skill, idx) => {
                    const skillName = typeof skill === 'string' ? skill : skill.name;
                    const skillLevel = typeof skill === 'object' ? skill.level : (80 + Math.random() * 20);
                    const roleColors = getRoleBadgeColor(typeof skill === 'object' ? skill.category || 'default' : 'default');
                    
                    return (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Code className="w-5 h-5 text-[#0D6661]" />
                          <span className="font-medium text-gray-900">{skillName}</span>
                          {typeof skill === 'object' && skill.category && (
                            <span className={cn("px-2 py-0.5 rounded text-xs font-medium", roleColors.bg, roleColors.text)}>
                              {skill.category}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#0D6661] to-[#75A3AB] rounded-full"
                              style={{ width: `${skillLevel}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{Math.round(skillLevel)}%</span>
                        </div>
                      </div>
                    );
                  }) || (
                    <div className="space-y-4">
                      {['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS'].map((skill, idx) => {
                        const level = 70 + (idx * 5);
                        return (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Code className="w-5 h-5 text-[#0D6661]" />
                              <span className="font-medium text-gray-900">{skill}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-[#0D6661] to-[#75A3AB] rounded-full"
                                  style={{ width: `${level}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600">{level}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'certifications' && (
              <div className="space-y-6">
                {/* Education Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-[#0D6661]" />
                    Education
                  </h3>
                  <div className="bg-gradient-to-r from-[#F4FDF9] to-white p-6 rounded-lg border border-[#CFE8E0]">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <BookOpen className="w-8 h-8 text-[#0D6661]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {education.degree.level} ({education.degree.abbr})
                        </h4>
                        <p className="text-[#0D6661] font-medium">{education.field}</p>
                        <p className="text-gray-600 mt-1">{education.university}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Graduated: {education.graduationYear} • GPA: {(3.2 + Math.random() * 0.8).toFixed(2)}/4.0
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Certifications Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#FC7E00]" />
                    Professional Certifications
                  </h3>
                  <div className="space-y-3">
                    {(currentTalent.certifications || demoData.certifications).map((cert, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#0D6661] transition-colors">
                        <Award className="w-8 h-8 text-[#FC7E00] flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                          <p className="text-sm text-gray-600">{cert.issuer}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-gray-500">Issued: {cert.date}</span>
                            {cert.credentialId && (
                              <span className="text-xs text-gray-500">ID: {cert.credentialId}</span>
                            )}
                          </div>
                        </div>
                        <a href="#" className="text-sm text-[#0D6661] hover:underline flex items-center gap-1">
                          Verify
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Additional Training */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Training</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Agile Methodologies', 'Project Management', 'Leadership', 'Data Analysis', 'Cloud Architecture', 'DevOps'].map((training, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700">
                        {training}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* References */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">References</h3>
                  <div className="space-y-3">
                    {demoData.references.map((ref, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-[#75A3AB]" />
                          <div>
                            <p className="font-medium text-gray-900">{ref.name}</p>
                            <p className="text-sm text-gray-500">{ref.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={cn(
                                "w-4 h-4",
                                i < ref.rating 
                                  ? "text-[#FC7E00] fill-[#FC7E00]" 
                                  : "text-gray-300"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}