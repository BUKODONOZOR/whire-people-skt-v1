/**
 * Metrics Chart Component
 */

"use client";

import React from 'react';
import { ChartData } from '../../shared/types/metrics.types';

interface MetricsChartProps {
  data: ChartData;
  title: string;
  height?: number;
  loading?: boolean;
}

export function MetricsChart({ data, title, height = 300, loading }: MetricsChartProps) {
  if (loading) {
    return (
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '1.5rem',
        height: height + 80,
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
            height: height,
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
          }} />
        </div>
      </div>
    );
  }

  // Simple chart implementation without external dependencies
  // In production, you might want to use Chart.js or Recharts
  
  const maxValue = Math.max(...data.datasets.flatMap(d => d.data));
  const scaleY = height / maxValue;
  const barWidth = (100 / data.labels.length) * 0.8;
  
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
        position: 'relative',
        height,
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
              borderTop: '1px solid #e5e7eb',
              opacity: 0.5,
            }}
          />
        ))}
        
        {/* Chart bars */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'flex-end',
          height: '100%',
          padding: '0 1rem',
        }}>
          {data.labels.map((label, labelIndex) => (
            <div
              key={label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                gap: '0.5rem',
              }}
            >
              <div style={{
                display: 'flex',
                gap: '0.25rem',
                alignItems: 'flex-end',
                height: '100%',
                width: '100%',
                justifyContent: 'center',
              }}>
                {data.datasets.map((dataset, datasetIndex) => (
                  <div
                    key={datasetIndex}
                    style={{
                      width: `${barWidth / data.datasets.length}%`,
                      height: `${(dataset.data[labelIndex] / maxValue) * 100}%`,
                      backgroundColor: dataset.backgroundColor,
                      borderRadius: '4px 4px 0 0',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                    title={`${dataset.label}: ${dataset.data[labelIndex]}`}
                  >
                    <span style={{
                      position: 'absolute',
                      top: '-20px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: dataset.borderColor,
                      whiteSpace: 'nowrap',
                    }}>
                      {dataset.data[labelIndex]}
                    </span>
                  </div>
                ))}
              </div>
              <span style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                marginTop: '0.5rem',
              }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1.5rem',
        marginTop: '1.5rem',
        paddingTop: '1rem',
        borderTop: '1px solid #e5e7eb',
      }}>
        {data.datasets.map((dataset) => (
          <div
            key={dataset.label}
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
                backgroundColor: dataset.backgroundColor,
                border: `2px solid ${dataset.borderColor}`,
              }}
            />
            <span style={{
              fontSize: '0.875rem',
              color: '#6b7280',
            }}>
              {dataset.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
