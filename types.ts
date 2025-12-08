
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  CALCULATORS = 'CALCULATORS',
  CALC_VOLTAGE_DROP = 'CALC_VOLTAGE_DROP',
  CALC_OHMS_LAW = 'CALC_OHMS_LAW',
  CALC_CONDUIT_FILL = 'CALC_CONDUIT_FILL',
  CALC_POWER_FACTOR = 'CALC_POWER_FACTOR',
  CALC_BREAKER = 'CALC_BREAKER',
  SAFETY_CHECKLIST = 'SAFETY_CHECKLIST',
  AI_CONSULTANT = 'AI_CONSULTANT',
  PROJECTS = 'PROJECTS'
}

export type Language = 'pt' | 'en' | 'es';

export type Theme = 'light' | 'dark' | 'auto';

export interface Project {
  id: string;
  name: string;
  client: string;
  startDate: string;
  endDate: string;
  notes: string;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface VoltageDropResult {
  dropVolts: number;
  dropPercentage: number;
  acceptable: boolean;
}