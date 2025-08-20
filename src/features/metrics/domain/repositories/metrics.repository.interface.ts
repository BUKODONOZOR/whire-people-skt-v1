/**
 * Metrics Repository Interface
 */

import { MetricType, TimePeriod } from '../value-objects';

// Plain object representation of Metric for serialization
export interface MetricData {
  id: string;
  type: string;
  value: number;
  label: string;
  description?: string;
  metadata?: Record<string, any>;
  timestamp?: Date;
  comparison?: {
    value: number;
    percentage: number;
    trend: 'up' | 'down' | 'stable';
  };
}

export interface DashboardMetrics {
  overview: MetricData[];
  processes: MetricData[];
  talent: MetricData[];
  performance: MetricData[];
  trends: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
}

export interface MetricsFilters {
  period?: TimePeriod;
  startDate?: Date;
  endDate?: Date;
  metricTypes?: MetricType[];
  companyId?: string;
}

export interface IMetricsRepository {
  getDashboardMetrics(filters: MetricsFilters, token: string): Promise<DashboardMetrics>;
  getProcessMetrics(filters: MetricsFilters, token: string): Promise<MetricData[]>;
  getTalentMetrics(filters: MetricsFilters, token: string): Promise<MetricData[]>;
  getPerformanceMetrics(filters: MetricsFilters, token: string): Promise<MetricData[]>;
  exportMetrics(filters: MetricsFilters, format: 'csv' | 'pdf', token: string): Promise<Blob>;
}
