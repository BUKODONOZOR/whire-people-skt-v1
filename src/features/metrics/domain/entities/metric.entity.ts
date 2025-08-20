/**
 * Metric Entity
 * Core business model for metrics
 */

export class Metric {
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly value: number,
    public readonly label: string,
    public readonly description?: string,
    public readonly metadata?: Record<string, any>,
    public readonly timestamp?: Date,
    public readonly comparison?: {
      value: number;
      percentage: number;
      trend: 'up' | 'down' | 'stable';
    }
  ) {}

  static create(data: Partial<Metric>): Metric {
    return new Metric(
      data.id || '',
      data.type || '',
      data.value || 0,
      data.label || '',
      data.description,
      data.metadata,
      data.timestamp,
      data.comparison
    );
  }

  isPositiveTrend(): boolean {
    if (!this.comparison) return true;
    
    // For some metrics, down is good (e.g., time to hire)
    const downIsGood = ['time_to_hire', 'dropout_rate', 'rejection_rate'].includes(this.type);
    
    if (downIsGood) {
      return this.comparison.trend === 'down' || this.comparison.trend === 'stable';
    }
    
    return this.comparison.trend === 'up' || this.comparison.trend === 'stable';
  }

  getFormattedValue(): string {
    if (this.type.includes('rate') || this.type.includes('percentage')) {
      return `${this.value.toFixed(1)}%`;
    }
    
    if (this.type.includes('time') || this.type.includes('days')) {
      return `${this.value} days`;
    }
    
    if (this.type.includes('currency') || this.type.includes('salary')) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      }).format(this.value);
    }
    
    return this.value.toLocaleString();
  }
}
