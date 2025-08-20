/**
 * Metrics Filters Component
 */

"use client";

import React from 'react';
import { TimePeriod } from '../../domain/value-objects';
import { MetricsFilter } from '../../shared/types/metrics.types';

interface MetricsFiltersProps {
  filters: MetricsFilter;
  onChange: (filters: Partial<MetricsFilter>) => void;
}

export function MetricsFilters({ filters, onChange }: MetricsFiltersProps) {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    }}>
      <h3 style={{
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '1rem',
      }}>
        Filter Metrics
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Time Period Filter */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem',
          }}>
            Time Period
          </label>
          <select
            value={filters.period}
            onChange={(e) => onChange({ period: e.target.value as TimePeriod })}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '0.875rem',
              color: '#374151',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#0b5d5b'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          >
            <option value={TimePeriod.DAILY}>Today</option>
            <option value={TimePeriod.WEEKLY}>Last 7 Days</option>
            <option value={TimePeriod.MONTHLY}>Last 30 Days</option>
            <option value={TimePeriod.QUARTERLY}>Last Quarter</option>
            <option value={TimePeriod.YEARLY}>Last Year</option>
          </select>
        </div>
        
        {/* Custom Date Range */}
        {filters.period === TimePeriod.CUSTOM && (
          <>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem',
              }}>
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => onChange({ startDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.875rem',
                  color: '#374151',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#0b5d5b'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem',
              }}>
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => onChange({ endDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.875rem',
                  color: '#374151',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#0b5d5b'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
          </>
        )}
        
        {/* Quick Actions */}
        <div style={{
          paddingTop: '1rem',
          borderTop: '1px solid #e5e7eb',
        }}>
          <p style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            marginBottom: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Quick Filters
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {[
              { label: 'This Week', period: TimePeriod.WEEKLY },
              { label: 'This Month', period: TimePeriod.MONTHLY },
              { label: 'This Quarter', period: TimePeriod.QUARTERLY },
            ].map((quick) => (
              <button
                key={quick.label}
                onClick={() => onChange({ period: quick.period })}
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  border: '1px solid',
                  borderColor: filters.period === quick.period ? '#0b5d5b' : '#d1d5db',
                  backgroundColor: filters.period === quick.period ? '#0b5d5b' : '#ffffff',
                  color: filters.period === quick.period ? '#ffffff' : '#6b7280',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (filters.period !== quick.period) {
                    e.currentTarget.style.borderColor = '#0b5d5b';
                    e.currentTarget.style.backgroundColor = '#f0fdfa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (filters.period !== quick.period) {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }
                }}
              >
                {quick.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
