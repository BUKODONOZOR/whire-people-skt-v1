/**
 * Export Metrics Use Case
 */

import { IMetricsRepository, MetricsFilters } from '../../domain/repositories/metrics.repository.interface';

export class ExportMetricsUseCase {
  constructor(private readonly repository: IMetricsRepository) {}

  async execute(
    filters: MetricsFilters,
    format: 'csv' | 'pdf',
    token: string
  ): Promise<Blob> {
    if (!token) {
      throw new Error('Authentication token is required');
    }

    return await this.repository.exportMetrics(filters, format, token);
  }
}
