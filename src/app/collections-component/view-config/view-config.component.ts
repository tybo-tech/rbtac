import { Component, Input } from '@angular/core';
import { IColumn } from '../../../models/ICollection';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { IView } from '../../../models/IView';

@Component({
  selector: 'app-view-config',
  templateUrl: './view-config.component.html',
  imports: [FormsModule, NgIf, NgFor],
})
export class ViewConfigComponent {
  @Input({ required: true }) view!: IView;
  @Input({ required: true }) columns: IColumn[] = [];

  get visibleColumns(): IColumn[] {
    return this.columns;
  }

  get reportableFields(): IColumn[] {
    return this.columns.filter((col) =>
      ['select', 'multi-select', 'number', 'boolean', 'date'].includes(col.type)
    );
  }

  addFilter() {
    if (!this.view.config.filters) {
      this.view.config.filters = [];
    }
    this.view.config.filters.push({
      field: '',
      operator: '=',
      value: ''
    });
  }

  removeFilter(index: number) {
    this.view.config.filters?.splice(index, 1);
  }

  isReportView(): boolean {
    return this.view.type !== 'table';
  }
}
