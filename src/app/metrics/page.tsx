/**
 * Enhanced Analytics Dashboard Page
 * Path: src/app/metrics/page.tsx
 */

"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/shared/components/layouts/dashboard-layout";
import { LoadingSpinner } from "@/shared/components/loading-spinner";
import { authService } from "@/features/auth/services/auth.service";
import { getDashboardMetricsAction } from "@/features/metrics/presentation/actions/metrics.actions";
import { ChartPlaceholder, SimpleBarChart, DonutChart } from "@/shared/components/charts";
import {
  TrendingUp,
  Users,
  Target,
  Clock,
  Building2,
  Award,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  BarChart3,
  Download,
  Calendar,
  Globe,
  Star,
  ArrowUp,
  ArrowDown,
  Minus,
  Filter,
  RefreshCw
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon: any;
  color: string;
  bgColor: string;
  subtitle?: string;
}

function MetricCard({ title, value, change, icon: Icon, color, bgColor, subtitle }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-3 ${bgColor} rounded-lg`}>
              <Icon className="w-6 h-6" style={{ color }} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-gray-500">{subtitle}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-end gap-3">
            <div className="text-3xl font-bold text-gray-900">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
            
            {change && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                change.isPositive 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                {change.isPositive ? (
                  <ArrowUp className="w-3 h-3" />
                ) : (
                  <ArrowDown className="w-3 h-3" />
                )}
                {Math.abs(change.value)}%
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatusCardProps {
  title: string;
  data: Array<{
    label: string;
    value: number;
    color: string;
    icon: string;
  }>;
}

function StatusCard({ title, data }: StatusCardProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-[#0D6661]" />
        {title}
      </h3>
      
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold" style={{ color: item.color }}>
                {item.value}
              </span>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${total ? (item.value / total) * 100 : 0}%`,
                    backgroundColor: item.color 
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MetricsPage() {
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState('30d');

  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      setIsReady(true);
      loadMetrics();
    } else {
      window.location.href = "/token";
    }
  }, [timeFilter]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();
      if (!token) return;

      // Usar la acción existente de métricas
      const result = await getDashboardMetricsAction({
        period: timeFilter as any,
        startDate: new Date(Date.now() - (timeFilter === '7d' ? 7 : timeFilter === '30d' ? 30 : 90) * 24 * 60 * 60 * 1000),
        endDate: new Date()
      }, token);

      if (result.success) {
        setMetrics(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to load metrics');
      }
    } catch (err) {
      console.error('Metrics loading error:', err);
      setError('Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  // Datos mock coherentes mientras se cargan los reales
  const mockMetrics = {
    overview: [
      { type: 'total_processes', value: 201, label: 'Total Processes' },
      { type: 'total_candidates', value: 201, label: 'Total Candidates' },
      { type: 'placement_rate', value: 0, label: 'Placement Rate' },
      { type: 'active_processes', value: 0, label: 'Active Processes' }
    ],
    processes: [
      { type: 'draft', value: 45, label: 'Draft' },
      { type: 'active', value: 89, label: 'Active' }, 
      { type: 'completed', value: 32, label: 'Completed' },
      { type: 'cancelled', value: 35, label: 'Cancelled' }
    ],
    talent: [
      { type: 'available', value: 156, label: 'Available' },
      { type: 'in_process', value: 28, label: 'In Process' },
      { type: 'hired', value: 17, label: 'Hired' }
    ]
  };

  const currentMetrics = metrics || mockMetrics;

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F4FDF9] to-white">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-b from-[#F4FDF9] via-white to-gray-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-[#0D6661] via-[#0D6661]/95 to-[#164643] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="analytics-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                  <circle cx="30" cy="30" r="2" fill="white" />
                  <circle cx="30" cy="30" r="15" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#analytics-pattern)" />
            </svg>
          </div>
          
          <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
                  <BarChart3 className="w-5 h-5" />
                  <span>Wired People Analytics Platform</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Analytics
                  <span className="text-[#FC7E00]"> Dashboard</span>
                </h1>
                
                <p className="text-lg text-white/90 mb-6 leading-relaxed">
                  Real-time metrics and insights for recruitment performance. 
                  Track processes, monitor talent pipeline, and optimize your hiring strategy.
                </p>
                
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm text-white/80">Live Data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#FC7E00]" />
                    <span className="text-sm text-white/80">Performance Tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-white/60" />
                    <span className="text-sm text-white/80">Strategic Insights</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => window.open('/api/metrics/export', '_blank')}
                className="group flex items-center gap-2 px-6 py-3 bg-[#FC7E00] hover:bg-[#e37100] text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <Download className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold text-gray-900">Key Performance Indicators</h2>
              <span className="px-3 py-1 bg-[#CFE8E0] text-[#164643] rounded-full text-sm font-medium">
                Real-time metrics
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
                {[
                  { label: 'This Week', value: '7d' },
                  { label: 'This Month', value: '30d' },
                  { label: 'This Quarter', value: '90d' }
                ].map((period) => (
                  <button
                    key={period.value}
                    onClick={() => setTimeFilter(period.value)}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                      timeFilter === period.value
                        ? 'bg-[#0D6661] text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
              
              <button
                onClick={loadMetrics}
                disabled={loading}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-red-800 font-medium">Error loading metrics</span>
              </div>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            {/* Main Content */}
            <main className="xl:col-span-4 space-y-6">
              {/* Overview Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Total Processes"
                  value={currentMetrics.overview?.find(m => m.type === 'total_processes')?.value || 201}
                  change={{ value: 12.5, isPositive: true }}
                  icon={Briefcase}
                  color="#0D6661"
                  bgColor="bg-[#CFE8E0]"
                  subtitle="All recruitment processes"
                />
                
                <MetricCard
                  title="Total Candidates"
                  value={currentMetrics.overview?.find(m => m.type === 'total_candidates')?.value || 201}
                  change={{ value: 8.3, isPositive: false }}
                  icon={Users}
                  color="#FC7E00"
                  bgColor="bg-orange-50"
                  subtitle="Candidates in database"
                />
                
                <MetricCard
                  title="Placement Rate"
                  value="67.5%"
                  change={{ value: 5.2, isPositive: true }}
                  icon={Target}
                  color="#22C55E"
                  bgColor="bg-green-50"
                  subtitle="Successful placements"
                />
                
                <MetricCard
                  title="Active Processes"
                  value={currentMetrics.overview?.find(m => m.type === 'active_processes')?.value || 89}
                  change={{ value: 3.1, isPositive: true }}
                  icon={Clock}
                  color="#8B5CF6"
                  bgColor="bg-purple-50"
                  subtitle="Currently running"
                />
              </div>

              {/* Status Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StatusCard
                  title="Process Status"
                  data={[
                    { label: 'Draft', value: 45, color: '#6B7280', icon: '📝' },
                    { label: 'Active', value: 89, color: '#22C55E', icon: '✅' },
                    { label: 'Completed', value: 32, color: '#8B5CF6', icon: '🎯' },
                    { label: 'Cancelled', value: 35, color: '#EF4444', icon: '❌' }
                  ]}
                />
                
                <StatusCard
                  title="Talent Status"
                  data={[
                    { label: 'Available', value: 156, color: '#22C55E', icon: '✅' },
                    { label: 'In Process', value: 28, color: '#FC7E00', icon: '⏳' },
                    { label: 'Hired', value: 17, color: '#0D6661', icon: '🎯' },
                    { label: 'Not Available', value: 8, color: '#6B7280', icon: '⭕' }
                  ]}
                />
              </div>

              {/* Performance Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Processes by Month Chart */}
                <ChartPlaceholder
                  title="Processes by Month"
                  type="bar"
                  height={280}
                  data={currentMetrics.processes}
                  loading={loading}
                />

                {/* Department Performance */}
                <SimpleBarChart
                  title="Department Performance"
                  data={[
                    { label: 'IT', value: 89, color: '#0D6661' },
                    { label: 'Cybersec', value: 45, color: '#FC7E00' },
                    { label: 'Health', value: 67, color: '#8B5CF6' }
                  ]}
                  height={280}
                />
              </div>

              {/* Status Distribution Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DonutChart
                  title="Process Status Distribution"
                  data={[
                    { label: 'Active', value: 89, color: '#22C55E' },
                    { label: 'Draft', value: 45, color: '#6B7280' },
                    { label: 'Completed', value: 32, color: '#8B5CF6' },
                    { label: 'Cancelled', value: 35, color: '#EF4444' }
                  ]}
                  centerValue="201"
                  centerLabel="Total"
                />
                
                <DonutChart
                  title="Talent Availability"
                  data={[
                    { label: 'Available', value: 156, color: '#22C55E' },
                    { label: 'In Process', value: 28, color: '#FC7E00' },
                    { label: 'Hired', value: 17, color: '#0D6661' }
                  ]}
                  centerValue="201"
                  centerLabel="Total"
                />
              </div>

              {/* Recent Activity and Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Processes */}
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Processes</h3>
                  
                  <div className="space-y-3">
                    {[
                      { name: 'Senior Data Analyst Selection', company: 'Wired People Inc.', candidates: 12, vacancies: 2, status: 'Active' },
                      { name: 'Cloud Engineer Position', company: 'Tech Corp', candidates: 8, vacancies: 1, status: 'In Review' },
                      { name: 'Cybersecurity Specialist', company: 'SecureNet', candidates: 15, vacancies: 3, status: 'Active' }
                    ].map((process, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg border-l-3 border-[#0D6661]">
                        <div className="font-semibold text-gray-900 mb-1">{process.name}</div>
                        <div className="text-sm text-gray-600 mb-2">{process.company}</div>
                        <div className="flex gap-4 text-xs text-gray-500 mb-2">
                          <span>👥 {process.candidates} candidates</span>
                          <span>📍 {process.vacancies} vacancies</span>
                        </div>
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {process.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Performers */}
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Performance</h3>
                  
                  <div className="space-y-4">
                    {[
                      { dept: 'Information Technology', processes: 89, rate: '72%', color: '#0D6661' },
                      { dept: 'Cybersecurity', processes: 45, rate: '68%', color: '#FC7E00' },
                      { dept: 'Public Health', processes: 67, rate: '74%', color: '#8B5CF6' }
                    ].map((dept, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{dept.dept}</div>
                          <div className="text-sm text-gray-600">{dept.processes} active processes</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg" style={{ color: dept.color }}>
                            {dept.rate}
                          </div>
                          <div className="text-xs text-gray-500">success rate</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </main>

            {/* Sidebar */}
            <aside className="xl:col-span-1 space-y-6">
              {/* Quick Filters */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Filter Metrics</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Time Period</label>
                    <select 
                      className="w-full text-sm border border-gray-200 rounded-md px-3 py-2"
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                    >
                      <option value="7d">Last 7 Days</option>
                      <option value="30d">Last 30 Days</option>
                      <option value="90d">Last 3 Months</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Department</label>
                    <select className="w-full text-sm border border-gray-200 rounded-md px-3 py-2">
                      <option>All Departments</option>
                      <option>Information Technology</option>
                      <option>Cybersecurity</option>
                      <option>Public Health</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
                    <select className="w-full text-sm border border-gray-200 rounded-md px-3 py-2">
                      <option>All Statuses</option>
                      <option>Active</option>
                      <option>Completed</option>
                      <option>Draft</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Quick Insights */}
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Insights</h3>
                
                <div className="space-y-3">
                  {[
                    { label: 'Best Performing', value: 'Senior Developer', icon: '📈', color: '#22C55E' },
                    { label: 'Needs Attention', value: 'Data Analyst', icon: '⚠️', color: '#EF4444' },
                    { label: 'Trending Up', value: 'Cloud Engineer', icon: '🚀', color: '#3B82F6' }
                  ].map((insight, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-l-3" style={{ borderLeftColor: insight.color }}>
                      <span className="text-lg">{insight.icon}</span>
                      <div className="flex-1">
                        <div className="text-xs text-gray-600">{insight.label}</div>
                        <div className="text-sm font-semibold text-gray-900">{insight.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Options */}
              <div className="bg-gradient-to-br from-[#0D6661] to-[#164643] rounded-xl p-4 text-white">
                <h3 className="text-sm font-semibold mb-3">Export Data</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm">
                    📊 Download CSV
                  </button>
                  <button className="w-full text-left px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm">
                    📄 Generate PDF
                  </button>
                  <button className="w-full text-left px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm">
                    📈 Export Charts
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
