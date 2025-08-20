/**
 * Process Candidate Entity
 * Path: src/features/processes/domain/entities/process-candidate.entity.ts
 */

export enum ProcessCandidateStatus {
  APPLIED = 1,
  SCREENING = 2,
  INTERVIEWING = 3,
  TESTING = 4,
  OFFER_SENT = 5,
  HIRED = 6,
  REJECTED = 7,
  WITHDRAWN = 8,
}

export class ProcessCandidate {
  constructor(
    public readonly id: string,
    public readonly processId: string,
    public readonly candidateId: string,
    public readonly candidateName: string,
    public readonly candidateEmail: string,
    public status: ProcessCandidateStatus,
    public readonly appliedAt: Date,
    public lastActivityAt?: Date,
    public notes?: string,
    public score?: number,
    public ranking?: number
  ) {}

  updateStatus(newStatus: ProcessCandidateStatus): void {
    this.status = newStatus;
    this.lastActivityAt = new Date();
  }

  addNote(note: string): void {
    this.notes = this.notes ? `${this.notes}\n${note}` : note;
    this.lastActivityAt = new Date();
  }

  updateScore(score: number): void {
    if (score < 0 || score > 100) {
      throw new Error("Score must be between 0 and 100");
    }
    this.score = score;
    this.lastActivityAt = new Date();
  }

  get isActive(): boolean {
    return (
      this.status !== ProcessCandidateStatus.REJECTED &&
      this.status !== ProcessCandidateStatus.WITHDRAWN &&
      this.status !== ProcessCandidateStatus.HIRED
    );
  }

  get statusLabel(): string {
    const labels: Record<ProcessCandidateStatus, string> = {
      [ProcessCandidateStatus.APPLIED]: "Applied",
      [ProcessCandidateStatus.SCREENING]: "Screening",
      [ProcessCandidateStatus.INTERVIEWING]: "Interviewing",
      [ProcessCandidateStatus.TESTING]: "Testing",
      [ProcessCandidateStatus.OFFER_SENT]: "Offer Sent",
      [ProcessCandidateStatus.HIRED]: "Hired",
      [ProcessCandidateStatus.REJECTED]: "Rejected",
      [ProcessCandidateStatus.WITHDRAWN]: "Withdrawn",
    };
    return labels[this.status];
  }

  get statusColor(): string {
    const colors: Record<ProcessCandidateStatus, string> = {
      [ProcessCandidateStatus.APPLIED]: "blue",
      [ProcessCandidateStatus.SCREENING]: "yellow",
      [ProcessCandidateStatus.INTERVIEWING]: "purple",
      [ProcessCandidateStatus.TESTING]: "orange",
      [ProcessCandidateStatus.OFFER_SENT]: "teal",
      [ProcessCandidateStatus.HIRED]: "green",
      [ProcessCandidateStatus.REJECTED]: "red",
      [ProcessCandidateStatus.WITHDRAWN]: "gray",
    };
    return colors[this.status];
  }

  toJSON(): any {
    return {
      id: this.id,
      processId: this.processId,
      candidateId: this.candidateId,
      candidateName: this.candidateName,
      candidateEmail: this.candidateEmail,
      status: this.status,
      statusLabel: this.statusLabel,
      statusColor: this.statusColor,
      appliedAt: this.appliedAt.toISOString(),
      lastActivityAt: this.lastActivityAt?.toISOString(),
      notes: this.notes,
      score: this.score,
      ranking: this.ranking,
      isActive: this.isActive,
    };
  }
}