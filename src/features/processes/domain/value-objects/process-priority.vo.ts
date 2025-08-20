/**
 * Process Priority Value Object
 * Path: src/features/processes/domain/value-objects/process-priority.vo.ts
 */

export enum ProcessPriority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  URGENT = 4,
}

export class ProcessPriorityVO {
  private static readonly priorityLabels: Record<ProcessPriority, string> = {
    [ProcessPriority.LOW]: "Low",
    [ProcessPriority.MEDIUM]: "Medium",
    [ProcessPriority.HIGH]: "High",
    [ProcessPriority.URGENT]: "Urgent",
  };

  private static readonly priorityColors: Record<ProcessPriority, string> = {
    [ProcessPriority.LOW]: "gray",
    [ProcessPriority.MEDIUM]: "blue",
    [ProcessPriority.HIGH]: "orange",
    [ProcessPriority.URGENT]: "red",
  };

  private static readonly priorityIcons: Record<ProcessPriority, string> = {
    [ProcessPriority.LOW]: "➖",
    [ProcessPriority.MEDIUM]: "➕",
    [ProcessPriority.HIGH]: "⚠️",
    [ProcessPriority.URGENT]: "🔥",
  };

  constructor(private readonly value: ProcessPriority) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid process priority: ${value}`);
    }
  }

  private isValid(priority: any): boolean {
    return Object.values(ProcessPriority).includes(priority);
  }

  get label(): string {
    return ProcessPriorityVO.priorityLabels[this.value];
  }

  get color(): string {
    return ProcessPriorityVO.priorityColors[this.value];
  }

  get icon(): string {
    return ProcessPriorityVO.priorityIcons[this.value];
  }

  get weight(): number {
    return this.value;
  }

  isHigherThan(other: ProcessPriorityVO): boolean {
    return this.value > other.value;
  }

  isLowerThan(other: ProcessPriorityVO): boolean {
    return this.value < other.value;
  }

  equals(other: ProcessPriorityVO): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.label;
  }

  valueOf(): ProcessPriority {
    return this.value;
  }

  static fromString(priority: string): ProcessPriorityVO {
    const entry = Object.entries(ProcessPriorityVO.priorityLabels).find(
      ([_, label]) => label.toLowerCase() === priority.toLowerCase()
    );

    if (!entry) {
      throw new Error(`Invalid priority string: ${priority}`);
    }

    return new ProcessPriorityVO(parseInt(entry[0]) as ProcessPriority);
  }

  static all(): ProcessPriority[] {
    return Object.values(ProcessPriority).filter(v => typeof v === "number") as ProcessPriority[];
  }

  static default(): ProcessPriorityVO {
    return new ProcessPriorityVO(ProcessPriority.MEDIUM);
  }
}