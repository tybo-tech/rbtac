import { Injectable } from '@angular/core';
import {
  FieldType,
  ICollection,
  ICollectionMetadata,
  IColumn,
  IRelationship,
} from '../models/ICollection';

@Injectable({
  providedIn: 'root',
})
export class CollectionHelperService {
  fieldTypes(): FieldType[] {
    return [
      {
        value: 'auto-sequence',
        label: 'Auto Sequence',
      },
      { value: 'text', label: 'Text', description: 'Single line of text' },
      { value: 'textarea', label: 'Long Text', description: 'Multi-line text' },
      { value: 'number', label: 'Number', description: 'Numeric values' },
      { value: 'date', label: 'Date', description: 'Date picker' },
      { value: 'boolean', label: 'Checkbox', description: 'True/false values' },
      {
        value: 'select',
        label: 'Single Select',
        description: 'Choose one option',
      },
      {
        value: 'multi-select',
        label: 'Multi Select',
        description: 'Choose multiple options',
      },
      { value: 'status', label: 'Status', description: 'Status with colors' },
      { value: 'url', label: 'URL', description: 'Web link' },
      { value: 'email', label: 'Email', description: 'Email address' },
      {
        value: 'reference',
        label: 'Reference',
        description: 'Link to another collection',
      },
    ];
  }

  get simpleInputFieldTypes(): string[] {
    return ['text', 'number', 'date', 'boolean', 'url', 'email'];
  }

  //is auto-sequence
  isAutoSequence(type: string): boolean {
    return type === 'auto-sequence';
  }
  relationshipOptions(
    current: string,
    target: string
  ): { value: IRelationship['direction']; label: string }[] {
    return [
      {
        value: 'one-to-many',
        label: `A ${current} has many ${this.pluralize(target)}`,
      },
      {
        value: 'many-to-one',
        label: `An ${target} belongs to one ${current}`,
      },
      {
        value: 'one-to-one',
        label: `A ${current} has one ${target}`,
      },
    ];
  }

  private pluralize(name: string): string {
    // Naive pluralizer (can replace later)
    if (name.endsWith('y')) return name.slice(0, -1) + 'ies';
    if (name.endsWith('s')) return name + 'es';
    return name + 's';
  }

  initCollection(name: string, websiteId: number): ICollection {
    return {
      id: 0,
      websiteId,
      name,
      columns: [this.initDefaultColumn()],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: this.initCollectionMetadata(),
    };
  }

  initDefaultColumn(name = 'Name'): IColumn {
    return {
      id: this.generateUUID('col'),
      name,
      type: 'text',
      isArray: false,
      isPrimary: true,
      required: false,
    };
  }

  initCollectionMetadata(): ICollectionMetadata {
    return {
      icon: 'fa fa-database',
      color: '#000000',
      fill: '#FFFFFF',
    };
  }

  generateUUID(prefix: string = 'col'): string {
    const uuid = crypto.randomUUID?.() ?? this.fallbackUUID();
    return `${prefix}_${uuid}`;
  }

  private fallbackUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // Optional utility for checking reference type
  isReferenceType(type: string): boolean {
    return type === 'reference';
  }
}
