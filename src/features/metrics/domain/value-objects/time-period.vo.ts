/**
 * Time Period Value Object
 */

export enum TimePeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  CUSTOM = 'custom'
}

export class TimePeriodVO {
  constructor(
    private readonly value: TimePeriod,
    private readonly startDate?: Date,
    private readonly endDate?: Date
  ) {}

  getValue(): TimePeriod {
    return this.value;
  }

  getLabel(): string {
    const labels: Record<TimePeriod, string> = {
      [TimePeriod.DAILY]: 'Daily',
      [TimePeriod.WEEKLY]: 'Weekly',
      [TimePeriod.MONTHLY]: 'Monthly',
      [TimePeriod.QUARTERLY]: 'Quarterly',
      [TimePeriod.YEARLY]: 'Yearly',
      [TimePeriod.CUSTOM]: 'Custom Range'
    };
    
    return labels[this.value];
  }

  getDateRange(): { start: Date; end: Date } {
    const now = new Date();
    let start: Date;
    let end: Date = now;

    if (this.value === TimePeriod.CUSTOM) {
      return {
        start: this.startDate || now,
        end: this.endDate || now
      };
    }

    switch (this.value) {
      case TimePeriod.DAILY:
        start = new Date(now.setHours(0, 0, 0, 0));
        break;
      case TimePeriod.WEEKLY:
        start = new Date(now.setDate(now.getDate() - 7));
        break;
      case TimePeriod.MONTHLY:
        start = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case TimePeriod.QUARTERLY:
        start = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case TimePeriod.YEARLY:
        start = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        start = now;
    }

    return { start, end };
  }
}
