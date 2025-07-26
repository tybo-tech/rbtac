import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChipComponent } from '../chip.component';
import { IColumn } from '../../../models/ICollection';
import { ClickOutsideDirective } from '../../../directives/click.outside.directive';

@Component({
  selector: 'app-multi-select-viewer',
  templateUrl: './multi-select-viewer.component.html',
  styleUrls: ['./multi-select-viewer.component.scss'],
  standalone: true,
  imports: [ChipComponent, NgFor, NgIf, ClickOutsideDirective],
})
export class MultiSelectViewerComponent {
  @Input() column!: IColumn; // This includes options
  @Input() values: string[] = []; // selected values only

  @Output() remove = new EventEmitter<string>();
  @Output() valuesChange = new EventEmitter<string[]>(); // Emit when values change

  // Modal state
  showMultiSelectModal = false;
  tempValues: string[] = []; // Temporary values during editing

  getStyle(value: string) {
    return this.column?.options?.find((opt) => opt.value === value);
  }

  getLabel(value: string): string {
    return this.getStyle(value)?.label || value;
  }

  // Modal management
  openModal() {
    this.tempValues = [...this.values]; // Copy current values
    this.showMultiSelectModal = true;
  }

  closeModal() {
    this.showMultiSelectModal = false;
    this.tempValues = [];
  }

  // Toggle option in temporary state
  toggleOption(optionValue: string) {
    const index = this.tempValues.indexOf(optionValue);

    if (index >= 0) {
      this.tempValues.splice(index, 1);
    } else {
      this.tempValues.push(optionValue);
    }
  }

  isOptionSelected(optionValue: string): boolean {
    return this.tempValues.includes(optionValue);
  }

  // Save changes and close modal
  saveChanges() {
    this.valuesChange.emit([...this.tempValues]);
    this.closeModal();
  }

  // Remove chip directly (outside of modal)
  removeValue(value: string) {
    const updatedValues = this.values.filter((v) => v !== value);
    this.valuesChange.emit(updatedValues);
  }
}
