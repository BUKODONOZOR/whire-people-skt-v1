/**
 * Metrics Types
 */

import { MetricType, TimePeriod } from '../../domain/value-objects';

export interface MetricData {
  id: string;
  type: MetricType;
  value: number;
  label: string;
  description?: string;
  metadata?: Record<string, any>;
  timestamp?: string;
  comparison?: {
    value: number;
    percentage: number;
    trend: 'up' | 'down' | 'stable';
  };
}

export interface MetricsFilter {
  period: TimePeriod;
  startDate?: string;
  endDate?: string;
  metricTypes?: MetricType[];
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  tension?: number;
  fill?: boolean;
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  color?: string;
}

export interface ExportOptions {
  format: 'csv' | 'pdf' | 'excel';
  includeCharts?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}
