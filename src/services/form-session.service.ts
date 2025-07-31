// src/services/form-session.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormSession, ApiResponse, IFormSearchFilters, ISyncStatus } from '../models/mentorship-form.interfaces';
import { Constants } from './service';

@Injectable({
  providedIn: 'root',
})
export class FormSessionService {
  private apiUrl = `${Constants.ApiBase}/form-sessions`;

  constructor(private http: HttpClient) {}

  // Get all form sessions with optional filtering
  getFormSessions(filters?: IFormSearchFilters): Observable<ApiResponse<FormSession[]>> {
    let params = new HttpParams();

    if (filters) {
      if (filters.template_id) params = params.set('template_id', filters.template_id.toString());
      if (filters.company_id) params = params.set('company_id', filters.company_id.toString());
      if (filters.user_id) params = params.set('user_id', filters.user_id.toString());
      if (filters.date_from) params = params.set('date_from', filters.date_from);
      if (filters.date_to) params = params.set('date_to', filters.date_to);
      if (filters.status) params = params.set('status', filters.status);
    }

    const url = `${this.apiUrl}/list.php`;
    return this.http.get<ApiResponse<FormSession[]>>(url, { params });
  }

  // Get sessions for a specific company
  getSessionsByCompany(companyId: number): Observable<ApiResponse<FormSession[]>> {
    const params = new HttpParams().set('company_id', companyId.toString());
    const url = `${this.apiUrl}/list.php`;
    return this.http.get<ApiResponse<FormSession[]>>(url, { params });
  }

  // Get a specific session by ID
  getFormSessionById(id: number, withTemplate: boolean = false): Observable<ApiResponse<FormSession>> {
    const params = new HttpParams().set('with_template', withTemplate.toString());
    const url = `${this.apiUrl}/get.php?id=${id}`;
    return this.http.get<ApiResponse<FormSession>>(url, { params });
  }

  // Add a new form session
  addFormSession(session: FormSession): Observable<ApiResponse<FormSession>> {
    const url = `${this.apiUrl}/add.php`;
    return this.http.post<ApiResponse<FormSession>>(url, session);
  }

  // Update an existing form session
  updateFormSession(session: FormSession): Observable<ApiResponse<FormSession>> {
    const url = `${this.apiUrl}/update.php`;
    return this.http.put<ApiResponse<FormSession>>(url, session);
  }

  // Save session with automatic sync (recommended method)
  saveSessionWithSync(session: FormSession): Observable<ApiResponse<FormSession>> {
    const url = `${this.apiUrl}/save-with-sync.php`;
    return this.http.post<ApiResponse<FormSession>>(url, session);
  }

  // Update session values with sync
  updateSessionValues(sessionId: number, values: any, syncAnswers: boolean = true, updatedBy?: number): Observable<ApiResponse<any>> {
    const url = `${this.apiUrl}/update-values.php`;
    const body = {
      id: sessionId,
      values: values,
      sync_answers: syncAnswers,
      updated_by: updatedBy
    };
    return this.http.put<ApiResponse<any>>(url, body);
  }

  // Save helper (auto decides add/update)
  saveFormSession(session: FormSession, autoSync: boolean = true): Observable<ApiResponse<FormSession>> {
    if (autoSync) {
      return this.saveSessionWithSync(session);
    }
    return session.id ? this.updateFormSession(session) : this.addFormSession(session);
  }

  // Delete a form session by ID
  deleteFormSession(id: number, withAnswers: boolean = true): Observable<ApiResponse<any>> {
    const params = new HttpParams().set('with_answers', withAnswers.toString());
    const url = `${this.apiUrl}/delete.php?id=${id}`;
    return this.http.delete<ApiResponse<any>>(url, { params });
  }

  // Get session sync status
  getSyncStatus(sessionId: number): Observable<ApiResponse<ISyncStatus>> {
    const url = `${Constants.ApiBase}/form-answers/sync-status.php?session_id=${sessionId}`;
    return this.http.get<ApiResponse<ISyncStatus>>(url);
  }

  // Manual resync session answers
  resyncSession(sessionId: number): Observable<ApiResponse<any>> {
    const url = `${Constants.ApiBase}/form-answers/resync.php`;
    const body = { session_id: sessionId };
    return this.http.post<ApiResponse<any>>(url, body);
  }

  // Auto-save functionality (draft save)
  autoSaveSession(session: FormSession): Observable<ApiResponse<FormSession>> {
    const url = `${this.apiUrl}/auto-save.php`;
    return this.http.post<ApiResponse<FormSession>>(url, session);
  }

  // Submit session (mark as completed)
  submitSession(sessionId: number): Observable<ApiResponse<FormSession>> {
    const url = `${this.apiUrl}/submit.php`;
    const body = { session_id: sessionId };
    return this.http.post<ApiResponse<FormSession>>(url, body);
  }
}
