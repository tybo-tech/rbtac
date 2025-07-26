import { Injectable } from '@angular/core';
import { ICollectionData, IColumn } from '../../models/ICollection';

@Injectable({
  providedIn: 'root',
})
export class CollectionUxService {
  column?: IColumn;

  isLoading = false;
  showAddCollectionModal = false;
  error: string = '';
  success: string = '';
  showColumnModal = false;
  showEditCollectionModal = false;
  constructor() {}
  showLoading() {
    this.isLoading = true;
  }
  hideLoading() {
    this.isLoading = false;
  }
  showError(message: string) {
    this.error = message;
  }
  hideError() {
    this.error = '';
  }
  showSuccess(msg: string) {
    this.success = msg;
  }
  hideSuccess() {
    this.success = '';
  }
  toggleAddCollectionModal() {
    this.showAddCollectionModal = !this.showAddCollectionModal;
  }
  toggleEditCollectionModal() {
    this.showEditCollectionModal = !this.showEditCollectionModal;
  }
  toggleAddColumnModal(column?: IColumn) {
    this.showColumnModal = !this.showColumnModal;
    if (this.showColumnModal) {
      // Reset column when opening the modal
      if (column) {
        this.column = column;
        return;
      }
      this.column = {
        id: '',
        name: '',
        type: 'text',
        isArray: false,
        isPrimary: false,
        required: false,
        options: [],
        referenceCollectionId: 0,
        relationship: {
          direction: 'one-to-one',
          reverseFieldName: '',
          createReverse: false,
        },
      };
    }
  }
  reset() {
    //reset modals
    this.showAddCollectionModal = false;
    this.showColumnModal = false;
    this.showEditCollectionModal = false;

    // reset loading and error states
    this.isLoading = false;
    this.error = '';
    this.success = '';

    // reset selected items
    this.column = undefined;
  }
  initRowData(columns: IColumn[], items: ICollectionData[]): any {
    const rowData: any = {};
    columns.forEach((col) => {
      if (col.isArray) {
        rowData[col.id] = [];
      } else {
        if (col.type === 'auto-sequence') {
          rowData[col.id] = this.generateAutoSequenceValue(items, col);
          return;
          return rowData;
        }
        rowData[col.id] = col.defaultValue || '';
      }
    });
    return rowData;
  }
  generateAutoSequenceValue(items: ICollectionData[], col: IColumn): string {
    const prefix = col.prefix || '';
    const existingValues = items.map((item) => item.data[col.id]);
    const maxValue = Math.max(
      ...existingValues.map((val) => {
        if (typeof val === 'number') return val;
        const num = parseInt(val.replace(prefix, ''), 10);
        return isNaN(num) ? 0 : num;
      }),
      0
    );
    return prefix + (maxValue + 1);
  }
}
