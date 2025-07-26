import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FieldType,
  IColumn,
  ICollection,
  IRelationship,
} from '../../../models/ICollection';
import { ClickOutsideDirective } from '../../../directives/click.outside.directive';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { CollectionHelperService } from '../../../services/collections.helper.service';

@Component({
  selector: 'app-collection-column',
  imports: [ClickOutsideDirective, FormsModule, NgClass, NgFor, NgIf],
  templateUrl: './collection-column.component.html',
  styleUrl: './collection-column.component.scss',
})
export class CollectionColumnComponent {
  @Input({ required: true }) column!: IColumn;
  @Input({ required: true }) collections!: ICollection[];
  @Input() currentCollectionName: string = 'Collection'; // pass this in
  @Output() onCloseModal = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<IColumn>();

  fieldTypes: FieldType[];

  constructor(public helper: CollectionHelperService) {
    this.fieldTypes = this.helper.fieldTypes();
  }

  get targetCollectionName(): string {
    const target = this.collections.find(
      (c) => c.id === this.column.referenceCollectionId
    );
    return target?.name ?? 'Target';
  }

  get relationshipOptions() {
    return this.helper.relationshipOptions(
      this.currentCollectionName,
      this.targetCollectionName
    );
  }

  onRelationshipChange() {
    if (!this.column.relationship) return;
    const relationship = this.column.relationship
      ?.direction as IRelationship['direction'];
    this.column.isArray = relationship === 'one-to-many';
  }

  addOption() {
    if (!this.column.options) {
      this.column.options = [];
    }

    this.column.options.push({
      value: '',
      label: '',
      background: '#f97316', // Default orange
      color: '#ffffff', // Default white text
    });
  }

  removeOption(index: number) {
    this.column.options?.splice(index, 1);
  }

  onOptionLabelChange(option: any) {
    // Auto-generate value from label
    // option.value = option.label.toLowerCase().replace(/\s+/g, '_');
    option.value = option.label;
  }
  hasDefaultValue(type: string): any {
    return this.helper.simpleInputFieldTypes.includes(type);
  }
  refreshDefaultOption(newIndex: number) {
    if (this.column.options) {
      this.column.options.forEach((option, index) => {
        option.isDefault = index === newIndex;
      });
    }
  }

  get isAutoSequence(): boolean {
    return this.helper.isAutoSequence(this.column.type);
  }
}
