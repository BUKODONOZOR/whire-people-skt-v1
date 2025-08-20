/**
 * Metric Card Component
 */

"use client";

import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  color?: string;
  onClick?: () => void;
}

export function MetricCard({
  title,
  value,
  description,
  trend,
  icon,
  color = '#0b5d5b',
  onClick,
}: MetricCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        transition: 'all 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        borderLeft: `4px solid ${color}`,
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
        }
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            {icon && (
              <div style={{ color, opacity: 0.8 }}>
                {icon}
              </div>
            )}
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {title}
            </h3>
          </div>
          
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#191e23',
            marginBottom: '0.25rem',
            lineHeight: '1.2',
          }}>
            {value}
          </div>
          
          {description && (
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
            }}>
              {description}
            </p>
          )}
        </div>
        
        {trend && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.25rem 0.5rem',
            borderRadius: '6px',
            backgroundColor: trend.isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: trend.isPositive ? '#16a34a' : '#dc2626',
            fontSize: '0.875rem',
            fontWeight: '600',
          }}>
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              style={{
                transform: trend.isPositive ? 'rotate(0deg)' : 'rotate(180deg)',
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 15l7-7 7 7"
              />
            </svg>
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
    </div>
  );
}
