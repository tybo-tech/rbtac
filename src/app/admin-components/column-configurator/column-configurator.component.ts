import { CollectionDataService } from './../../../services/collection.data.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ITableView, TableColumn } from '../../../models/TableColumn';
import { ICollectionData } from '../../../models/ICollection';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-column-configurator',
  standalone: true,
  templateUrl: './column-configurator.component.html',
  styleUrls: ['./column-configurator.component.scss'],
  imports: [FormsModule, CommonModule],
})
export class ColumnConfiguratorComponent {
  @Input({ required: true }) view!: ICollectionData<ITableView>; // Full view object
  @Output() save = new EventEmitter<ICollectionData<ITableView>>();
  @Output() close = new EventEmitter<void>();
  constructor(
    private collectionDataService: CollectionDataService<ITableView>
  ) {}
  toggleVisibility(col: TableColumn) {
    col.visible = !col.visible;
  }

  loading = false;

  onSave() {
    if (!this.view) return;

    this.loading = true;
    this.collectionDataService.updateData(this.view).subscribe({
      next: (updatedView) => {
        this.loading = false;
        this.save.emit(updatedView);
        this.close.emit();
      },
      error: (err) => {
        this.loading = false;
        console.error('Error saving column configuration:', err);
        alert(
          `Sorry, an error occurred while saving your changes.\n` +
            `Please refresh the page and try again.\n` +
            `If the problem persists, contact support.`
        );
      },
    });
  }

  onCancel() {
    this.close.emit();
  }
  newJoin: string = '';
  joinOptions: string[] = ['users', 'programs', 'revenues'];

  operatorOptions: string[] = ['=', '!=', '>', '<', '>=', '<=', 'contains'];

  addJoin() {
    if (!this.view.data.joins) this.view.data.joins = [];
    if (this.newJoin && !this.view?.data.joins?.includes(this.newJoin)) {
      this.view?.data.joins?.push(this.newJoin);
    }
    this.newJoin = '';
  }

  removeJoin(join: string) {
    if (this.view) {
      this.view.data.joins = this.view.data.joins?.filter((j) => j !== join);
    }
  }
  get visibleColumns(): TableColumn[] {
    return (
      this.view?.data.table_columns.filter((col) => col.visible !== false) || []
    );
  }
  addFilter() {
    if (!this.view.data.filters) this.view.data.filters = [];
    this.view?.data.filters?.push({ key: '', operator: '=', value: '' });
  }

  removeFilter(filter: any) {
    if (this.view) {
      this.view.data.filters = this.view.data.filters?.filter(
        (f) => f !== filter
      );
    }
  }
  // new column

  showAddColumnModal = false;
  newColumn : TableColumn= {
    key: '',
    label: '',
    class: '',
    visible: false,
    minWidth: '',
    type: 'text', // default type
  };

  openAddColumnModal() {
    this.newColumn = {
      key: '',
      label: '',
      class: '',
      visible: false,
      minWidth: '',
      type: 'text',
    };
    this.showAddColumnModal = true;
  }

  closeAddColumnModal() {
    this.showAddColumnModal = false;
  }

  addNewColumn() {
    if (!this.newColumn.key || !this.newColumn.label) {
      // Show validation error
      return;
    }

    const column = {
      ...this.newColumn,
      // Add any other default properties your columns need
    };

    this.view.data.table_columns.push(column);
    this.closeAddColumnModal();
  }
}
