export interface IFormTemplate {
  title: string;
  description?: string;
  groups: IFormGroup[];
}

export interface IFormGroup {
  title: string;
  key: string;
  description?: string;
  type?: 'group' | 'table'; // default is 'group'
  fields: IFormField[];
}

export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'date'
  | 'rating'
  | 'boolean'
  | 'table';

export interface IFormField {
  key: string;
  label: string;
  type: FormFieldType;
  value?: any; // optional default value
  options?: string[]; // for 'select', 'radio'
  columns?: IFormField[]; // for table fields (type === 'table')
}

// The main session data stored in your collection_data.data
export interface FormSession {
  form_template_id: string;
  company_id: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  values: IFormValues;
}

// Values captured per session based on the form template
export interface IFormValues {
  [groupKey: string]: {
    [fieldKey: string]: any;
  };
}


export const COLLECTION_NAMES = {
  FORM_TEMPLATES: 'form_templates',
  FORM_SESSIONS: 'form_sessions',
  FORM_VALUES: 'form_values',
  FORM_GROUPS: 'form_groups',
  FORM_FIELDS: 'form_fields',
  FORM_RESPONSES: 'form_responses',
  FORM_QUESTIONS: 'form_questions',
  FORM_ANSWERS: 'form_answers',
}
