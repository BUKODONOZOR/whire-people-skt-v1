/**
 * Monthly Processes Chart Component
 */

"use client";

import React, { useState } from 'react';

interface MonthlyData {
  month: number;
  monthName: string;
  total: number;
  byStatus?: {
    [key: string]: number;
  };
}

interface MonthlyProcessesChartProps {
  data: MonthlyData[];
  loading?: boolean;
}

export function MonthlyProcessesChart({ data, loading }: MonthlyProcessesChartProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  if (loading) {
    return (
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '1.5rem',
        height: '400px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }}>
        <div className="animate-pulse">
          <div style={{
            height: '1.5rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '4px',
            marginBottom: '1rem',
            width: '40%',
          }} />
          <div style={{
            height: '300px',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
          }} />
        </div>
      </div>
    );
  }

  // Prepare chart data
  const maxValue = Math.max(...data.map(d => d.total), 10);
  const chartHeight = 250;
  const barWidth = 100 / data.length * 0.7;

  // Status filter options
  const statusOptions = [
    { value: 'all', label: 'All Statuses', color: '#0b5d5b' },
    { value: 'En espera', label: 'Waiting', color: '#fbbf24' },
    { value: 'Abierto', label: 'Open', color: '#10b981' },
    { value: 'En proceso', label: 'In Progress', color: '#3b82f6' },
    { value: 'Suspendido', label: 'Suspended', color: '#ef4444' },
    { value: 'Cerrado', label: 'Closed', color: '#8b5cf6' },
  ];

  const getValueForMonth = (monthData: MonthlyData): number => {
    if (selectedStatus === 'all') {
      return monthData.total;
    }
    return monthData.byStatus?.[selectedStatus] || 0;
  };

  const currentMaxValue = selectedStatus === 'all' 
    ? maxValue 
    : Math.max(...data.map(d => getValueForMonth(d)), 5);

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
      }}>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#191e23',
        }}>
          Processes by Month
          <span style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            fontWeight: '400',
            marginLeft: '0.5rem',
          }}>
            View processes by status
          </span>
        </h3>

        {/* Status filter dropdown */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            fontSize: '0.875rem',
            color: '#374151',
            backgroundColor: '#ffffff',
            cursor: 'pointer',
            outline: 'none',
            minWidth: '150px',
          }}
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div style={{
        position: 'relative',
        height: chartHeight,
        marginBottom: '1rem',
      }}>
        {/* Y-axis grid lines */}
        {[0, 25, 50, 75, 100].map((percent) => (
          <div
            key={percent}
            style={{
              position: 'absolute',
              bottom: `${percent}%`,
              left: 0,
              right: 0,
              borderTop: '1px dashed #e5e7eb',
              opacity: 0.5,
            }}
          >
            <span style={{
              position: 'absolute',
              left: '-30px',
              top: '-8px',
              fontSize: '0.75rem',
              color: '#9ca3af',
            }}>
              {Math.round(currentMaxValue * (percent / 100))}
            </span>
          </div>
        ))}

        {/* Bars */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'flex-end',
          height: '100%',
          padding: '0 1rem',
        }}>
          {data.map((monthData, index) => {
            const value = getValueForMonth(monthData);
            const height = currentMaxValue > 0 ? (value / currentMaxValue) * 100 : 0;
            const color = statusOptions.find(s => s.value === selectedStatus)?.color || '#0b5d5b';

            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: `${barWidth}%`,
                  gap: '0.5rem',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: `${height}%`,
                    backgroundColor: color,
                    borderRadius: '4px 4px 0 0',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative',
                    opacity: 0.9,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'scaleY(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.transform = 'scaleY(1)';
                  }}
                  title={`${monthData.monthName}: ${value} processes`}
                >
                  {value > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-20px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '0.875rem',
                      fontWeight: 'bold',
                      color: color,
                      whiteSpace: 'nowrap',
                    }}>
                      {value}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: '0.5rem',
          padding: '0 1rem',
        }}>
          {data.map((monthData, index) => (
            <div
              key={index}
              style={{
                width: `${barWidth}%`,
                textAlign: 'center',
                fontSize: '0.75rem',
                color: '#6b7280',
              }}
            >
              {monthData.monthName.substring(0, 3)}
            </div>
          ))}
        </div>
      </div>

      {/* Legend for status breakdown */}
      {selectedStatus === 'all' && data[0]?.byStatus && (
        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid #e5e7eb',
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Status Breakdown (Current Month)
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            {Object.entries(data[data.length - 1]?.byStatus || {}).map(([status, count]) => {
              const statusOption = statusOptions.find(s => s.value === status);
              if (!statusOption || count === 0) return null;
              
              return (
                <div
                  key={status}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '2px',
                      backgroundColor: statusOption.color,
                    }}
                  />
                  <span style={{
                    fontSize: '0.875rem',
                    color: '#374151',
                  }}>
                    {statusOption.label}: {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
