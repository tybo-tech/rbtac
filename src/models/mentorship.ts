// --- Template Structure ---

export interface IMentorshipTemplate {
  id?: number;
  name: string;
  description: string;
  program_type: string; // e.g., 'baseline', 'financial_turnaround', 'growth_strategy'
  version: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  categories: IMentorshipCategory[];
  question_count?: number;
  session_count?: number;
}

export interface IMentorshipCategory {
  id?: number;
  template_id: number;
  name: string;
  description?: string;
  parent_id?: number;
  order: number;
  questions: IMentorshipQuestion[];
}

export interface IMentorshipQuestion {
question_text: any;
is_required: any;
trigger_task: any;
question_type: any;
  id?: number;
  category_id: number;
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'dropdown' | 'textarea' | 'list' | 'task' | 'calculated' | 'boolean';
  options?: string[];
  items?: string[];
  calculated?: string;
  due_date?: string;
  triggers?: ITaskTrigger[];
  required?: boolean;
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface ITaskTrigger {
  id?: number;
  question_id: number;
  condition: string;
  createTask: string;
  priority?: 'low' | 'medium' | 'high';
  assignee?: string;
  due_days?: number;
}


// --- Session & Response Structure ---

export interface IMentorshipSession {
  id?: number;
  company_id: number;
  template_id: number;
  session_date: string;
  scheduled_at?: string;
  status?: 'scheduled' | 'in_progress' | 'completed' | 'reviewed';
  completion_percentage?: number;
  notes?: string;
  created_by?: number;
  company_name?: string;
  template_name?: string;
  mentor_name?: string;
  created_by_name?: string;
  responses?: { [key: string]: any }; // Key-value pairs of question responses (key is question.key)
  tasks?: IMentorshipTask[];
  triggered_tasks?: ITriggeredTask[];
}

// This represents a response to a single question, useful for DB storage but maybe not for frontend state
export interface IMentorshipQuestionResponse {
  id?: number;
  session_id: number;
  question_id: number;
  response_value: any; // Can be string, number, boolean, string[]
  created_at?: string;
}

export interface IMentorshipTask {
  id?: number;
  session_id: number;
  question_id?: number; // The question that triggered this task
  company_id: number;
  task_title: string;
  task_description?: string;
  assigned_to?: number;
  status: 'pending' | 'in_progress' | 'done' | 'cancelled';
  priority?: 'low' | 'medium' | 'high';
  due_date?: string;
  created_at?: string;
  company_name?: string;
  assigned_to_name?: string;
  session_date?: string;
  question_text?: string;
  template_title?: string;
}

// This is a task that was automatically created by a trigger
export interface ITriggeredTask extends IMentorshipTask {
    trigger_condition: string;
}


// --- Analytics & API ---

export interface IMentorshipStatistics {
  total_sessions?: number;
  activeSessions?: number;
  completedSessions?: number;
  unique_companies?: number;
  templates_used?: number;
  avg_age_minutes?: number;
  total_tasks?: number;
  pending_tasks?: number;
  in_progress_tasks?: number;
  completed_tasks?: number;
  overdue_tasks?: number;
  averageProgress?: number;
  total_responses?: number;
  unique_questions?: number;
  numeric_responses?: number;
  avg_numeric_value?: number;
}

// --- Response Structure ---

export interface IMentorshipResponse {
  id?: number;
  session_id: number;
  question_id: number;
  question_key: string;
  response_value: any;
  response_text?: string;
  created_at?: string;
  updated_at?: string;
}

export interface IApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  id?: number;
}
