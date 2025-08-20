/**
 * Metrics Export Button Component
 */

"use client";

import React, { useState } from 'react';

interface MetricsExportButtonProps {
  onExport: (format: 'csv' | 'pdf') => Promise<void>;
  disabled?: boolean;
}

export function MetricsExportButton({ onExport, disabled }: MetricsExportButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format: 'csv' | 'pdf') => {
    setExporting(true);
    setShowMenu(false);
    try {
      await onExport(format);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={disabled || exporting}
        style={{
          backgroundColor: '#fc7e00',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          fontSize: '0.875rem',
          fontWeight: '500',
          border: 'none',
          cursor: disabled || exporting ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'background-color 0.2s',
          opacity: disabled || exporting ? 0.5 : 1,
        }}
        onMouseEnter={(e) => {
          if (!disabled && !exporting) {
            e.currentTarget.style.backgroundColor = '#e37100';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#fc7e00';
        }}
      >
        {exporting ? (
          <>
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid transparent',
              borderTopColor: 'white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            Exporting...
          </>
        ) : (
          <>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Report
          </>
        )}
      </button>

      {showMenu && !exporting && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '0.5rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          zIndex: 50,
          minWidth: '150px',
          overflow: 'hidden',
        }}>
          <button
            onClick={() => handleExport('csv')}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              textAlign: 'left',
              fontSize: '0.875rem',
              color: '#374151',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 17v1a1 1 0 001 1h4a1 1 0 001-1v-1m-5-4v4m0 0V9m0 8h.01M12 9V5a1 1 0 00-1-1H8.5L7 5.5V11h5z" />
            </svg>
            Export as CSV
          </button>
          
          <button
            onClick={() => handleExport('pdf')}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              textAlign: 'left',
              fontSize: '0.875rem',
              color: '#374151',
              backgroundColor: 'transparent',
              border: 'none',
              borderTop: '1px solid #e5e7eb',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Export as PDF
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
