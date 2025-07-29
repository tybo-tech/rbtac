import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from './service';
import { IApiResponse, IMentorshipTemplate, IMentorshipSession, IMentorshipTask, IMentorshipResponse } from '../models/mentorship';

@Injectable({
  providedIn: 'root'
})
export class MentorshipTemplateService {
  private apiUrl = `${Constants.ApiBase}/mentorship`;

  constructor(private http: HttpClient) {}

  // === TEMPLATE MANAGEMENT ===

  // Get all templates
  getTemplates(): Observable<IApiResponse<IMentorshipTemplate[]>> {
    return this.http.get<IApiResponse<IMentorshipTemplate[]>>(`${this.apiUrl}/templates.php`);
  }

  // Get template with full structure (categories and questions)
  getTemplate(id: number): Observable<IApiResponse<IMentorshipTemplate>> {
    return this.http.get<IApiResponse<IMentorshipTemplate>>(`${this.apiUrl}/templates.php?id=${id}`);
  }

  // Create new template with categories and questions
  createTemplate(template: IMentorshipTemplate): Observable<IApiResponse<IMentorshipTemplate>> {
    return this.http.post<IApiResponse<IMentorshipTemplate>>(`${this.apiUrl}/templates.php`, template);
  }

  // Update existing template
  updateTemplate(id: number, template: IMentorshipTemplate): Observable<IApiResponse<IMentorshipTemplate>> {
    return this.http.put<IApiResponse<IMentorshipTemplate>>(`${this.apiUrl}/templates.php?id=${id}`, template);
  }

  // Delete template
  deleteTemplate(id: number): Observable<IApiResponse<null>> {
    return this.http.delete<IApiResponse<null>>(`${this.apiUrl}/templates.php?id=${id}`);
  }

  // Seed baseline template
  seedBaselineTemplate(): Observable<IApiResponse<IMentorshipTemplate>> {
    return this.http.post<IApiResponse<IMentorshipTemplate>>(`${this.apiUrl}/templates.php?action=seed_baseline`, {});
  }

  // === SESSION MANAGEMENT ===

  // Get all sessions
  getSessions(): Observable<IApiResponse<IMentorshipSession[]>> {
    return this.http.get<IApiResponse<IMentorshipSession[]>>(`${this.apiUrl}/sessions.php`);
  }

  // Get sessions by company
  getSessionsByCompany(companyId: number): Observable<IApiResponse<IMentorshipSession[]>> {
    return this.http.get<IApiResponse<IMentorshipSession[]>>(`${this.apiUrl}/sessions.php?company_id=${companyId}`);
  }

  // Get session with responses
  getSessionWithResponses(sessionId: number): Observable<IApiResponse<IMentorshipSession>> {
    return this.http.get<IApiResponse<IMentorshipSession>>(`${this.apiUrl}/sessions.php?id=${sessionId}`);
  }

  // Create new session
  createSession(session: IMentorshipSession): Observable<IApiResponse<IMentorshipSession>> {
    return this.http.post<IApiResponse<IMentorshipSession>>(`${this.apiUrl}/sessions.php`, session);
  }

  // Save session responses
  saveSessionResponses(sessionId: number, responses: { [key: string]: any }): Observable<IApiResponse<null>> {
    return this.http.post<IApiResponse<null>>(`${this.apiUrl}/sessions.php?action=save_responses`, {
      session_id: sessionId,
      responses: responses
    });
  }

  // Update session
  updateSession(sessionId: number, session: Partial<IMentorshipSession>): Observable<IApiResponse<IMentorshipSession>> {
    return this.http.put<IApiResponse<IMentorshipSession>>(`${this.apiUrl}/sessions.php?id=${sessionId}`, session);
  }

  // === COMPANY SEARCH ===

  // Search companies by name
  searchCompanies(searchTerm: string): Observable<IApiResponse<any[]>> {
    return this.http.get<IApiResponse<any[]>>(`${Constants.ApiBase}/companies/list.php?search=${encodeURIComponent(searchTerm)}`);
  }

  // Get company details
  getCompany(companyId: number): Observable<IApiResponse<any>> {
    return this.http.get<IApiResponse<any>>(`${Constants.ApiBase}/companies/read.php?id=${companyId}`);
  }

  // === TASKS ===

  // Get tasks by session
  getTasksBySession(sessionId: number): Observable<IApiResponse<IMentorshipTask[]>> {
    return this.http.get<IApiResponse<IMentorshipTask[]>>(`${this.apiUrl}/tasks.php?session_id=${sessionId}`);
  }

  // Update task status
  updateTaskStatus(taskId: number, status: string): Observable<IApiResponse<IMentorshipTask>> {
    return this.http.put<IApiResponse<IMentorshipTask>>(`${this.apiUrl}/tasks.php?id=${taskId}`, { status });
  }

  // === RESPONSES ===

  // Save individual response
  saveResponse(response: IMentorshipResponse): Observable<IApiResponse<IMentorshipResponse>> {
    return this.http.post<IApiResponse<IMentorshipResponse>>(`${this.apiUrl}/responses.php`, response);
  }

  // Save multiple responses
  saveResponses(responses: IMentorshipResponse[]): Observable<IApiResponse<null>> {
    return this.http.post<IApiResponse<null>>(`${this.apiUrl}/responses.php?action=batch`, { responses });
  }

  // === ANALYTICS ===

  // Get mentorship statistics
  getStatistics(): Observable<IApiResponse<any>> {
    return this.http.get<IApiResponse<any>>(`${this.apiUrl}/analytics.php`);
  }

  // Get company progress report
  getCompanyProgress(companyId: number): Observable<IApiResponse<any>> {
    return this.http.get<IApiResponse<any>>(`${this.apiUrl}/analytics.php?company_id=${companyId}`);
  }
}
