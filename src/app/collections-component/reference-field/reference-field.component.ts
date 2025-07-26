import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IColumn, IReferenceOption } from '../../../models/ICollection';
import { ReferencePickerComponent } from '../reference-picker/reference-picker.component';

@Component({
  selector: 'app-reference-field',
  standalone: true,
  imports: [CommonModule, ReferencePickerComponent],
  templateUrl: './reference-field.component.html',
  styleUrl: './reference-field.component.scss',
})
export class ReferenceFieldComponent {
  @Input() column!: IColumn;
  @Input() value!: string | string[] | undefined;
  @Input() options: IReferenceOption[] = [];

  @Output() valueChange = new EventEmitter<string | string[]>();

  isPickerOpen = false;

  get isMultiple(): boolean {
    return !!this.column?.isArray;
  }

  get selectedOptions(): IReferenceOption[] {
    if (this.isMultiple && Array.isArray(this.value)) {
      return this.options.filter((opt) => this.value?.includes(opt.id + ''));
    } else if (!this.isMultiple && typeof this.value === 'string') {
      const match = this.options.find((opt) => opt.id === this.value);
      return match ? [match] : [];
    }
    return [];
  }

  get displayText(): string {
    if (this.isMultiple) {
      console.log(this.value);
      if (!Array.isArray(this.value)) {
        this.value = [];
        return 'Select items';
      }
      if (this.value.length === 0) return 'Select items';
      const count = this.selectedOptions.length;
      return `${count} item${count > 1 ? 's' : ''} selected`;
    } else {
      return (
        this.options.find((opt) => Number(opt.id) === Number(this.value))
          ?.name || 'Select item'
      );
    }
    // return this.value+''
  }

  openPicker() {
    this.isPickerOpen = true;
  }

  clear() {
    this.valueChange.emit(this.isMultiple ? [] : undefined);
  }

  handleSelection(newValue: string | string[]) {
    this.valueChange.emit(newValue);
    this.isPickerOpen = false;
  }
}
