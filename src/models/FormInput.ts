export interface FormInput {
  key: string; // formControlName
  label: string;
  type: FormInputType;
  required?: boolean;
  readonly?: boolean;
  options?: FormInputOption[]; // for select, checkbox, etc.
  placeholder?: string;
}
export interface FormInputOption {
  label: string;
  value: any;
  color?: string; // optional color for the option
  background?: string; // optional background color for the option
}
export interface FormInputGroup {
  title?: string;
  description?: string;
  grid?: string;
  inputs: FormInput[];
}
export type FormInputType =
  | 'text'
  | 'image'
  | 'select'
  | 'textarea'
  | 'number'
  | 'date'
  | 'checkbox'
  | 'number'
  | 'email'
  | 'color'
  | 'password'
  | 'variation' // custom type for variations
  | 'file'
  | 'url'
  | 'tel'
  | 'search'; // input type
