import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  ICollection,
  ICollectionData,
  IColumn,
  IReferenceOption,
  IReferenceOptionMap,
} from '../../../models/ICollection';
import {
  NgFor,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClickOutsideDirective } from '../../../directives/click.outside.directive';
import { MultiSelectViewerComponent } from '../../shared/multi-select-viewer/multi-select-viewer.component';
import { CollectionColumnMenuComponent } from '../collection-column-menu/collection-column-menu.component';
import { IView } from '../../../models/IView';
import { ReferenceFieldComponent } from "../reference-field/reference-field.component";

@Component({
  selector: 'app-collection-table-view',
  imports: [
    NgIf,
    NgFor,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    FormsModule,
    MultiSelectViewerComponent,
    CollectionColumnMenuComponent,
    ReferenceFieldComponent
],
  templateUrl: './collection-table-view.component.html',
  styleUrl: './collection-table-view.component.scss',
})
export class CollectionTableViewComponent implements OnDestroy, OnChanges {
  selectAll = false;
  openDropdowns = new Set<string>(); // Track which dropdowns are open
  @Input() referenceOptionsMap: IReferenceOptionMap = {};

  @Input() collection?: ICollection;
  @Input() view!: IView;
  @Input() collectionData: ICollectionData[] = [];
  @Output() onAddColumn = new EventEmitter<void>();
  @Output() onEditColumn = new EventEmitter<IColumn>();
  @Output() onDeleteColumn = new EventEmitter<IColumn>();
  @Output() onMoveLeft = new EventEmitter<IColumn>();
  @Output() onMoveRight = new EventEmitter<IColumn>();
  @Output() onAddRow = new EventEmitter<void>();
  @Output() onSaveCollection = new EventEmitter<void>();
  @Output() onEditRow = new EventEmitter<ICollectionData>();
  @Output() onDeleteRow = new EventEmitter<ICollectionData>();
  @Output() onColumnDataUpdate = new EventEmitter<ICollectionData>();
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collectionData']) {
      // Reset selectAll when collectionData changes
      this.selectAll = false;
      this.collectionData.forEach((row) => {
        if (Array.isArray(row.data)) {
          row.data = {};
        }
      });
    }
  }

  getReferenceOptions(col: IColumn): IReferenceOption[] {
    return this.referenceOptionsMap[col.id] || [];
  }
  onReferenceValueChange(
    row: ICollectionData,
    col: IColumn,
    newValue: string | string[]
  ) {
    row.data[col.id] = newValue;
    this.onUpdateCell(row);
  }

  isMultiSelectChecked(
    row: ICollectionData,
    col: IColumn,
    optionValue: string
  ): boolean {
    const values = row.data[col.id] || [];
    return values.includes(optionValue);
  }

  getOptionStyle(
    col: IColumn,
    value: string
  ): { background?: string; color?: string } | null {
    const option = col.options?.find((opt) => opt.value === value);
    return option
      ? { background: option.background, color: option.color }
      : null;
  }

  getOptionLabel(col: IColumn, value: string): string {
    const option = col.options?.find((opt) => opt.value === value);
    return option?.label || value || 'Unknown';
  }

  // Select dropdown management
  toggleSelectDropdown(rowIndex: number, colId: string): void {
    const key = `${rowIndex}-${colId}`;
    if (this.openDropdowns.has(key)) {
      this.openDropdowns.delete(key);
    } else {
      // Close all other dropdowns first
      this.openDropdowns.clear();
      this.openDropdowns.add(key);
    }
  }

  isSelectDropdownOpen(rowIndex: number, colId: string): boolean {
    const key = `${rowIndex}-${colId}`;
    return this.openDropdowns.has(key);
  }

  selectOption(
    row: ICollectionData,
    col: IColumn,
    value: string,
    rowIndex: number
  ): void {
    row.data[col.id] = value;
    this.onUpdateCell(row);
    this.openDropdowns.clear(); // Close dropdown after selection
  }

  clearSelection(row: ICollectionData, col: IColumn, rowIndex: number): void {
    row.data[col.id] = undefined;
    this.onUpdateCell(row);
    this.openDropdowns.clear(); // Close dropdown after clearing
  }

  ngOnDestroy(): void {
    this.openDropdowns.clear();
  }

  onUpdateCell(dataItem: ICollectionData) {
    this.onColumnDataUpdate.emit(dataItem);
  }

  // Simplified multi-select update method
  updateMultiSelectValues(
    row: ICollectionData,
    col: IColumn,
    newValues: string[]
  ) {
    row.data[col.id] = newValues;
    this.onColumnDataUpdate.emit(row);
  }
}
