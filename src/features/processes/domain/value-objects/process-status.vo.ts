/**
 * Process Status Value Object
 * Path: src/features/processes/domain/value-objects/process-status.vo.ts
 */

export enum ProcessStatus {
  DRAFT = 0,
  ACTIVE = 1,
  IN_PROGRESS = 2,
  COMPLETED = 3,
  CANCELLED = 4,
  ON_HOLD = 5,
}

export class ProcessStatusVO {
  private static readonly statusLabels: Record<ProcessStatus, string> = {
    [ProcessStatus.DRAFT]: "Draft",
    [ProcessStatus.ACTIVE]: "Active",
    [ProcessStatus.IN_PROGRESS]: "In Progress",
    [ProcessStatus.COMPLETED]: "Completed",
    [ProcessStatus.CANCELLED]: "Cancelled",
    [ProcessStatus.ON_HOLD]: "On Hold",
  };

  private static readonly statusColors: Record<ProcessStatus, string> = {
    [ProcessStatus.DRAFT]: "gray",
    [ProcessStatus.ACTIVE]: "green",
    [ProcessStatus.IN_PROGRESS]: "blue",
    [ProcessStatus.COMPLETED]: "purple",
    [ProcessStatus.CANCELLED]: "red",
    [ProcessStatus.ON_HOLD]: "yellow",
  };

  private static readonly statusIcons: Record<ProcessStatus, string> = {
    [ProcessStatus.DRAFT]: "📝",
    [ProcessStatus.ACTIVE]: "✅",
    [ProcessStatus.IN_PROGRESS]: "⚡",
    [ProcessStatus.COMPLETED]: "🎯",
    [ProcessStatus.CANCELLED]: "❌",
    [ProcessStatus.ON_HOLD]: "⏸️",
  };

  constructor(private readonly value: ProcessStatus) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid process status: ${value}`);
    }
  }

  private isValid(status: any): boolean {
    return Object.values(ProcessStatus).includes(status);
  }

  get label(): string {
    return ProcessStatusVO.statusLabels[this.value];
  }

  get color(): string {
    return ProcessStatusVO.statusColors[this.value];
  }

  get icon(): string {
    return ProcessStatusVO.statusIcons[this.value];
  }

  get isActive(): boolean {
    return this.value === ProcessStatus.ACTIVE || this.value === ProcessStatus.IN_PROGRESS;
  }

  get isCompleted(): boolean {
    return this.value === ProcessStatus.COMPLETED;
  }

  get isCancelled(): boolean {
    return this.value === ProcessStatus.CANCELLED;
  }

  get isDraft(): boolean {
    return this.value === ProcessStatus.DRAFT;
  }

  get isOnHold(): boolean {
    return this.value === ProcessStatus.ON_HOLD;
  }

  canTransitionTo(newStatus: ProcessStatus): boolean {
    const transitions: Record<ProcessStatus, ProcessStatus[]> = {
      [ProcessStatus.DRAFT]: [ProcessStatus.ACTIVE, ProcessStatus.CANCELLED],
      [ProcessStatus.ACTIVE]: [ProcessStatus.IN_PROGRESS, ProcessStatus.ON_HOLD, ProcessStatus.CANCELLED],
      [ProcessStatus.IN_PROGRESS]: [ProcessStatus.COMPLETED, ProcessStatus.ON_HOLD, ProcessStatus.CANCELLED],
      [ProcessStatus.COMPLETED]: [],
      [ProcessStatus.CANCELLED]: [],
      [ProcessStatus.ON_HOLD]: [ProcessStatus.ACTIVE, ProcessStatus.CANCELLED],
    };

    return transitions[this.value].includes(newStatus);
  }

  equals(other: ProcessStatusVO): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.label;
  }

  valueOf(): ProcessStatus {
    return this.value;
  }

  static fromString(status: string): ProcessStatusVO {
    const entry = Object.entries(ProcessStatusVO.statusLabels).find(
      ([_, label]) => label.toLowerCase() === status.toLowerCase()
    );

    if (!entry) {
      throw new Error(`Invalid status string: ${status}`);
    }

    return new ProcessStatusVO(parseInt(entry[0]) as ProcessStatus);
  }

  static all(): ProcessStatus[] {
    return Object.values(ProcessStatus).filter(v => typeof v === "number") as ProcessStatus[];
  }
}

