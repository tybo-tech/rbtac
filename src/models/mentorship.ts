export interface IMentorshipTemplate {
  id?: number;
  title: string;
  name?: string; // Alias for title for compatibility
  description?: string;
  category?: string;
  category_name?: string; // For join results
  is_active?: boolean;
  question_count?: number; // For aggregated results
  session_count?: number; // For aggregated results
  created_at?: string;
  updated_at?: string;
  categories?: IMentorshipCategory[];
  questions?: IMentorshipQuestion[];
}

export interface IMentorshipCategory {
  id?: number;
  template_id: number;
  parent_id?: number;
  name: string;
  sort_order: number;
  children?: IMentorshipCategory[];
}

export interface IMentorshipQuestion {
  id?: number;
  template_id: number;
  category_id?: number;
  question_text: string;
  question_type: 'text' | 'textarea' | 'number' | 'boolean' | 'dropdown' | 'date';
  is_required: boolean;
  options?: string[] | any;
  calculation?: any;
  trigger_task: boolean;
  sort_order: number;
}

export interface IExtendedMentorshipQuestion extends IMentorshipQuestion {
  optionsText?: string;
}

export interface IMentorshipSession {
  id?: number;
  company_id: number;
  template_id: number;
  session_date: string;
  scheduled_at?: string; // For scheduled sessions
  status?: 'scheduled' | 'in_progress' | 'completed';
  completion_percentage?: number;
  task_count?: number;
  notes?: string;
  created_by?: number;
  company_name?: string;
  template_name?: string; // For join results
  template_title?: string;
  mentor_name?: string; // For join results
  created_by_name?: string;
  responses?: IMentorshipResponse[];
  tasks?: IMentorshipTask[];
}

export interface IMentorshipResponse {
  id?: number;
  session_id: number;
  question_id: number;
  response_text?: string;
  numeric_value?: number;
  date_value?: string;
  boolean_value?: boolean;
  created_at?: string;
  question_text?: string;
  question_type?: string;
  options?: any;
  is_required?: boolean;
}

export interface IMentorshipTask {
  id?: number;
  session_id: number;
  question_id?: number;
  company_id: number;
  task_title: string;
  title?: string; // Alias for task_title
  task_description?: string;
  description?: string; // Alias for task_description
  assigned_to?: number;
  status: 'pending' | 'in_progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  due_date?: string;
  created_at?: string;
  company_name?: string;
  assigned_to_name?: string;
  session_date?: string;
  question_text?: string;
  template_title?: string;
}

export interface IMentorshipStatistics {
  total_sessions?: number;
  totalSessions?: number; // Alias
  activeSessions?: number;
  completedSessions?: number;
  unique_companies?: number;
  templates_used?: number;
  avg_age_minutes?: number;
  total_tasks?: number;
  pending_tasks?: number;
  pendingTasks?: number; // Alias
  in_progress_tasks?: number;
  completed_tasks?: number;
  overdue_tasks?: number;
  overdueTasks?: number; // Alias
  averageProgress?: number;
  total_responses?: number;
  unique_questions?: number;
  numeric_responses?: number;
  avg_numeric_value?: number;
}

export interface IApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  id?: number;
}
