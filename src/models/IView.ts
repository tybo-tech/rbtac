///  models/IView.ts

export interface IView {
  id: number;
  collection_id: number;
  name: string;
  type: ViewType;
  config: { filters: FilterCondition[]; columns: string[] };
  created_at?: string;
  updated_at?: string;
  field: string; // the column ID this report focuses on
}

export enum ViewTypes {
  Table = 'table',
  SelectDistribution = 'select-distribution',
  MultiSelectFrequency = 'multi-select-frequency',
  NumberSummary = 'number-summary',
  DateDistribution = 'date-distribution',
  BooleanDistribution = 'boolean-distribution',
}

export type ViewType =
  | 'table'
  | 'select-distribution'
  | 'multi-select-frequency'
  | 'number-summary'
  | 'date-distribution'
  | 'boolean-distribution';

// view types array for dropdowns
export const ViewTypesArray: { value: ViewType; label: string }[] = [
  { value: 'table', label: 'Table View' },
  { value: 'select-distribution', label: 'Single Select Analysis' },
  { value: 'multi-select-frequency', label: 'Multi Select Frequency' },
  { value: 'number-summary', label: 'Number Summary' },
  { value: 'date-distribution', label: 'Date Distribution' },
  { value: 'boolean-distribution', label: 'Boolean Distribution' },
];

export interface FilterCondition {
  field: string; // column ID
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'contains';
  value: any;
  combination?: 'and' | 'or'; // optional, for complex filters
}

/*
-- Table view for "Waiting for docs"
INSERT INTO views (collection_id, name, type, config)
VALUES (
  1,
  'Waiting for Docs',
  'table',
  '{
    "columns": ["col_hogkjb9ms", "1751862448933"],
    "filters": [
      { "field": "1751863730036", "operator": "=", "value": "Waiting for docs" }
    ]
  }'
);

-- Report view: Turnover > 3M
INSERT INTO views (collection_id, name, type, config)
VALUES (
  1,
  'Turnover > 3M',
  'number-summary',
  '{
    "field": "1751862448933",
    "filters": [
      { "field": "1751862448933", "operator": ">", "value": 3000000 }
    ]
  }'
);

*/
