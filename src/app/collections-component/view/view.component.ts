import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ICollection, IColumn } from '../../../models/ICollection';
import {
  IView,
  ViewType,
  ViewTypesArray,
} from '../../../models/IView';
import { ViewConfigComponent } from '../view-config/view-config.component';
import { ClickOutsideDirective } from '../../../directives/click.outside.directive';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [CommonModule, FormsModule, ViewConfigComponent, ClickOutsideDirective],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss',
})
export class ViewComponent implements OnInit {
  @Input({ required: true }) view!: IView;
  @Input({ required: true }) collection!: ICollection;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<IView>();

  viewTypes = ViewTypesArray;
  nameTouched = false;

  ngOnInit(): void {
    if (!this.view.name) {
      this.autoGenerateName();
    }
  }

  get reportableFields(): IColumn[] {
    return this.collection.columns.filter((col) =>
      ['select', 'multi-select', 'number', 'boolean', 'date'].includes(col.type)
    );
  }

  get visibleColumns(): IColumn[] {
    return this.collection.columns;
  }

  toggleColumn(colId: string) {
    const config = this.view.config as any;
    if (!config.columns) config.columns = [];
    if (config.columns.includes(colId)) {
      config.columns = config.columns.filter((id: string) => id !== colId);
    } else {
      config.columns.push(colId);
    }
  }

  isColumnSelected(colId: string): boolean {
    return (this.view.config as any)?.columns?.includes(colId);
  }

  onTypeChange() {
    if (!this.nameTouched) {
      this.autoGenerateName();
    }
  }

  autoGenerateName() {
    const label = this.viewTypes.find(t => t.value === this.view.type)?.label;
    this.view.name = label ? `${label} View` : 'Untitled View';
  }

  submit() {
    this.onSubmit.emit(this.view);
  }

  close() {
    this.onClose.emit();
  }
}
