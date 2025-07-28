import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  TableToolbarChange,
  TableToolbarComponent,
} from '../table-toolbar/table-toolbar.component';
import { ITableView, TableColumn } from '../../../models/TableColumn';
import { ICollectionData } from '../../../models/ICollection';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [CommonModule, TableToolbarComponent],
})
export class TableComponent implements OnChanges {
  @Input({ required: true }) table!: ICollectionData<ITableView>;
  @Input() data: any[] = [];
  @Input() loading: boolean = false;
  @Input() emptyMessage: string = 'No data available';

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() add = new EventEmitter<void>();
  @Output() sort = new EventEmitter<{ key: string; direction: 'asc' | 'desc' }>();
  @Output() filter = new EventEmitter<{ key: string; value: string }>();

  columns: TableColumn[] = [];

  get visibleColumns(): TableColumn[] {
    return this.columns.filter((col) => col.visible !== false);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['table'] && this.table?.data) {
      this.columns = this.table.data.table_columns || [];
    }
  }

  onEdit(row: any) {
    this.edit.emit(row);
  }

  onDelete(row: any) {
    this.delete.emit(row);
  }

  onAdd() {
    this.add.emit();
  }

  onTableChange(event: TableToolbarChange) {
    if (event.sort) {
      this.sort.emit(event.sort);
    }
    if (event.filter) {
      this.filter.emit(event.filter);
    }
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
