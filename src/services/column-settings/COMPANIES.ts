import { TableColumn } from "../../models/TableColumn";

export const COMPANIES_COLUMNS: TableColumn[] = [
  {
    key: 'name',
    label: 'Name',
    minWidth: '200px',
    truncate: true
  },
  {
    key: 'registration_no',
    label: 'Registration No',
    minWidth: '150px',
    class: 'font-mono'
  },
  {
    key: 'sector',
    label: 'Sector',
    type: 'badge',
    minWidth: '120px',
    maxWidth: '180px',
    cellClass: 'capitalize'
  },
  {
    key: 'city',
    label: 'City',
    minWidth: '120px',
    sortable: true
  },
  {
    key: '',
    label: 'Actions',
    type: 'actions',
    width: '120px',
    headerClass: 'text-right',
    cellClass: 'text-right'
  }
];
