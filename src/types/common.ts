export interface ApiResponse<T = unknown> {
  data: T;
  status: string;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export type UnknownObject = Record<string, unknown>;
export type StringKeyObject = Record<string, string>;

// Tipos específicos para formularios
export interface LoginFormData {
  email: string;
  password: string;
}

// Tipos para métricas
export interface MetricData {
  id: string;
  value: number;
  label: string;
  date?: string;
}

// Tipos para procesos
export interface ProcessData {
  id: string;
  title: string;
  status: string;
  priority: string;
  description?: string;
}

// Tipos para talent
export interface TalentData {
  id: string;
  name: string;
  email: string;
  skills: string[];
  cohort?: string;
}
