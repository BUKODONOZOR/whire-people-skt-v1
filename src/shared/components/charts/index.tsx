/**
 * Modern Chart Components for Analytics
 * Path: src/shared/components/charts/index.tsx
 */

"use client";

import { TrendingUp, BarChart3, PieChart, Activity } from "lucide-react";

interface ChartPlaceholderProps {
  title: string;
  type: "line" | "bar" | "pie" | "area";
  height?: number;
  data?: any[];
  loading?: boolean;
}

export function ChartPlaceholder({ title, type, height = 300, data, loading }: ChartPlaceholderProps) {
  const getIcon = () => {
    switch (type) {
      case "line": return <TrendingUp className="w-12 h-12 text-gray-400" />;
      case "bar": return <BarChart3 className="w-12 h-12 text-gray-400" />;
      case "pie": return <PieChart className="w-12 h-12 text-gray-400" />;
      case "area": return <Activity className="w-12 h-12 text-gray-400" />;
      default: return <BarChart3 className="w-12 h-12 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-2">
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="h-2 bg-gray-200 rounded w-5/6"></div>
            <div className="h-2 bg-gray-200 rounded w-4/6"></div>
          </div>
          <div className={`bg-gray-100 rounded-lg mt-4`} style={{ height: `${height}px` }}>
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D6661]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div 
        className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300" 
        style={{ height: `${height}px` }}
      >
        <div className="text-center">
          {getIcon()}
          <p className="text-gray-500 mt-2 font-medium">{type.charAt(0).toUpperCase() + type.slice(1)} Chart</p>
          <p className="text-xs text-gray-400 mt-1">Data visualization coming soon</p>
          {data && data.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">{data.length} data points available</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface SimpleBarChartProps {
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  title: string;
  height?: number;
}

export function SimpleBarChart({ data, title, height = 200 }: SimpleBarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-20 text-sm text-gray-600 text-right">{item.label}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500 relative"
                style={{ 
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color || '#0D6661'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </div>
            </div>
            <div className="w-12 text-sm font-semibold text-gray-900 text-right">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface DonutChartProps {
  data: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  title: string;
  centerValue?: string;
  centerLabel?: string;
}

export function DonutChart({ data, title, centerValue, centerLabel }: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  const createPath = (percentage: number, startPercentage: number) => {
    const startAngle = startPercentage * 3.6;
    const endAngle = (startPercentage + percentage) * 3.6;
    
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);
    
    const largeArcFlag = percentage > 50 ? 1 : 0;
    
    const x1 = 50 + 40 * Math.cos(startAngleRad);
    const y1 = 50 + 40 * Math.sin(startAngleRad);
    const x2 = 50 + 40 * Math.cos(endAngleRad);
    const y2 = 50 + 40 * Math.sin(endAngleRad);
    
    return `M 50,50 L ${x1},${y1} A 40,40 0 ${largeArcFlag},1 ${x2},${y2} z`;
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="flex items-center gap-6">
        <div className="relative">
          <svg viewBox="0 0 100 100" className="w-32 h-32 transform -rotate-90">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const path = createPath(percentage, cumulativePercentage);
              cumulativePercentage += percentage;
              
              return (
                <path
                  key={index}
                  d={path}
                  fill={item.color}
                  className="transition-all duration-300 hover:opacity-80"
                />
              );
            })}
          </svg>
          
          {centerValue && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">{centerValue}</div>
                {centerLabel && <div className="text-xs text-gray-500">{centerLabel}</div>}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-700">{item.label}</span>
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {item.value} ({Math.round((item.value / total) * 100)}%)
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
