/**
 * Professional Sidebar Navigation Component
 * Path: src/shared/components/navigation/sidebar.tsx
 */

"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { WiredPeopleLogo } from "@/shared/components/ui/logos";
import { 
  Users, 
  Target, 
  BarChart3, 
  Settings, 
  User,
  Home,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  LogOut,
  Menu,
  X,
  Briefcase,
  UserCheck,
  TrendingUp,
  Shield,
  Heart,
  Zap
} from "lucide-react";

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: any;
  badge?: number;
  description?: string;
}

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const navigationItems: NavigationItem[] = [
    {
      id: "dashboard",
      label: "Dashboard", 
      href: "/",
      icon: Home,
      description: "Overview and analytics"
    },
    {
      id: "processes",
      label: "Processes",
      href: "/processes", 
      icon: Target,
      description: "Recruitment processes"
    },
    {
      id: "talent",
      label: "Talent Pool",
      href: "/talent",
      icon: Users,
      description: "Available professionals"
    },
    {
      id: "metrics",
      label: "Metrics",
      href: "/metrics",
      icon: BarChart3,
      description: "Performance analytics"
    },
    {
      id: "users",
      label: "Users",
      href: "/users",
      icon: UserCheck,
      description: "User management"
    }
  ];

  const departmentItems = [
    {
      id: "it",
      label: "Information Technology",
      href: "/departments/it",
      icon: Zap,
      color: "#0D6661"
    },
    {
      id: "cybersecurity", 
      label: "Cybersecurity",
      href: "/departments/cybersecurity",
      icon: Shield,
      color: "#FC7E00"
    },
    {
      id: "health",
      label: "Public Health",
      href: "/departments/health", 
      icon: Heart,
      color: "#75A3AB"
    }
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={cn(
        "flex items-center gap-3 p-6 border-b border-gray-200",
        isCollapsed && "justify-center p-4"
      )}>
        <WiredPeopleLogo 
          variant={isCollapsed ? "icon-only" : "default"} 
          size={isCollapsed ? "md" : "lg"}
        />
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="ml-auto p-1.5 hover:bg-gray-100 rounded-lg transition-colors lg:flex hidden"
          >
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-2 px-4">
          {/* Main Navigation */}
          <div className="space-y-1">
            {!isCollapsed && (
              <h3 className="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Main Navigation
              </h3>
            )}
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                    active 
                      ? "bg-[#0D6661] text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100 hover:text-[#0D6661]",
                    isCollapsed && "justify-center px-2"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={cn(
                    "w-5 h-5 transition-colors",
                    active ? "text-white" : "text-gray-500 group-hover:text-[#0D6661]"
                  )} />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs bg-[#FC7E00] text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Departments */}
          <div className="pt-6 space-y-1">
            {!isCollapsed && (
              <h3 className="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Departments
              </h3>
            )}
            {departmentItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                    active 
                      ? "text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100",
                    isCollapsed && "justify-center px-2"
                  )}
                  style={{
                    backgroundColor: active ? item.color : undefined
                  }}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon 
                    className="w-5 h-5 transition-colors" 
                    style={{ 
                      color: active ? "white" : item.color 
                    }}
                  />
                  {!isCollapsed && (
                    <span className="flex-1">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* User Section */}
      <div className={cn(
        "border-t border-gray-200 p-4",
        isCollapsed && "px-2"
      )}>
        {!isCollapsed ? (
          <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0D6661] to-[#164643] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@wiredpeople.com</p>
            </div>
            <LogOut className="w-4 h-4 text-gray-400" />
          </div>
        ) : (
          <button className="w-full p-2 hover:bg-gray-50 rounded-lg transition-colors" title="User Menu">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0D6661] to-[#164643] rounded-full flex items-center justify-center mx-auto">
              <User className="w-4 h-4 text-white" />
            </div>
          </button>
        )}
      </div>

      {/* Collapse Toggle */}
      {isCollapsed && (
        <div className="border-t border-gray-200 p-4 hidden lg:block">
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-full p-2 hover:bg-gray-50 rounded-lg transition-colors"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-4 h-4 text-gray-500 mx-auto" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-lg lg:hidden"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 z-30 fixed left-0 top-0 h-full",
        isCollapsed ? "w-16" : "w-64",
        className
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:hidden",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <WiredPeopleLogo size="lg" />
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="h-[calc(100%-5rem)]">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
}
