// Auto-generated schema.ts file

export interface ICompany {
  id?: number;
  name: string;
  registration_no?: string;
  annual_turnover?: string;
  turnover_verified?: boolean;
  address_line1?: string;
  suburb?: string;
  city?: string;
  postal_code?: string;
  types_of_address?: string;
  sector?: string;
  description?: string;
  no_perm_employees?: number;
  no_temp_employees?: number;
  bbbee_level?: string;
  bbbee_expiry_date?: string;
  visit_date?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
  status_id?: number;
  trading_name?: string;
  cipc_status?: string;
  is_black_owned?: boolean;
  is_black_women_owned?: boolean;
  is_youth_owned?: boolean;
  company_size?: string;
  tax_pin_expiry_date?: string;
  tax_pin_status?: string;
  bbbee_status?: string;
  users?: IUser[];
  documents?: IDocument[];
  programs?: IProgram[];
  reasons?: IReason[];
  orders?: ICompanyOrder[];
  revenues?: ICompanyRevenue[];
}


export interface IUser {
  id?: number;
  name?: string;
  gender?: string;
  race?: string;
  email?: string;
  cell?: string;
  dob?: string;
  id_number?: string;
  password?: string;
  company_id?: number;
  is_primary?: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
  status_id?: number;
  company?: ICompany;
}


export interface IProgram {
  id?: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
  status_id?: number;
}


export interface IReason {
  id?: number;
  reason: string;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
  status_id?: number;
}


export interface IDocument {
  id?: number;
  company_id?: number;
  name?: string;
  url?: string;
  date_uploaded?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
  status_id?: number;
  company?: ICompany;
}


export interface ISupplier {
  id?: number;
  name: string;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
  status_id?: number;
}


export interface IProductType {
  id?: number;
  name: string;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
  status_id?: number;
}


export interface IProduct {
  id?: number;
  name: string;
  product_type_id?: number;
  is_hamper?: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
  status_id?: number;
  product_type?: IProductType;
}


export interface ICompanyOrder {
  id?: number;
  company_id: number;
  supplier_id?: number;
  total_amount?: number;
  purchase_order?: boolean;
  invoice_received?: boolean;
  invoice_type?: string;
  items_received?: boolean;
  quotes_match?: boolean;
  comment?: string;
  note?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
  status_id?: number;
  company?: ICompany;
  supplier?: ISupplier;
  products?: ICompanyOrderProduct[];
}


export interface ICompanyOrderProduct {
  id?: number;
  company_order_id: number;
  product_id: number;
  quantity?: number;
  unit_price?: number;
  subtotal?: number;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
  status_id?: number;
  order?: ICompanyOrder;
  product?: IProduct;
}


export interface ICompanyRevenue {
  id?: number;
  company_id: number;
  revenue_amount?: number;
  opening_balance?: number;
  closing_balance?: number;
  month: number;
  year: number;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
  status_id?: number;
  company?: ICompany;
}


export interface ICompanyProgram {
  id?: number;
  company_id: number;
  program_id: number;
  joined_at?: string;
  created_at?: string;
  updated_at?: string;
  status_id?: number;
  company?: ICompany;
  program?: IProgram;
}


export interface ICompanyReason {
  id?: number;
  company_id?: number;
  reason_id?: number;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
  status_id?: number;
  company?: ICompany;
  reason?: IReason;
}

export interface IProgramStage {
  id?: number;
  program_id: number;
  title: string;
  description?: string;
  stage_order?: number;
  created_at?: string;
  updated_at?: string;
  program_name?: string;
}

export interface ICompanyProgramStage {
  id?: number;
  company_id: number;
  program_id: number;
  program_stage_id: number;
  entered_at?: string;
  completed_at?: string;
  is_current?: boolean;
  created_at?: string;
  updated_at?: string;
  company_name?: string;
  program_name?: string;
  stage_title?: string;
  stage_order?: number;
  stage_description?: string;
}

export interface IStageTransition {
  action: 'advance' | 'move_to' | 'create';
  company_id: number;
  program_id: number;
  target_stage_id?: number;
  program_stage_id?: number;
  user_id?: number;
}

export interface IStageStatistics {
  stage_id: number;
  stage_title: string;
  stage_order: number;
  company_count: number;
  current_companies: number;
  completed_companies: number;
}

export interface ICompanyStageView {
  company_id: number;
  company_name: string;
  sector?: string;
  current_stage_record_id?: number;
  current_stage_id?: number;
  current_stage_title?: string;
  current_stage_order?: number;
  stage_entered_at?: string;
  stage_completed_at?: string;
  program_joined_at?: string;
}

// Initialize objects
export const initProgramStage: IProgramStage = {
  program_id: 0,
  title: '',
  description: '',
  stage_order: 1
};

export const initCompanyProgramStage: ICompanyProgramStage = {
  company_id: 0,
  program_id: 0,
  program_stage_id: 0,
  is_current: true
};


