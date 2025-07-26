// src/app/services/view.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IView } from '../models/IView';
import { Constants } from './service';

@Injectable({
  providedIn: 'root',
})
export class ViewService {
  private apiUrl = `${Constants.ApiBase}/views`;

  constructor(private http: HttpClient) {}

  // Get all views for a given collection
  getViewsByCollectionId(collectionId: number): Observable<IView[]> {
    const url = `${this.apiUrl}/list.php?collectionId=${collectionId}`;
    return this.http.get<IView[]>(url);
  }

  // Get a specific view by ID
  getViewById(id: number): Observable<IView> {
    const url = `${this.apiUrl}/get.php?id=${id}`;
    return this.http.get<IView>(url);
  }

  // Add a new view
  addView(view: IView): Observable<IView> {
    const url = `${this.apiUrl}/save.php`;
    return this.http.post<IView>(url, view);
  }

  // Update an existing view
  updateView(view: IView): Observable<IView> {
    const url = `${this.apiUrl}/save.php`;
    return this.http.put<IView>(url, view);
  }

  // Save helper (auto decides add/update)
  saveView(view: IView): Observable<IView> {
    return view.id ? this.updateView(view as IView) : this.addView(view);
  }

  // Delete a view by ID
  deleteView(id: number): Observable<any> {
    const url = `${this.apiUrl}/delete.php?id=${id}`;
    return this.http.delete(url);
  }
}
