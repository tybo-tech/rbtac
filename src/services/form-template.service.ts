// src/services/form-template.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IFormTemplate, ApiResponse, IFormAnalytics } from '../models/mentorship-form.interfaces';
import { Constants } from './service';

@Injectable({
  providedIn: 'root',
})
export class FormTemplateService {
  private apiUrl = `${Constants.ApiBase}/form-templates`;

  constructor(private http: HttpClient) {}

  // Get all form templates
  getFormTemplates(statusId: number = 1): Observable<ApiResponse<IFormTemplate[]>> {
    const params = new HttpParams().set('status_id', statusId.toString());
    const url = `${this.apiUrl}/list.php`;
    return this.http.get<ApiResponse<IFormTemplate[]>>(url, { params });
  }

  // Get a specific template by ID
  getFormTemplateById(id: number): Observable<ApiResponse<IFormTemplate>> {
    const url = `${this.apiUrl}/get.php?id=${id}`;
    return this.http.get<ApiResponse<IFormTemplate>>(url);
  }

  // Add a new form template
  addFormTemplate(template: IFormTemplate): Observable<ApiResponse<IFormTemplate>> {
    const url = `${this.apiUrl}/add.php`;
    return this.http.post<ApiResponse<IFormTemplate>>(url, template);
  }

  // Update an existing form template
  updateFormTemplate(template: IFormTemplate): Observable<ApiResponse<IFormTemplate>> {
    const url = `${this.apiUrl}/update.php`;
    return this.http.put<ApiResponse<IFormTemplate>>(url, template);
  }

  // Save helper (auto decides add/update)
  saveFormTemplate(template: IFormTemplate): Observable<ApiResponse<IFormTemplate>> {
    return template.id ? this.updateFormTemplate(template) : this.addFormTemplate(template);
  }

  // Delete a form template by ID
  deleteFormTemplate(id: number): Observable<ApiResponse<any>> {
    const url = `${this.apiUrl}/delete.php?id=${id}`;
    return this.http.delete<ApiResponse<any>>(url);
  }

  // Archive a form template (soft delete)
  archiveFormTemplate(id: number): Observable<ApiResponse<any>> {
    const url = `${this.apiUrl}/delete.php?id=${id}&archive=true`;
    return this.http.delete<ApiResponse<any>>(url);
  }

  // Get template analytics
  getTemplateAnalytics(templateId: number, type: string = 'overview'): Observable<ApiResponse<IFormAnalytics>> {
    const params = new HttpParams()
      .set('template_id', templateId.toString())
      .set('type', type);
    const url = `${this.apiUrl}/analytics.php`;
    return this.http.get<ApiResponse<IFormAnalytics>>(url, { params });
  }

  // Get template usage statistics
  getTemplateUsageStats(templateId: number): Observable<ApiResponse<any>> {
    const params = new HttpParams().set('template_id', templateId.toString());
    const url = `${this.apiUrl}/analytics.php`;
    return this.http.get<ApiResponse<any>>(url, { params });
  }

  // Clone a template
  cloneTemplate(templateId: number, newTitle: string): Observable<ApiResponse<IFormTemplate>> {
    const url = `${this.apiUrl}/clone.php`;
    const body = { template_id: templateId, title: newTitle };
    return this.http.post<ApiResponse<IFormTemplate>>(url, body);
  }
}
