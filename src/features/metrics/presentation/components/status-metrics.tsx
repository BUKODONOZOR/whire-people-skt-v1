/**
 * Status Metrics Component
 * Shows metrics grouped by status (processes and talent)
 */

"use client";

import React from 'react';
import { MetricData } from '../../domain/repositories/metrics.repository.interface';

interface StatusMetricsProps {
  title: string;
  metrics: MetricData[];
  loading?: boolean;
  type: 'processes' | 'talent';
}

// Status color mapping for visual consistency
const getStatusColor = (status: string, type: string): string => {
  const processColors: Record<string, string> = {
    'waiting': '#fbbf24',      // Yellow - En espera
    'en_espera': '#fbbf24',
    'active': '#10b981',        // Green - Abierto
    'abierto': '#10b981',
    'in_progress': '#3b82f6',   // Blue - En proceso
    'en_proceso': '#3b82f6',
    'suspended': '#ef4444',     // Red - Suspendido
    'suspendido': '#ef4444',
    'completed': '#8b5cf6',     // Purple - Cerrado
    'cerrado': '#8b5cf6',
  };

  const talentColors: Record<string, string> = {
    'available': '#10b981',     // Green - Disponible
    'disponible': '#10b981',
    'in_process': '#fbbf24',    // Yellow - En proceso
    'en_proceso': '#fbbf24',
    'inactive': '#6b7280',      // Gray - Inactivo
    'inactivo': '#6b7280',
    'placed': '#8b5cf6',        // Purple - Contratado
    'contratado': '#8b5cf6',
    'unavailable': '#ef4444',   // Red - No disponible
    'no_disponible': '#ef4444',
  };

  const colors = type === 'processes' ? processColors : talentColors;
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '_');
  
  return colors[normalizedStatus] || '#6b7280';
};

// Get background color with opacity
const getStatusBackground = (status: string, type: string): string => {
  const color = getStatusColor(status, type);
  // Convert hex to rgba with opacity
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, 0.1)`;
};

// Get icon for status
const getStatusIcon = (status: string, type: string): React.ReactNode => {
  const processIcons: Record<string, React.ReactNode> = {
    'waiting': '⏳',
    'en_espera': '⏳',
    'active': '✅',
    'abierto': '✅',
    'in_progress': '🔄',
    'en_proceso': '🔄',
    'suspended': '⚠️',
    'suspendido': '⚠️',
    'completed': '🎯',
    'cerrado': '🎯',
  };

  const talentIcons: Record<string, React.ReactNode> = {
    'available': '✅',
    'disponible': '✅',
    'in_process': '🔄',
    'en_proceso': '🔄',
    'inactive': '💤',
    'inactivo': '💤',
    'placed': '🎯',
    'contratado': '🎯',
    'unavailable': '❌',
    'no_disponible': '❌',
  };

  const icons = type === 'processes' ? processIcons : talentIcons;
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '_');
  
  return icons[normalizedStatus] || '📊';
};

export function StatusMetrics({ title, metrics, loading, type }: StatusMetricsProps) {
  if (loading) {
    return (
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }}>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#191e23',
          marginBottom: '1.5rem',
        }}>
          {title}
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '0.75rem',
        }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                padding: '1rem',
                height: '80px',
              }}
              className="animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // Sort metrics by value (descending)
  const sortedMetrics = [...metrics].sort((a, b) => b.value - a.value);

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    }}>
      <h3 style={{
        fontSize: '1.125rem',
        fontWeight: '600',
        color: '#191e23',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        {type === 'processes' ? (
          <svg width="20" height="20" fill="none" stroke="#0b5d5b" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        ) : (
          <svg width="20" height="20" fill="none" stroke="#fc7e00" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )}
        {title}
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '0.75rem',
      }}>
        {sortedMetrics.map((metric) => {
          const statusType = metric.type || metric.label.toLowerCase();
          const color = getStatusColor(statusType, type);
          const background = getStatusBackground(statusType, type);
          const icon = getStatusIcon(statusType, type);

          return (
            <div
              key={metric.id}
              style={{
                backgroundColor: background,
                borderRadius: '8px',
                padding: '1rem',
                borderLeft: `3px solid ${color}`,
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '0.5rem',
              }}>
                <span style={{ fontSize: '1.5rem' }}>{icon}</span>
                <span style={{
                  fontSize: '1.75rem',
                  fontWeight: 'bold',
                  color: '#191e23',
                }}>
                  {Math.round(metric.value).toLocaleString()}
                </span>
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: '500',
              }}>
                {type === 'processes' ? 'Processes' : 'Candidates'}
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#374151',
                fontWeight: '600',
                marginTop: '0.25rem',
              }}>
                {metric.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Total summary */}
      <div style={{
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          fontWeight: '500',
        }}>
          Total
        </span>
        <span style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: type === 'processes' ? '#0b5d5b' : '#fc7e00',
        }}>
          {metrics.reduce((sum, m) => sum + m.value, 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
