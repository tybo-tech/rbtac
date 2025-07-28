export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'badge' | 'number' | 'icon' | 'actions' | 'custom' | 'date';
  class?: string;

  // Width properties
  width?: string; // Fixed width (e.g., '150px')
  minWidth?: string; // Minimum width (e.g., '100px')
  maxWidth?: string; // Maximum width (e.g., '200px')

  // Text behavior
  wrap?: boolean; // Allow text wrapping (default: false)
  truncate?: boolean; // Truncate with ellipsis (default: false)

  // Cell rendering
  render?: (row: any) => string;
  sortable?: boolean;
  format?: string; // For dates/numbers formatting

  // Styling
  headerClass?: string; // Custom class for header cell
  cellClass?: string; // Custom class for data cells

  // Additional properties
  visible?: boolean;
  icon?: string; // For icon columns
}

export interface ITableView {
  user_id: number;
  table_name: string;
  view_type: 'TableView';
  is_default: boolean;
  table_columns: TableColumn[];
  filters?: TableFilter[];
  joins?: string[]; // Controlled list of joinable tables
}
export interface TableFilter {
  key: string; // e.g. 'program_id'
  operator?: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN';
  value: any; // Could be string, number, array
  source?: string; // optional: table to apply filter on, e.g. 'programs'
}

export interface TableJoin {
  table:
    | 'users'
    | 'company_programs'
    | 'company_orders'
    | 'company_revenues'
    | 'documents'
    | 'suppliers'
    | 'products'
    | 'reasons'
    | 'programs'; // add more as needed
}
