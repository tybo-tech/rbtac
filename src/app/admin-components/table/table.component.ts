import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableToolbarChange, TableToolbarComponent } from "../table-toolbar/table-toolbar.component";

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'badge' | 'number' | 'icon' | 'actions';
  class?: string;
  render?: (row: any) => string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [CommonModule, TableToolbarComponent]
})
export class TableComponent {
sectorOptions: string[] = ['name'];
cityOptions: string[] = ['', 'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
onTableChange($event: TableToolbarChange) {
throw new Error('Method not implemented.');
}
 @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() add = new EventEmitter<void>();
  @Output() changed = new EventEmitter<any>(); // For filters/sort later

  onEdit(row: any) {
    this.edit.emit(row);
  }

  onDelete(row: any) {
    this.delete.emit(row);
  }

  onAdd() {
    this.add.emit();
  }

}
