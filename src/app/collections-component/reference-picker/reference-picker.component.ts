import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IColumn, IReferenceOption } from '../../../models/ICollection';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reference-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reference-picker.component.html',
})
export class ReferencePickerComponent {
  @Input() column!: IColumn;
  @Input() options: IReferenceOption[] = [];
  @Input() selected: string | string[] | undefined;

  @Output() confirm = new EventEmitter<string | string[]>();
  @Output() cancel = new EventEmitter<void>();

  tempSelection: string[] = [];

  ngOnInit(): void {
    if (this.column?.isArray) {
      this.tempSelection = Array.isArray(this.selected) ? [...this.selected] : [];
    } else {
      this.selected = this.selected+''
      this.tempSelection = typeof this.selected === 'string' ? [this.selected] : [];
    }
  }

  toggleOption(id: string | number): void {
    if (this.column?.isArray) {
      const index = this.tempSelection.indexOf(id+'');
      if (index >= 0) {
        this.tempSelection.splice(index, 1);
      } else {
        this.tempSelection.push(id+'');
      }
    } else {
      this.tempSelection = [id+''];
    }
  }

  isSelected(id: string | number): boolean {
    return this.tempSelection.includes(id+'');
  }

  submit(): void {
    const result = this.column?.isArray ? this.tempSelection : this.tempSelection[0];
    this.confirm.emit(result);
  }

  close(): void {
    this.cancel.emit();
  }
}
