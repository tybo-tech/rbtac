import { Component, OnInit } from '@angular/core';
import { CollectionMenuComponent } from '../collection-menu/collection-menu.component';
import { CollectionTabsComponent } from '../collection-tabs/collection-tabs.component';
import { CollectionDataSetionComponent } from '../collection-data-setion/collection-data-setion.component';
import { CollectionsService } from '../../../services/collections.service';
import { LoginService } from '../../../services/LoginService ';
import { Users } from '../../../models/User';
import {
  ICollection,
  ICollectionData,
  IColumn,
  IReferenceOptionMap,
  IReferenceRequest,
} from '../../../models/ICollection';
import { NgIf } from '@angular/common';
import { CollectionDataService } from '../../../services/collection.data.service';
import { CollectionCreateComponent } from '../collection-create/collection-create.component';
import { CollectionFiltersComponent } from '../collection-filters/collection-filters.component';
import { CollectionUxService } from '../collection-ux.service';
import { CollectionColumnComponent } from '../collection-column/collection-column.component';
import { EditCollectionComponent } from '../edit-collection/edit-collection.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-collection-canvas',
  imports: [
    NgIf,
    CollectionMenuComponent,
    CollectionTabsComponent,
    CollectionDataSetionComponent,
    CollectionCreateComponent,
    CollectionFiltersComponent,
    CollectionColumnComponent,
    EditCollectionComponent,
  ],
  templateUrl: './collection-canvas.component.html',
  styleUrl: './collection-canvas.component.scss',
})
export class CollectionCanvasComponent implements OnInit {
  deleteRow($event: ICollectionData) {
    if (!confirm('Are you sure you want to delete this row?')) return;
    this.collectionDataService.deleteData($event.id).subscribe((data) => {
      this.loadCollectionData();
    });
  }
  user?: Users;

  collections: ICollection[] = [];
  collection?: ICollection; // Selected collection
  collectionData: ICollectionData[] = [];
  showEditCollectionModal = false;
  collectionId = 0; // Used to track the current collection ID for editing
  viewId = 0; // Used to track the current view ID for editing
  referenceOptionsMap: IReferenceOptionMap = {};

  constructor(
    private collectionsService: CollectionsService,
    private collectionDataService: CollectionDataService,
    public ux: CollectionUxService,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe((params) => {
      this.user = this.loginService.userValue;
      this.collectionId = params['collectionId'];
      this.viewId = params['viewId'] || 0; // Default to 0 if not provided
      this.loadCollections();
    });
  }

  ngOnInit(): void {}

  loadCollections() {
    this.ux.showLoading();
    const websiteId = Number(this.user?.website_id || '1');

    this.collectionsService.getCollections(websiteId).subscribe({
      next: (collections) => {
        this.collections = collections;
        if (collections.length > 0) {
          this.collection =
            collections.find((c) => c.id === Number(this.collectionId)) ||
            collections[0]; // Find by ID or default to first collection
          this.loadCollectionData(); // Load data for the selected collection
          this.ux.reset(); // Reset the UX state
        } else {
          this.ux.hideLoading();
          this.ux.showError(
            'No collections found. Please create a new collection.'
          );
        }
      },
      error: (error) => {
        this.ux.showError('Failed to load collections: ' + error.message);
      },
    });
  }

  loadCollectionData(): void {
    if (!this.collection) return;
    // this.ux.showLoading();
    this.collectionDataService
      .getDataByCollectionId(this.collection.id)
      .subscribe({
        next: (data: ICollectionData[]) => {
          this.collectionData = data;
          this.ux.hideLoading();
          this.fetchReferenceDropdowns(); // Fetch reference options after loading data
        },
        error: (error: any) => {
          this.ux.showError('Failed to load collection data: ' + error.message);
          this.ux.hideLoading();
          console.error('Error loading collection data:', error);
        },
      });
  }


  fetchReferenceDropdowns() {
  if (!this.collection?.columns) return;

  const references: IReferenceRequest[] = this.collection.columns
    .filter(col => col.type === 'reference' && col.referenceCollectionId)
    .map(col => ({
      column_id: col.id,
      referenceCollectionId: col.referenceCollectionId!,
    }));

  if (references.length === 0) return;

  this.collectionDataService.getReferenceOptions(references).subscribe({
    next: (map) => {
      this.referenceOptionsMap = map;
    },
    error: (err) => {
      console.error('Failed to fetch reference dropdowns', err);
    },
  });
}

  switchCollection($event: ICollection) {
    // this.collection = $event;
    // this.loadCollectionData();
    // this.ux.reset();
    this.router.navigate([
      '/admin/collections',
      $event.id,
      this.viewId ? this.viewId : '',
    ]);
  }

  onCollectionCreated($event: any) {
    this.ux.toggleAddCollectionModal();
    const collection = this.collectionsService.initCollection(
      $event.name,
      Number(this.user?.website_id || '1')
    );
    this.collectionsService.addCollection(collection).subscribe({
      next: (res) => {
        if (res && res.id) {
          this.collections.push(res);
          this.collection = res;
        }
      },
      error: (error) => {
        this.ux.showError('Failed to add collection: ' + error.message);
      },
    });
  }
  onColumnCreated(columnEvent: IColumn) {
    if (!this.collection) {
      this.ux.showError('No collection selected to add column.');
      return;
    }
    if (!this.collection.columns) {
      this.collection.columns = [];
    }
    if (!columnEvent.id) {
      columnEvent.id = this.collectionsService.generateUUID('col');
      this.collection.columns.push(columnEvent);
    }
    this.ux.toggleAddColumnModal();
    this.collectionsService.saveChanges(this.collection);
  }
  saveChanges() {
    this.collection && this.collectionsService.saveChanges(this.collection);
  }
  addNewRow() {
    if (!this.collection) {
      this.ux.showError('No collection selected to add column.');
      return;
    }
    if (!this.collection.columns) {
      this.collection.columns = [];
    }
    const newRow: ICollectionData = {
      collection_id: this.collection.id,
      data: this.ux.initRowData(this.collection.columns, this.collectionData),
      id: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.collectionDataService.addData(newRow).subscribe({
      next: (res) => {
        if (res && res.id) {
          this.collectionData.push(res);
          this.ux.showSuccess('New row added successfully.');
        }
      },
      error: (error) => {
        this.ux.showError('Failed to add new row: ' + error.message);
        // Remove the row from local state if it fails
        this.collectionData.pop();
      },
    });
  }

  onColumnDataUpdate($event: ICollectionData) {
    this.collectionDataService.updateData($event).subscribe({
      next: (updatedData) => {
        // this.loadCollectionData(); // Reload data to reflect changes
      },
      error: (error) => {
        this.ux.showError('Failed to update row data: ' + error.message);
      },
    });
  }
  deleteColumn(col: IColumn) {
    if (!this.collection) return;
    this.collection.columns = this.collection.columns.filter(
      (c) => c.id !== col.id
    );
    this.saveChanges();

    // Clean up any data associated with the column
    this.collectionDataService.deleteColumn(col.id, this.collectionData);
  }
  moveColumnLeft(col: IColumn): void {
    if (!this.collection) return;

    const index = this.collection.columns.findIndex((c) => c.id === col.id);
    if (index > 0) {
      [this.collection.columns[index - 1], this.collection.columns[index]] = [
        this.collection.columns[index],
        this.collection.columns[index - 1],
      ];
      this.saveChanges();
    }
  }

  moveColumnRight(col: IColumn): void {
    if (!this.collection) return;

    const index = this.collection.columns.findIndex((c) => c.id === col.id);
    if (index >= 0 && index < this.collection.columns.length - 1) {
      [this.collection.columns[index], this.collection.columns[index + 1]] = [
        this.collection.columns[index + 1],
        this.collection.columns[index],
      ];
      this.saveChanges();
    }
  }
}
