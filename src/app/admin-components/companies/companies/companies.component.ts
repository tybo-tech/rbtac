// src/app/admin/companies/companies.component.ts
import { Component } from '@angular/core';
import { ICompany } from '../../../../models/schema';
import { CompanyService } from '../../../../services/betta/companies.service';
import { TableComponent } from '../../table/table.component';
import { ColumnService } from '../../../../services/column.service';
import {
  ITableView,
  TableColumn,
  TableFilter,
} from '../../../../models/TableColumn';
import { ICollectionData } from '../../../../models/ICollection';
import { NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
  imports: [TableComponent, NgIf],
})
export class CompaniesComponent {
  list: ICompany[] = [];
  selected?: ICompany;
  showForm = false;
  columns: TableColumn[] = [];
  table?: ICollectionData<ITableView>;
  constructor(
    private companyService: CompanyService,
    private columnService: ColumnService,
    private route: ActivatedRoute
  ) {
    this.getAll();

    this.columnService.load('COMPANIES').subscribe((tbl) => {
      if (tbl.length) this.table = tbl[0];
    });
  }

  editCompany(row: any) {
    this.selected = row;
    this.showForm = true;
  }

  deleteCompany(row: any) {
    console.log('Delete', row);
  }

  addNewCompany() {
    this.selected = undefined;
    this.showForm = true;
  }

  getAll() {
    const programId = this.route.snapshot.queryParamMap.get('program_id');
    const filters: TableFilter[] = [];
    if (programId) {
      filters.push({ key: 'program_id', operator: '=', value: programId });
    }
    this.companyService.getWithFilters(filters).subscribe({
      next: (data) => (this.list = data),
      error: (err) => console.error('Error fetching companies:', err),
    });
  }

  addNew() {
    this.selected = undefined;
    this.showForm = true;
  }

  edit(company: ICompany) {
    this.selected = company;
    this.showForm = true;
  }

  closeForm(refresh = false) {
    this.showForm = false;
    if (refresh) this.getAll();
  }
}
