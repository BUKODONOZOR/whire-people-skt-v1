/**
 * Users Page - Placeholder
 * This page is under development
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, Users, ArrowLeft } from "lucide-react";

export default function UsersPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F4FDF9] via-white to-gray-50">
      {/* Header */}
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
        
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium mb-4 border border-white/20">
              <Building2 className="w-3.5 h-3.5" />
              <span>Wired People Platform</span>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              User
              <span className="text-[#FC7E00]"> Management</span>
            </h1>
            
            {/* Description */}
            <p className="text-lg text-white/90 mb-6 leading-relaxed">
              Manage system users, roles, and permissions.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
          <div className="text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#CFE8E0] rounded-full mb-6">
              <Users className="w-10 h-10 text-[#0D6661]" />
            </div>
            
            {/* Message */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              User Management Module
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              This module is currently under development. User management features will be available soon.
            </p>
            
            {/* Coming Soon Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
              <div className="p-4 bg-[#F4FDF9] rounded-lg border border-[#CFE8E0]">
                <div className="text-[#0D6661] text-2xl mb-2">👤</div>
                <h3 className="font-medium text-gray-900 mb-1">User Profiles</h3>
                <p className="text-sm text-gray-600">Manage user information and preferences</p>
              </div>
              <div className="p-4 bg-[#F4FDF9] rounded-lg border border-[#CFE8E0]">
                <div className="text-[#0D6661] text-2xl mb-2">🔑</div>
                <h3 className="font-medium text-gray-900 mb-1">Roles & Permissions</h3>
                <p className="text-sm text-gray-600">Control access and user capabilities</p>
              </div>
              <div className="p-4 bg-[#F4FDF9] rounded-lg border border-[#CFE8E0]">
                <div className="text-[#0D6661] text-2xl mb-2">📊</div>
                <h3 className="font-medium text-gray-900 mb-1">Activity Tracking</h3>
                <p className="text-sm text-gray-600">Monitor user activities and engagement</p>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => router.push('/talent')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0D6661] hover:bg-[#164643] text-white rounded-lg font-medium transition-colors"
              >
                View Talent Pool
              </button>
              <button
                onClick={() => router.push('/processes')}
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                View Processes
              </button>
            </div>
            
            {/* Back Link */}
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 mt-8 text-sm text-[#0D6661] hover:text-[#164643] font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}