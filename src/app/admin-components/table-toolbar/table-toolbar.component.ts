import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColumnConfiguratorComponent } from "../column-configurator/column-configurator.component";
import { ICollectionData } from '../../../models/ICollection';
import { ITableView, TableColumn } from '../../../models/TableColumn';

export type TableViewType = 'table' | 'board' | 'calendar' | 'gallery' | 'form';
export type TableToolbarAction = 'filter' | 'sort' | 'search' | 'share';

export interface TableToolbarChange {
  view?: TableViewType;
  search?: string;
  sort?: { key: string; direction: 'asc' | 'desc' };
  filter?: { key: string; value: string };
}

@Component({
  selector: 'app-table-toolbar',
  templateUrl: './table-toolbar.component.html',
  styleUrls: ['./table-toolbar.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, ColumnConfiguratorComponent],
})
export class TableToolbarComponent {
  // Icons
  faTable = 'fa fa-table';
  faKanban = 'fa fa-columns';
  faCalendarAlt = 'fa fa-calendar-alt';
  faThLarge = 'fa fa-th-large';
  faListAlt = 'fa fa-list-alt';
  faPlus = 'fa fa-plus';
  faChevronDown = 'fa fa-chevron-down';
  faSearch = 'fa fa-search';
  faFilter = 'fa fa-filter';
  faSort = 'fa fa-sort';
  faSlidersH = 'fa fa-sliders-h';
  faTimes = 'fa fa-times';
  faColumns = 'fa fa-columns'; // For column configuration

  @Input({ required: true }) table!: ICollectionData<ITableView>;

  @Input() currentView: TableViewType = 'table';
  @Input() showSearch = true;
  @Input() sortOptions: string[] = [];
  @Input() filterOptions: { key: string; label: string }[] = [];

  @Output() viewChange = new EventEmitter<TableViewType>();
  @Output() action = new EventEmitter<TableToolbarAction>();
  @Output() changed = new EventEmitter<TableToolbarChange>();

  search = '';
  isSearchVisible = false;
  viewMenuOpen = false;
  showColumnConfigurator = false;

  readonly viewIcons: Record<TableViewType, string> = {
    table: this.faTable,
    board: this.faKanban,
    calendar: this.faCalendarAlt,
    gallery: this.faThLarge,
    form: this.faListAlt,
  };

  readonly viewLabels: Record<TableViewType, string> = {
    table: 'Table',
    board: 'Board',
    calendar: 'Calendar',
    gallery: 'Gallery',
    form: 'Form',
  };

  views = Object.keys(this.viewIcons) as TableViewType[];

  get columns(): TableColumn[] {
    return this.table?.data?.table_columns || [];
  }

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;
    if (!this.isSearchVisible) {
      this.search = '';
      this.changed.emit({ search: '' });
    }
  }

  onSearchChange() {
    this.changed.emit({ search: this.search });
  }

  changeView(view: TableViewType) {
    this.currentView = view;
    this.viewChange.emit(view);
    this.viewMenuOpen = false;
  }

  triggerAction(action: TableToolbarAction) {
    this.action.emit(action);
    this.showColumnConfigurator = !this.showColumnConfigurator
  }

  openColumnConfigurator() {
    this.showColumnConfigurator = true;
  }

  onColumnChange() {
    this.changed.emit({});
  }
}
