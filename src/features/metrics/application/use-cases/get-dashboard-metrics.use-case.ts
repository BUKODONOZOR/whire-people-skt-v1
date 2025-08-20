/**
 * Get Dashboard Metrics Use Case
 */

import { IMetricsRepository, DashboardMetrics, MetricsFilters } from '../../domain/repositories/metrics.repository.interface';

export class GetDashboardMetricsUseCase {
  constructor(private readonly repository: IMetricsRepository) {}

  async execute(filters: MetricsFilters, token: string): Promise<DashboardMetrics> {
    if (!token) {
      throw new Error('Authentication token is required');
    }

    return await this.repository.getDashboardMetrics(filters, token);
  }
}
