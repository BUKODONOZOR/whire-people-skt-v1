/**
 * Use Metrics Hook
 */

"use client";

import { useState, useEffect } from 'react';
import { authService } from '@/features/auth/services/auth.service';
import { getDashboardMetricsAction, exportMetricsAction } from '../actions/metrics.actions';
import { DashboardMetrics, MetricsFilters } from '../../domain/repositories/metrics.repository.interface';
import { TimePeriod } from '../../domain/value-objects';
import { metricsApiClient } from '../../infrastructure/api/metrics-api-client';

export function useMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [recentProcesses, setRecentProcesses] = useState<any[]>([]);
  const [activeCompanies, setActiveCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MetricsFilters>({
    period: TimePeriod.MONTHLY,
  });

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = authService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch main dashboard metrics
      const result = await getDashboardMetricsAction(filters, token);
      
      if (result.success && result.data) {
        setMetrics(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch metrics');
      }

      // Fetch additional data in parallel
      try {
        const [monthly, recent, companies] = await Promise.all([
          // Get full year monthly data
          metricsApiClient.get('/v1/panel/processes/monthly', {
            Year: new Date().getFullYear(),
            Month: new Date().getMonth() + 1
          }, token).catch(() => null),
          // Get recent processes
          metricsApiClient.get('/v1/panel/processes/recent', {
            PageSize: 5
          }, token).catch(() => null),
          // Get most active companies
          metricsApiClient.get('/v1/panel/companies/most-active', {
            PageSize: 5
          }, token).catch(() => null)
        ]);

        // Extract data from responses
        const extractData = (response: any) => {
          if (response?.success && response?.data?.data) {
            return response.data.data;
          }
          if (response?.data) {
            return response.data;
          }
          return response || [];
        };

        setMonthlyData(extractData(monthly));
        
        const recentData = extractData(recent);
        setRecentProcesses(recentData?.items || recentData || []);
        
        const companiesData = extractData(companies);
        setActiveCompanies(companiesData?.items || companiesData || []);
      } catch (additionalError) {
        console.warn('[useMetrics] Error fetching additional data:', additionalError);
        // Don't fail the whole request if additional data fails
      }
    } catch (err) {
      console.error('[useMetrics] Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const exportMetrics = async (format: 'csv' | 'pdf'): Promise<void> => {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const result = await exportMetricsAction(filters, format, token);
      
      if (result.success && result.data) {
        // Convert base64 back to blob and download
        const byteCharacters = atob(result.data.content);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: result.data.mimeType });
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.data.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error(result.error || 'Failed to export metrics');
      }
    } catch (err) {
      console.error('[useMetrics] Export error:', err);
      throw err;
    }
  };

  const updateFilters = (newFilters: Partial<MetricsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  useEffect(() => {
    fetchMetrics();
  }, [filters]);

  return {
    metrics,
    monthlyData,
    recentProcesses,
    activeCompanies,
    loading,
    error,
    filters,
    updateFilters,
    refreshMetrics: fetchMetrics,
    exportMetrics,
  };
}
