/**
 * Home/Dashboard Page with Wired People Branding
 * Path: src/app/page.tsx
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/shared/components/layouts/dashboard-layout";
import { WiredPeopleLogo, WiredPeopleIconSVG } from "@/shared/components/ui/logos";
import { authService } from "@/features/auth/services/auth.service";
import { LoadingSpinner } from "@/shared/components/loading-spinner";
import { 
  Users, 
  Target, 
  BarChart3, 
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Calendar,
  Briefcase,
  DollarSign,
  Activity
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      setIsReady(true);
    } else {
      window.location.href = "/token";
    }
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F4FDF9] to-white">
        <LoadingSpinner />
      </div>
    );
  }

  // Mock data for dashboard with better icon contrast
  const stats = [
    {
      title: "Total Talent",
      value: "689",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-emerald-100", // Verde muy claro para contraste
      bgColor: "bg-[#0D6661]/25" // Fondo más visible
    },
    {
      title: "Active Processes",
      value: "93",
      change: "+5.2%",
      trend: "up",
      icon: Target,
      color: "text-orange-100", // Naranja muy claro para contraste
      bgColor: "bg-[#FC7E00]/25" // Fondo más visible
    },
    {
      title: "Placement Rate",
      value: "67.5%",
      change: "+3.1%",
      trend: "up",
      icon: TrendingUp,
      color: "text-cyan-100", // Cian muy claro para contraste
      bgColor: "bg-[#75A3AB]/25" // Fondo más visible
    },
    {
      title: "Avg Time to Hire",
      value: "21 days",
      change: "-4 days",
      trend: "down",
      icon: Clock,
      color: "text-teal-100", // Teal muy claro para contraste
      bgColor: "bg-[#164643]/25" // Fondo más visible
    }
  ];

  const recentActivities = [
    { type: "talent", action: "New candidate added", name: "John Smith", time: "2 hours ago", status: "new" },
    { type: "process", action: "Interview scheduled", name: "Senior Developer", time: "3 hours ago", status: "progress" },
    { type: "talent", action: "Profile updated", name: "Sarah Johnson", time: "5 hours ago", status: "update" },
    { type: "process", action: "Position filled", name: "Data Analyst", time: "1 day ago", status: "complete" },
  ];

  const quickActions = [
    { title: "Add New Talent", icon: Users, href: "/talent", color: "bg-[#0D6661]" },
    { title: "Create Process", icon: Target, href: "/processes", color: "bg-[#FC7E00]" },
    { title: "View Reports", icon: BarChart3, href: "/metrics", color: "bg-[#75A3AB]" },
    { title: "Manage Users", icon: Users, href: "/users", color: "bg-[#164643]" },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-b from-[#F4FDF9] via-white to-gray-50">
        {/* Hero Section with Logo */}
        <div className="relative bg-gradient-to-br from-[#0D6661] via-[#0D6661]/95 to-[#164643] overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hero-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                  <circle cx="40" cy="40" r="2" fill="white" />
                  <circle cx="40" cy="40" r="20" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
                  <circle cx="40" cy="40" r="35" fill="none" stroke="white" strokeWidth="0.3" opacity="0.2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-pattern)" />
            </svg>
          </div>

          {/* Content */}
          <div className="relative z-10 px-8 py-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                {/* Logo Display */}
                <div className="flex items-center gap-6">
                  <WiredPeopleIconSVG size="lg" theme="dark" />
                  <div>
                    <h1 className="text-4xl font-bold text-white">Welcome to Wired People</h1>
                    <p className="text-lg text-white/80 mt-2">Smart Talent Procurement Platform</p>
                  </div>
                </div>
                
                {/* Date and Time */}
                <div className="text-right text-white/80">
                  <p className="text-sm">Today is</p>
                  <p className="text-xl font-semibold">{new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                      <div className="flex items-center justify-between mb-4">
                        <div className={cn("p-3 rounded-lg", stat.bgColor)}>
                          <Icon className={cn("w-6 h-6", stat.color)} />
                        </div>
                        <span className={cn(
                          "text-sm font-medium px-2 py-1 rounded-full",
                          stat.trend === "up" ? "bg-green-500/20 text-green-300" : "bg-blue-500/20 text-blue-300"
                        )}>
                          {stat.change}
                        </span>
                      </div>
                      <h3 className="text-white/70 text-sm mb-1">{stat.title}</h3>
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#0D6661]" />
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        key={index}
                        href={action.href}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all group"
                      >
                        <div className={cn("p-2 rounded-lg text-white", action.color)}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="flex-1 text-gray-700 group-hover:text-[#0D6661] font-medium">
                          {action.title}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#0D6661] transition-transform group-hover:translate-x-1" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Company Overview */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#FC7E00]" />
                  Platform Overview
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Placements</span>
                    <span className="font-semibold text-gray-900">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Success Rate</span>
                    <span className="font-semibold text-green-600">92.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Companies</span>
                    <span className="font-semibold text-gray-900">48</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Satisfaction</span>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-900">4.8</span>
                      <span className="text-[#FC7E00]">★★★★★</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#75A3AB]" />
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={cn(
                        "p-2 rounded-full",
                        activity.status === "new" && "bg-green-100 text-green-600",
                        activity.status === "progress" && "bg-[#FC7E00]/10 text-[#FC7E00]",
                        activity.status === "update" && "bg-blue-100 text-blue-600",
                        activity.status === "complete" && "bg-[#0D6661]/10 text-[#0D6661]"
                      )}>
                        {activity.type === "talent" ? (
                          <Users className="w-4 h-4" />
                        ) : (
                          <Target className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.name}</p>
                      </div>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link 
                    href="/activities" 
                    className="text-[#0D6661] hover:text-[#164643] font-medium text-sm flex items-center gap-1"
                  >
                    View all activities
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Upcoming Tasks */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#164643]" />
                  Upcoming Tasks
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-[#FC7E00]/5 rounded-lg border border-[#FC7E00]/20">
                    <AlertCircle className="w-5 h-5 text-[#FC7E00]" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">3 interviews scheduled today</p>
                      <p className="text-sm text-gray-600">Starting at 10:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#0D6661]/5 rounded-lg border border-[#0D6661]/20">
                    <CheckCircle className="w-5 h-5 text-[#0D6661]" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">5 profiles pending review</p>
                      <p className="text-sm text-gray-600">Due by end of day</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}