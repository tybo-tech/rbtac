import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface TableToolbarChange {
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  filters?: { [key: string]: any };
}

@Component({
  selector: 'app-table-toolbar',
  templateUrl: './table-toolbar.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class TableToolbarComponent {
  @Input() showSearch = true;
  @Input() showAdd = false;
  @Input() sortOptions: string[] = [];
  @Input() filters: { key: string; label: string; options: string[] }[] = [];

  @Output() changed = new EventEmitter<TableToolbarChange>();
  @Output() add = new EventEmitter<void>();

  search = '';
  sortBy = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  activeFilters: { [key: string]: string } = {};

  emitChange() {
    this.changed.emit({
      search: this.search,
      sortBy: this.sortBy,
      sortDirection: this.sortDirection,
      filters: this.activeFilters,
    });
  }

  onAdd() {
    this.add.emit();
  }
}
