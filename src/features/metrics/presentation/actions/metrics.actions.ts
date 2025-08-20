/**
 * Metrics Server Actions
 */

"use server";

import { GetDashboardMetricsUseCase, ExportMetricsUseCase } from '../../application/use-cases';
import { MetricsRepositoryImpl } from '../../infrastructure/repositories/metrics.repository.impl';
import { MetricsFilters } from '../../domain/repositories/metrics.repository.interface';

const repository = new MetricsRepositoryImpl();

/**
 * Get Dashboard Metrics Action
 */
export async function getDashboardMetricsAction(
  filters: MetricsFilters,
  token: string
) {
  try {
    console.log('[MetricsAction] Getting dashboard metrics with token:', token.substring(0, 30) + '...');
    
    const useCase = new GetDashboardMetricsUseCase(repository);
    const metrics = await useCase.execute(filters, token);
    
    return {
      success: true,
      data: metrics,
    };
  } catch (error) {
    console.error('[MetricsAction] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch metrics',
    };
  }
}

/**
 * Export Metrics Action
 */
export async function exportMetricsAction(
  filters: MetricsFilters,
  format: 'csv' | 'pdf',
  token: string
) {
  try {
    console.log('[MetricsAction] Exporting metrics with token:', token.substring(0, 30) + '...');
    
    const useCase = new ExportMetricsUseCase(repository);
    const blob = await useCase.execute(filters, format, token);
    
    // Convert Blob to base64 for transfer
    const buffer = await blob.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    
    return {
      success: true,
      data: {
        content: base64,
        mimeType: format === 'csv' ? 'text/csv' : 'application/pdf',
        filename: `metrics-export-${new Date().toISOString().split('T')[0]}.${format}`,
      },
    };
  } catch (error) {
    console.error('[MetricsAction] Export error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to export metrics',
    };
  }
}
