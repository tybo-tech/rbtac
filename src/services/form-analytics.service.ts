// src/services/form-analytics.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  IFormAnswer,
  ApiResponse,
  IFormAnalytics,
  IFieldStatistics,
  IDashboardWidget,
  IExportConfig
} from '../models/mentorship-form.interfaces';
import { Constants } from './service';

@Injectable({
  providedIn: 'root',
})
export class FormAnalyticsService {
  private apiUrl = `${Constants.ApiBase}/form-answers`;

  constructor(private http: HttpClient) {}

  // Get all answers for a specific session
  getSessionAnswers(sessionId: number): Observable<ApiResponse<IFormAnswer[]>> {
    const params = new HttpParams().set('session_id', sessionId.toString());
    const url = `${this.apiUrl}/list.php`;
    return this.http.get<ApiResponse<IFormAnswer[]>>(url, { params });
  }

  // Get field analytics for a specific template and field
  getFieldAnalytics(
    templateId: number,
    groupKey: string,
    fieldKey: string,
    type: string = 'frequency'
  ): Observable<ApiResponse<IFieldStatistics>> {
    const params = new HttpParams()
      .set('template_id', templateId.toString())
      .set('group_key', groupKey)
      .set('field_key', fieldKey)
      .set('type', type);

    const url = `${this.apiUrl}/analytics.php`;
    return this.http.get<ApiResponse<IFieldStatistics>>(url, { params });
  }

  // Get numeric statistics for number fields
  getNumericFieldStats(
    templateId: number,
    groupKey: string,
    fieldKey: string
  ): Observable<ApiResponse<any>> {
    const params = new HttpParams()
      .set('template_id', templateId.toString())
      .set('group_key', groupKey)
      .set('field_key', fieldKey)
      .set('type', 'stats');

    const url = `${this.apiUrl}/analytics.php`;
    return this.http.get<ApiResponse<any>>(url, { params });
  }

  // Get template-wide analytics
  getTemplateAnalytics(templateId: number, type: string = 'overview'): Observable<ApiResponse<IFormAnalytics>> {
    const params = new HttpParams()
      .set('template_id', templateId.toString())
      .set('type', type);

    const url = `${Constants.ApiBase}/form-templates/analytics.php`;
    return this.http.get<ApiResponse<IFormAnalytics>>(url, { params });
  }

  // Get dashboard widgets data
  getDashboardWidgets(templateId?: number): Observable<ApiResponse<IDashboardWidget[]>> {
    let params = new HttpParams();
    if (templateId) {
      params = params.set('template_id', templateId.toString());
    }

    const url = `${this.apiUrl}/dashboard.php`;
    return this.http.get<ApiResponse<IDashboardWidget[]>>(url, { params });
  }

  // Get completion rate for a template
  getCompletionRate(templateId: number, period: string = 'month'): Observable<ApiResponse<any>> {
    const params = new HttpParams()
      .set('template_id', templateId.toString())
      .set('period', period);

    const url = `${Constants.ApiBase}/form-templates/analytics.php`;
    return this.http.get<ApiResponse<any>>(url, { params });
  }

  // Get field response distribution
  getFieldDistribution(
    templateId: number,
    groupKey: string,
    fieldKey: string
  ): Observable<ApiResponse<{ [value: string]: number }>> {
    const params = new HttpParams()
      .set('template_id', templateId.toString())
      .set('group_key', groupKey)
      .set('field_key', fieldKey)
      .set('type', 'distribution');

    const url = `${this.apiUrl}/analytics.php`;
    return this.http.get<ApiResponse<{ [value: string]: number }>>(url, { params });
  }

  // Get answers by date range
  getAnswersByDateRange(
    templateId: number,
    dateFrom: string,
    dateTo: string
  ): Observable<ApiResponse<IFormAnswer[]>> {
    const params = new HttpParams()
      .set('template_id', templateId.toString())
      .set('date_from', dateFrom)
      .set('date_to', dateTo);

    const url = `${this.apiUrl}/list.php`;
    return this.http.get<ApiResponse<IFormAnswer[]>>(url, { params });
  }

  // Export data
  exportData(config: IExportConfig): Observable<ApiResponse<any>> {
    const url = `${this.apiUrl}/export.php`;
    return this.http.post<ApiResponse<any>>(url, config);
  }

  // Get real-time statistics
  getRealTimeStats(templateId: number): Observable<ApiResponse<any>> {
    const params = new HttpParams().set('template_id', templateId.toString());
    const url = `${this.apiUrl}/realtime.php`;
    return this.http.get<ApiResponse<any>>(url, { params });
  }

  // Trigger manual resync for all sessions of a template
  resyncTemplate(templateId: number): Observable<ApiResponse<any>> {
    const url = `${this.apiUrl}/resync.php`;
    const body = { template_id: templateId };
    return this.http.post<ApiResponse<any>>(url, body);
  }

  // Get sync statistics
  getSyncStatistics(templateId?: number): Observable<ApiResponse<any>> {
    let params = new HttpParams();
    if (templateId) {
      params = params.set('template_id', templateId.toString());
    }

    const url = `${this.apiUrl}/sync-stats.php`;
    return this.http.get<ApiResponse<any>>(url, { params });
  }
}
