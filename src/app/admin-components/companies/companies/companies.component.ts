// src/app/admin/companies/companies.component.ts
import { Component } from '@angular/core';
import { ICompany } from '../../../../models/schema';
import { CompanyService } from '../../../../services/betta/companies.service';
import { TableColumn, TableComponent } from '../../table/table.component';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
  imports: [TableComponent],
})
export class CompaniesComponent {
  list: ICompany[] = [];
  selected?: ICompany;
  showForm = false;
  columns: TableColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'city', label: 'City' },
    { key: 'sector', label: 'Sector', type: 'badge' },
    { key: 'no_perm_employees', label: 'Employees', type: 'number' },
    { key: '', label: 'Actions', type: 'actions' },
  ];
  constructor(private companyService: CompanyService) {
    this.getAll();
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
    this.companyService.getAll().subscribe({
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
