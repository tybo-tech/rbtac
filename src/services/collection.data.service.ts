import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ICollectionData,
  IReferenceOptionMap,
  IReferenceRequest,
} from '../models/ICollection';
import { Constants } from './service';

@Injectable({
  providedIn: 'root',
})
export class CollectionDataService<T = any> {
  private apiUrl = `${Constants.ApiBase}/collection-data`;

  constructor(private http: HttpClient) {}

  // Get all data entries for a specific collection
  getDataByCollectionId(
    collectionId: number
  ): Observable<ICollectionData<T>[]> {
    const url = `${this.apiUrl}/list.php?collectionId=${collectionId}`;
    return this.http.get<ICollectionData<T>[]>(url);
  }

  // Get a data entry by ID
  getDataById(id: number): Observable<ICollectionData<T>> {
    const url = `${this.apiUrl}/get.php?id=${id}`;
    return this.http.get<ICollectionData<T>>(url);
  }

  getReferenceOptions(requests: IReferenceRequest[]) {
    const url = `${this.apiUrl}/reference-options.php`;
    return this.http.post<IReferenceOptionMap>(url, requests);
  }

  // Add a new data entry
  addData(data: ICollectionData<T>): Observable<ICollectionData<T>> {
    const url = `${this.apiUrl}/save.php`;
    return this.http.post<ICollectionData<T>>(url, data);
  }

  // Update a data entry
  updateData(data: ICollectionData<T>): Observable<ICollectionData<T>> {
    const url = `${this.apiUrl}/save.php`;
    return this.http.put<ICollectionData<T>>(url, data);
  }

  //save-many.php
  saveMany(data: ICollectionData<T>[]): Observable<ICollectionData<T>[]> {
    const url = `${this.apiUrl}/save-many.php`;
    return this.http.post<ICollectionData<T>[]>(url, data);
  }

  // Delete a data entry by ID
  deleteData(id: number): Observable<any> {
    const url = `${this.apiUrl}/delete.php?id=${id}`;
    return this.http.delete(url);
  }

  // Delete all data entries for a specific collection
  deleteDataByCollectionId(collectionId: number): Observable<any> {
    const url = `${this.apiUrl}/delete.php?collection_id=${collectionId}`;
    return this.http.delete(url);
  }

  init(collection_id: number, data: any): ICollectionData<T> {
    return {
      id: 0,
      collection_id,
      data,
    };
  }
  deleteColumn(id: string, collectionData: ICollectionData[]) {
    collectionData.forEach((data) => {
      if (data.data && data.data[id]) {
        delete data.data[id];
        this.updateData(data).subscribe();
      }
    });
    this.saveMany(collectionData).subscribe({
      next: (response) => {
        console.log('Column deleted successfully from all rows', response);
      },
      error: (error) => {
        console.error('Error deleting column from rows', error);
      },
    });
  }
  // Get all rows with a specific parent_id
  getByParentId(parentId: string): Observable<ICollectionData<T>[]> {
    const url = `${
      this.apiUrl
    }/getByParentId.php?parent_id=${encodeURIComponent(parentId)}`;
    return this.http.get<ICollectionData<T>[]>(url);
  }

  // Get all rows for a collection (regardless of parent)
  getAllByCollection(collectionId: string): Observable<ICollectionData<T>[]> {
    const url = `${
      this.apiUrl
    }/getAllByCollection.php?collection_id=${encodeURIComponent(collectionId)}`;
    return this.http.get<ICollectionData<T>[]>(url);
  }

  // Get all rows matching collectionId and parentId
  getByCollectionAndParent(
    collectionId: string,
    parentId: string
  ): Observable<ICollectionData<T>[]> {
    const url = `${
      this.apiUrl
    }/getByCollectionAndParent.php?collection_id=${encodeURIComponent(
      collectionId
    )}&parent_id=${encodeURIComponent(parentId)}`;
    return this.http.get<ICollectionData<T>[]>(url);
  }
}
