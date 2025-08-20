/**
 * Metric Type Value Object
 */

export enum MetricType {
  // Process Metrics
  TOTAL_PROCESSES = 'total_processes',
  ACTIVE_PROCESSES = 'active_processes',
  COMPLETED_PROCESSES = 'completed_processes',
  AVERAGE_TIME_TO_HIRE = 'average_time_to_hire',
  PROCESS_SUCCESS_RATE = 'process_success_rate',
  
  // Talent Metrics
  TOTAL_CANDIDATES = 'total_candidates',
  ACTIVE_CANDIDATES = 'active_candidates',
  PLACED_CANDIDATES = 'placed_candidates',
  CANDIDATE_QUALITY_SCORE = 'candidate_quality_score',
  TALENT_PIPELINE_HEALTH = 'talent_pipeline_health',
  
  // Performance Metrics
  RECRUITER_EFFICIENCY = 'recruiter_efficiency',
  CLIENT_SATISFACTION = 'client_satisfaction',
  OFFER_ACCEPTANCE_RATE = 'offer_acceptance_rate',
  DROPOUT_RATE = 'dropout_rate',
  
  // Financial Metrics
  REVENUE_PER_PLACEMENT = 'revenue_per_placement',
  COST_PER_HIRE = 'cost_per_hire',
  ROI = 'roi'
}

export class MetricTypeVO {
  constructor(private readonly value: MetricType) {}

  getValue(): MetricType {
    return this.value;
  }

  getLabel(): string {
    const labels: Record<MetricType, string> = {
      [MetricType.TOTAL_PROCESSES]: 'Total Processes',
      [MetricType.ACTIVE_PROCESSES]: 'Active Processes',
      [MetricType.COMPLETED_PROCESSES]: 'Completed Processes',
      [MetricType.AVERAGE_TIME_TO_HIRE]: 'Avg. Time to Hire',
      [MetricType.PROCESS_SUCCESS_RATE]: 'Success Rate',
      [MetricType.TOTAL_CANDIDATES]: 'Total Candidates',
      [MetricType.ACTIVE_CANDIDATES]: 'Active Candidates',
      [MetricType.PLACED_CANDIDATES]: 'Placed Candidates',
      [MetricType.CANDIDATE_QUALITY_SCORE]: 'Quality Score',
      [MetricType.TALENT_PIPELINE_HEALTH]: 'Pipeline Health',
      [MetricType.RECRUITER_EFFICIENCY]: 'Recruiter Efficiency',
      [MetricType.CLIENT_SATISFACTION]: 'Client Satisfaction',
      [MetricType.OFFER_ACCEPTANCE_RATE]: 'Offer Acceptance',
      [MetricType.DROPOUT_RATE]: 'Dropout Rate',
      [MetricType.REVENUE_PER_PLACEMENT]: 'Revenue/Placement',
      [MetricType.COST_PER_HIRE]: 'Cost per Hire',
      [MetricType.ROI]: 'Return on Investment'
    };
    
    return labels[this.value] || this.value;
  }

  getCategory(): 'process' | 'talent' | 'performance' | 'financial' {
    const processMetrics = [
      MetricType.TOTAL_PROCESSES,
      MetricType.ACTIVE_PROCESSES,
      MetricType.COMPLETED_PROCESSES,
      MetricType.AVERAGE_TIME_TO_HIRE,
      MetricType.PROCESS_SUCCESS_RATE
    ];
    
    const talentMetrics = [
      MetricType.TOTAL_CANDIDATES,
      MetricType.ACTIVE_CANDIDATES,
      MetricType.PLACED_CANDIDATES,
      MetricType.CANDIDATE_QUALITY_SCORE,
      MetricType.TALENT_PIPELINE_HEALTH
    ];
    
    const performanceMetrics = [
      MetricType.RECRUITER_EFFICIENCY,
      MetricType.CLIENT_SATISFACTION,
      MetricType.OFFER_ACCEPTANCE_RATE,
      MetricType.DROPOUT_RATE
    ];
    
    if (processMetrics.includes(this.value)) return 'process';
    if (talentMetrics.includes(this.value)) return 'talent';
    if (performanceMetrics.includes(this.value)) return 'performance';
    
    return 'financial';
  }
}
