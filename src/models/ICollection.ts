export interface ICollection {
  id: number;
  websiteId: number;
  name: string;
  columns: IColumn[];
  created_at: string;
  updated_at: string;
  metadata: ICollectionMetadata;
}

export interface ICollectionMetadata {
  icon?: string;
  color?: string;
  fill?: string;
}

export interface IColumn {
  id: string;
  name: string;
  type: string; // 'text', 'number', 'select', 'reference', etc.
  isArray: boolean;
  isPrimary: boolean;
  required?: boolean;
  options?: ColumnOption[];
  defaultValue?: any; // Default value for the column
  // Only used when type === 'reference'
  referenceCollectionId?: number; // The target collection ID
  relationship?: IRelationship; // Optional relational info
  prefix?: string;

  // UI state
  showMenu?: boolean;
}

export interface IRelationship {
  direction: 'one-to-one' | 'one-to-many' | 'many-to-one';
  reverseFieldName?: string; // Suggested name on target collection
  createReverse?: boolean; // Whether to auto-create reverse field
}

export interface ColumnOption {
  value: string;
  label: string;
  color?: string;
  isDefault?: boolean;
  background?: string;
}

export interface ICollectionData<T = any> {
  id: number;
  collection_id: number | string; // Collection ID or name
  data: T;
  created_at?: string;
  updated_at?: string;

  // UI state (optional)
  selected?: boolean;
}

export interface FieldType {
  value: string;
  label: string;
  description?: string;
}



export interface IReferenceRequest {
  column_id: string;
  referenceCollectionId: number;
}

export interface IReferenceOption {
  id: number | string;
  name: string;
}

export interface IReferenceOptionMap {
  [columnId: string]: IReferenceOption[];
}
