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
