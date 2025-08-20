/**
 * Dashboard Overview Component
 */

"use client";

import React from 'react';
import { MetricCard } from './metric-card';
import { MetricData } from '../../domain/repositories/metrics.repository.interface';

interface DashboardOverviewProps {
  metrics: MetricData[];
  loading?: boolean;
}

// Helper functions to format metric values
function formatMetricValue(metric: MetricData): string {
  // Handle different metric types based on the real backend data
  if (metric.type === 'placement_rate' || metric.type === 'conversion_rate' || 
      metric.type.includes('rate') || metric.type.includes('percentage')) {
    return `${metric.value.toFixed(1)}%`;
  }
  
  if (metric.type === 'time_to_hire' || metric.type.includes('time') || metric.type.includes('days')) {
    return `${Math.round(metric.value)} days`;
  }
  
  if (metric.type === 'satisfaction' || metric.type === 'quality_score') {
    return metric.value.toFixed(1);
  }
  
  if (metric.type.includes('currency') || metric.type.includes('salary')) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(metric.value);
  }
  
  // For counts and totals, show as integer
  return Math.round(metric.value).toLocaleString();
}

function isPositiveTrend(metric: MetricData): boolean {
  if (!metric.comparison) return true;
  
  // For some metrics, down is good (e.g., time to hire)
  const downIsGood = ['time_to_hire', 'dropout_rate', 'rejection_rate'].includes(metric.type);
  
  if (downIsGood) {
    return metric.comparison.trend === 'down' || metric.comparison.trend === 'stable';
  }
  
  return metric.comparison.trend === 'up' || metric.comparison.trend === 'stable';
}

export function DashboardOverview({ metrics, loading }: DashboardOverviewProps) {
  if (loading) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
      }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '1.5rem',
              height: '140px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            }}
          >
            <div className="animate-pulse">
              <div style={{
                height: '1rem',
                backgroundColor: '#f3f4f6',
                borderRadius: '4px',
                marginBottom: '1rem',
                width: '60%',
              }} />
              <div style={{
                height: '2rem',
                backgroundColor: '#f3f4f6',
                borderRadius: '4px',
                width: '40%',
              }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const getIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      total_processes: (
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      total_candidates: (
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      placement_rate: (
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      average_time_to_hire: (
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    };
    
    return icons[type] || null;
  };

  const getColor = (type: string) => {
    const colors: Record<string, string> = {
      total_processes: '#0b5d5b',
      total_candidates: '#fc7e00',
      placement_rate: '#22c55e',
      average_time_to_hire: '#8b5cf6',
    };
    
    return colors[type] || '#0b5d5b';
  };

  return (
    <div>
      <div style={{
        marginBottom: '2rem',
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#191e23',
          marginBottom: '0.5rem',
        }}>
          Key Performance Indicators
        </h2>
        <p style={{
          fontSize: '0.875rem',
          color: '#6b7280',
        }}>
          Real-time metrics for Wired People Inc.
        </p>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
      }}>
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            title={metric.label}
            value={formatMetricValue(metric)}
            description={metric.description}
            trend={metric.comparison ? {
              value: metric.comparison.percentage,
              isPositive: isPositiveTrend(metric),
            } : undefined}
            icon={getIcon(metric.type)}
            color={getColor(metric.type)}
          />
        ))}
      </div>
    </div>
  );
}
