import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ICollection,
  ICollectionMetadata,
  IColumn,
} from '../models/ICollection';
import { Constants } from './service';

@Injectable({
  providedIn: 'root',
})
export class CollectionsService {
  private apiUrl = `${Constants.ApiBase}/collections`;

  constructor(private http: HttpClient) {}

  // Get all collections
  getCollections(websiteId: number): Observable<ICollection[]> {
    const url = `${this.apiUrl}/list.php?websiteId=${websiteId}`;
    return this.http.get<ICollection[]>(url);
  }

  // Get a collection by ID
  getCollectionById(id: number): Observable<ICollection> {
    const url = `${this.apiUrl}/get.php?id=${id}`;
    return this.http.get<ICollection>(url);
  }

  // Add a new collection
  addCollection(collection: ICollection): Observable<ICollection> {
    const url = `${this.apiUrl}/save.php`;
    return this.http.post<ICollection>(url, collection);
  }

  // Update a collection
  updateCollection(collection: ICollection): Observable<ICollection> {
    const url = `${this.apiUrl}/save.php`;
    return this.http.put<ICollection>(url, collection);
  }

  //
  saveChanges(collection: ICollection) {
    // collection.columns.forEach((col) => {
    //   // clean up ux fields
    //   if (col.showMenu) {
    //     delete col.showMenu;
    //   }
    // });
    this.updateCollection(collection).subscribe({
      next: (updatedCollection) => {
        console.log('Collection updated successfully:', updatedCollection);
      },
      error: (error) => {
        console.error('Error updating collection:', error);
      },
    });
  }

  // Delete a collection
  deleteCollection(id: number): Observable<any> {
    const url = `${this.apiUrl}/delete.php?id=${id}`;
    return this.http.delete(url);
  }

  initCollection(name: string, websiteId: number): ICollection {
    const collection: ICollection = {
      id: 0,
      websiteId,
      name,
      columns: [this.initDefaultColumn()],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: this.initCollectionMetadata(),
    };
    return collection;
  }

  initDefaultColumn(name = 'Name'): IColumn {
    return {
      id: this.generateUUID('col'),
      name,
      type: 'text',
      isArray: false,
      isPrimary: true,
      required: false,
    };
  }

  initCollectionMetadata(): ICollectionMetadata {
    return {
      icon: 'fa fa-database', // Default icon
      color: '#000000', // Default color
      fill: '#FFFFFF', // Default fill color
    };
  }

  generateUUID(prefix: string = 'col'): string {
    const uuid = crypto.randomUUID?.() ?? this.fallbackUUID();
    return `${prefix}_${uuid}`;
  }

  private fallbackUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
