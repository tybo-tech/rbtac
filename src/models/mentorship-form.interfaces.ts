// ifoam.models.ts

// 🎯 Field types allowed in forms
export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'date'
  | 'rating'
  | 'boolean'
  | 'table';

// 📋 Table column definition (for smart table rendering)
export interface ITableColumn {
  key: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
}

// 🧩 Field definition
export interface IFormField {
  key: string;
  label: string;
  type: FormFieldType;
  value?: any;
  options?: string[]; // for select fields
  columns?: ITableColumn[]; // for type === 'table'
  repeatable?: boolean;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
}

// 🧱 Grouping fields under logical sections
export interface IFormGroup {
  key: string;
  title: string;
  description?: string;
  type?: 'group' | 'table'; // default is 'group'
  fields: IFormField[];
}

// 📐 Full form template definition (stored in `form_templates`)
export interface IFormTemplate {
  id?: number;
  title: string;
  description?: string;
  structure: IFormGroup[]; // replaces the old `groups`
  created_at?: string;
  created_by?: number;
}

// 📦 Captured session data (stored in `form_sessions`)
export interface FormSession {
  id?: number;
  form_template_id: number;
  company_id: number;
  user_id: number;
  created_at?: string;
  updated_at?: string;
  values: IFormValues;
}

// 🧠 Nested key-value data for each form session
export interface IFormValues {
  [groupKey: string]: {
    [fieldKey: string]: any;
  };
}

// 📊 Flattened answer entries for reporting (stored in `form_answers`)
export interface IFormAnswer {
  id?: number;
  form_session_id: number;
  form_template_id: number;
  group_key: string;
  field_key: string;
  row_index?: number;
  column_key?: string;
  value: any;
  value_type: FormFieldType;
  created_at?: string;
}

// 🚀 API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 📈 Analytics & Statistics
export interface IFormAnalytics {
  template_id: number;
  total_sessions: number;
  completion_rate: number;
  avg_completion_time?: number;
  field_statistics: IFieldStatistics[];
}

export interface IFieldStatistics {
  group_key: string;
  field_key: string;
  field_label: string;
  response_count: number;
  response_rate: number;
  value_distribution?: { [value: string]: number };
  numeric_stats?: {
    avg: number;
    min: number;
    max: number;
    std_dev: number;
  };
}

// 🔄 Sync Status & Monitoring
export interface ISyncStatus {
  session_id: number;
  template_id: number;
  last_sync: string;
  answers_count: number;
  sync_status: 'pending' | 'synced' | 'error';
  error_message?: string;
}

// 🎨 UI State Management
export interface IFormState {
  template: IFormTemplate | null;
  session: FormSession | null;
  currentGroup: number;
  isSubmitting: boolean;
  isDirty: boolean;
  validationErrors: { [fieldKey: string]: string[] };
  syncStatus: ISyncStatus | null;
}

// 📋 Form Builder Types (for admin interface)
export interface IFormBuilderConfig {
  availableFieldTypes: FormFieldType[];
  fieldTypeLabels: { [key in FormFieldType]: string };
  validationRules: { [key in FormFieldType]: string[] };
}

// 🔍 Search & Filtering
export interface IFormSearchFilters {
  template_id?: number;
  company_id?: number;
  user_id?: number;
  date_from?: string;
  date_to?: string;
  status?: 'draft' | 'completed' | 'archived';
}

// 📊 Dashboard Widgets
export interface IDashboardWidget {
  type: 'completion_rate' | 'recent_submissions' | 'field_analytics' | 'progress_chart';
  title: string;
  data: any;
  config?: {
    chart_type?: 'line' | 'bar' | 'pie' | 'doughnut';
    time_period?: 'week' | 'month' | 'quarter' | 'year';
    show_legend?: boolean;
  };
}

// 🔧 Service Configuration
export interface IFormServiceConfig {
  baseUrl: string;
  autoSave: boolean;
  autoSaveInterval: number; // milliseconds
  syncTimeout: number;
  retryAttempts: number;
}

// ✅ Validation Types
export interface IValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}

export interface IFieldValidation {
  [fieldKey: string]: IValidationRule[];
}

export interface IValidationResult {
  isValid: boolean;
  errors: { [fieldKey: string]: string[] };
  warnings?: { [fieldKey: string]: string[] };
}

// 🎯 Form Navigation
export interface IFormNavigation {
  currentGroupIndex: number;
  totalGroups: number;
  canNavigateNext: boolean;
  canNavigatePrevious: boolean;
  completedGroups: boolean[];
  progress: number; // 0-100
}

// 📤 Export Configuration
export interface IExportConfig {
  format: 'pdf' | 'excel' | 'csv' | 'json';
  template_id?: number;
  session_ids?: number[];
  include_analytics?: boolean;
  date_range?: {
    from: string;
    to: string;
  };
  fields?: string[]; // specific fields to export
}

// 🔔 Notification Types
export interface IFormNotification {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    callback: () => void;
  };
}

// 🎨 Theme & UI Customization
export interface IFormTheme {
  primary_color: string;
  secondary_color: string;
  success_color: string;
  warning_color: string;
  error_color: string;
  font_family: string;
  border_radius: string;
  spacing_unit: string;
}

// 🔐 Permission & Security
export interface IFormPermissions {
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_view_analytics: boolean;
  can_export: boolean;
  restricted_fields?: string[];
}

// 📱 Responsive Breakpoints
export interface IResponsiveConfig {
  mobile: number;
  tablet: number;
  desktop: number;
  wide: number;
}
