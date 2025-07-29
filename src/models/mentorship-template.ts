// Mentorship Template Models
// These models define the structure for converting Excel forms into dynamic templates

export interface IMentorshipTemplateQuestion {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'dropdown' | 'textarea' | 'list' | 'task' | 'calculated';
  options?: string[]; // For dropdown type
  items?: string[]; // For list type
  calculated?: string; // Formula for calculated fields
  due_date?: string; // For task type
  triggers?: ITaskTrigger[]; // Conditions that create tasks
  required?: boolean;
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface ITaskTrigger {
  condition: string; // The condition that triggers the task
  createTask: string; // Task description to create
  priority?: 'low' | 'medium' | 'high';
  assignee?: string;
  due_days?: number; // Days from trigger to due date
}

export interface IMentorshipTemplateCategory {
  name: string;
  description?: string;
  order: number;
  questions: IMentorshipTemplateQuestion[];
}

export interface IMentorshipTemplate {
  id?: number;
  name: string;
  description: string;
  program_type: string; // e.g., 'baseline', 'financial_turnaround', 'growth_strategy'
  version: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  categories: IMentorshipTemplateCategory[];
}

// Response Models
export interface IMentorshipResponse {
  id?: number;
  template_id: number;
  session_id: number;
  entrepreneur_id: number;
  responses: { [key: string]: any }; // Key-value pairs of question responses
  completion_percentage: number;
  status: 'draft' | 'in_progress' | 'completed' | 'reviewed';
  created_at?: string;
  updated_at?: string;
  triggered_tasks?: ITriggeredTask[];
}

export interface ITriggeredTask {
  id?: number;
  response_id: number;
  task_description: string;
  trigger_condition: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  due_date?: string;
  created_at?: string;
}

// Template Library
export interface ITemplateLibrary {
  baseline: IMentorshipTemplate;
  financial_turnaround: IMentorshipTemplate;
  growth_strategy: IMentorshipTemplate;
  compliance_readiness: IMentorshipTemplate;
}

// API Response Types
export interface ITemplateApiResponse {
  success: boolean;
  data: IMentorshipTemplate | IMentorshipTemplate[];
  message?: string;
  errors?: string[];
}

export interface IResponseApiResponse {
  success: boolean;
  data: IMentorshipResponse | IMentorshipResponse[];
  message?: string;
  errors?: string[];
}
