/**
 * Process Detail Modal Component
 * Path: src/features/processes/presentation/components/process-detail-modal.tsx
 */

"use client";

import { useState, useEffect } from "react";
import { ProcessStatus } from "../../domain/value-objects/process-status.vo";
import { ProcessPriority } from "../../domain/value-objects/process-priority.vo";
import { enhanceProcessData } from "@/shared/utils/process-mock-data.utils";
import { cn } from "@/lib/utils";
import { 
  X,
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign,
  Briefcase,
  AlertCircle,
  TrendingUp,
  Star,
  Building2,
  Target,
  Phone,
  Mail,
  Globe,
  User,
  FileText,
  CheckCircle,
  Circle,
  ArrowRight,
  Badge,
  Award,
  Zap,
  Eye,
  Edit,
  Share2,
  BookOpen,
  GraduationCap,
  ExternalLink
} from "lucide-react";

interface ProcessDetailModalProps {
  process: any;
  isOpen: boolean;
  onClose: () => void;
  index?: number;
}

export function ProcessDetailModal({ process: rawProcess, isOpen, onClose, index = 0 }: ProcessDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'candidates' | 'timeline'>('overview');
  
  if (!isOpen || !rawProcess) return null;

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
        "inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full border",
        color
      )}>
        <span className="w-2 h-2 rounded-full bg-current mr-2" />
        {label}
      </span>
    );
  };

  // Get priority indicator
  const getPriorityBadge = () => {
    if (!process.priority) return null;
    
    const priorityConfig: Record<number, { color: string, icon: any, label: string, bgColor: string }> = {
      [ProcessPriority.LOW]: { 
        color: "text-gray-600", 
        bgColor: "bg-gray-100",
        icon: Circle,
        label: "Low Priority"
      },
      [ProcessPriority.MEDIUM]: { 
        color: "text-blue-600", 
        bgColor: "bg-blue-50",
        icon: Circle,
        label: "Medium Priority"
      },
      [ProcessPriority.HIGH]: { 
        color: "text-[#FC7E00]", 
        bgColor: "bg-orange-50",
        icon: TrendingUp,
        label: "High Priority"
      },
      [ProcessPriority.URGENT]: { 
        color: "text-red-600", 
        bgColor: "bg-red-50",
        icon: AlertCircle,
        label: "Urgent Priority"
      },
    };
    
    const config = priorityConfig[process.priority] || priorityConfig[ProcessPriority.MEDIUM];
    const Icon = config.icon;
    
    return (
      <span className={cn(
        "inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full border",
        config.color,
        config.bgColor
      )}>
        <Icon className="w-4 h-4 mr-2" />
        {config.label}
      </span>
    );
  };

  // Mock data for enhanced presentation
  const mockJobDescription = `We are seeking a talented ${process.name} to join our growing team. This role is perfect for someone who wants to make a real impact in ${process.department || 'our organization'}.

Key Responsibilities:
• Lead and manage projects from conception to completion
• Collaborate with cross-functional teams to deliver high-quality solutions
• Analyze data and provide insights to drive business decisions
• Mentor junior team members and contribute to team growth
• Stay current with industry trends and best practices

What We Offer:
• Competitive salary and comprehensive benefits package
• Flexible work arrangements and remote work options
• Professional development opportunities and training budget
• Collaborative and inclusive work environment
• Opportunity to work on cutting-edge projects`;

  const mockCandidates = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "👩‍💼",
      role: "Senior Developer",
      score: 95,
      status: "Interview Scheduled",
      skills: ["React", "TypeScript", "Node.js"],
      experience: "8 years"
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "👨‍💻",
      role: "Full Stack Engineer",
      score: 88,
      status: "Technical Review",
      skills: ["Python", "AWS", "Docker"],
      experience: "6 years"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      avatar: "👩‍🔬",
      role: "Data Scientist",
      score: 92,
      status: "Pending Review",
      skills: ["Python", "ML", "Statistics"],
      experience: "5 years"
    }
  ];

  const mockTimeline = [
    {
      date: "2024-08-15",
      title: "Position Opened",
      description: "Job posting published and recruitment initiated",
      status: "completed",
      icon: CheckCircle
    },
    {
      date: "2024-08-17",
      title: "Applications Received",
      description: "First batch of applications received and reviewed",
      status: "completed",
      icon: CheckCircle
    },
    {
      date: "2024-08-20",
      title: "Initial Screening",
      description: "Candidate screening and shortlisting in progress",
      status: "current",
      icon: Circle
    },
    {
      date: "2024-08-25",
      title: "Technical Interviews",
      description: "Technical assessment and interviews scheduled",
      status: "upcoming",
      icon: Circle
    },
    {
      date: "2024-09-01",
      title: "Final Selection",
      description: "Final candidate selection and offer preparation",
      status: "upcoming",
      icon: Circle
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'requirements', label: 'Requirements', icon: FileText },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'timeline', label: 'Timeline', icon: Calendar }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-[#0D6661] to-[#164643] text-white p-6">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="modal-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="1.5" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#modal-pattern)" />
              </svg>
            </div>
            
            <div className="relative flex justify-between items-start">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-3 mb-2">
                  {process.icon && (
                    <span className="text-2xl">{process.icon}</span>
                  )}
                  <h2 className="text-2xl font-bold">{process.name}</h2>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex items-center gap-2 text-white/80">
                    <Building2 className="w-4 h-4" />
                    {process.companyName || "Wired People Inc."}
                  </span>
                  {process.department && (
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                      {process.department}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-3">
                  {getStatusBadge()}
                  {getPriorityBadge()}
                </div>
              </div>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors",
                      activeTab === tab.id
                        ? "border-[#0D6661] text-[#0D6661] bg-[#F4FDF9]"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-[#F4FDF9] rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Users className="w-8 h-8 text-[#0D6661]" />
                      <div>
                        <p className="text-sm text-gray-600">Positions</p>
                        <p className="text-xl font-bold text-[#0D6661]">
                          {process.studentsCount || 0}/{process.vacancies}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-8 h-8 text-[#FC7E00]" />
                      <div>
                        <p className="text-sm text-gray-600">Salary Range</p>
                        <p className="text-xl font-bold text-[#FC7E00]">
                          ${(process.salaryMin / 1000).toFixed(0)}k - ${(process.salaryMax / 1000).toFixed(0)}k
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="text-lg font-bold text-blue-600">
                          {process.remote ? "Remote" : process.location}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-8 h-8 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-600">Deadline</p>
                        <p className="text-lg font-bold text-purple-600">
                          {process.daysUntilDeadline} days
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#0D6661]" />
                    Job Description
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                      {mockJobDescription}
                    </pre>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#0D6661]" />
                    Contact Information
                  </h3>
                  <div className="bg-[#F4FDF9] rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-[#0D6661]" />
                      <span className="text-gray-700">recruitment@wiredpeopleinc.com</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-[#0D6661]" />
                      <span className="text-gray-700">+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-[#0D6661]" />
                      <span className="text-gray-700">www.wiredpeopleinc.com</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'requirements' && (
              <div className="space-y-6">
                {/* Required Skills */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#0D6661]" />
                    Required Skills
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {process.requiredSkills?.map((skill: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-[#F4FDF9] rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#0D6661] rounded-lg flex items-center justify-center">
                            <Badge className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{skill.name}</p>
                            <p className="text-sm text-gray-600">Level {skill.level || 'Intermediate'}</p>
                          </div>
                        </div>
                        {skill.required && (
                          <span className="text-xs bg-[#0D6661] text-white px-2 py-1 rounded">
                            Required
                          </span>
                        )}
                      </div>
                    )) || (
                      <p className="text-gray-500 col-span-2">No specific skills listed</p>
                    )}
                  </div>
                </div>

                {/* Education & Experience */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-[#0D6661]" />
                    Education & Experience
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Minimum Education</h4>
                      <p className="text-gray-700">Bachelor's degree in related field or equivalent experience</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Experience Required</h4>
                      <p className="text-gray-700">3-5 years of relevant professional experience</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Preferred Qualifications</h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Professional certifications in relevant technologies</li>
                        <li>• Experience in {process.department || 'similar role'}</li>
                        <li>• Strong communication and teamwork skills</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'candidates' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#0D6661]" />
                    Active Candidates ({mockCandidates.length})
                  </h3>
                  <button className="px-4 py-2 bg-[#0D6661] text-white rounded-lg hover:bg-[#164643] transition-colors">
                    Add Candidate
                  </button>
                </div>

                <div className="space-y-4">
                  {mockCandidates.map((candidate) => (
                    <div key={candidate.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#0D6661] rounded-full flex items-center justify-center text-white text-xl">
                            {candidate.avatar}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{candidate.name}</h4>
                            <p className="text-sm text-gray-600">{candidate.role} • {candidate.experience}</p>
                            <div className="flex gap-2 mt-1">
                              {candidate.skills.map((skill, idx) => (
                                <span key={idx} className="px-2 py-1 bg-[#CFE8E0] text-[#164643] text-xs rounded">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="font-bold text-lg">{candidate.score}</span>
                          </div>
                          <span className={cn(
                            "px-3 py-1 text-xs rounded-full",
                            candidate.status === "Interview Scheduled" ? "bg-green-100 text-green-700" :
                            candidate.status === "Technical Review" ? "bg-blue-100 text-blue-700" :
                            "bg-gray-100 text-gray-700"
                          )}>
                            {candidate.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#0D6661]" />
                  Recruitment Timeline
                </h3>

                <div className="space-y-4">
                  {mockTimeline.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            item.status === 'completed' ? "bg-green-100 text-green-600" :
                            item.status === 'current' ? "bg-[#FC7E00]/10 text-[#FC7E00]" :
                            "bg-gray-100 text-gray-400"
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>
                          {idx < mockTimeline.length - 1 && (
                            <div className={cn(
                              "w-0.5 h-8 mt-2",
                              item.status === 'completed' ? "bg-green-200" : "bg-gray-200"
                            )} />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-semibold text-gray-900">{item.title}</h4>
                            <span className="text-sm text-gray-500">{item.date}</span>
                          </div>
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  View Full Details
                </button>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-[#0D6661] text-white text-sm rounded-lg hover:bg-[#164643] transition-colors">
                  Edit Process
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}