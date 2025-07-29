import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  IMentorshipTemplate,
  IMentorshipCategory,
  IMentorshipQuestion,
  IMentorshipSession,
  IMentorshipResponse,
  IMentorshipTask,
  IMentorshipStatistics,
  IApiResponse
} from '../models/mentorship';

@Injectable({
  providedIn: 'root'
})
export class MentorshipService {
  private baseUrl = 'http://localhost/rbtac-server/api/mentorship';

  constructor(private http: HttpClient) {}

  // ===========================================
  // TEMPLATE METHODS
  // ===========================================

  getTemplates(): Observable<IApiResponse<IMentorshipTemplate[]>> {
    return this.http.get<IApiResponse<IMentorshipTemplate[]>>(`${this.baseUrl}/templates/read.php`);
  }

  getTemplate(id: number, withDetails = false): Observable<IApiResponse<IMentorshipTemplate>> {
    let params = new HttpParams().set('id', id.toString());
    if (withDetails) {
      params = params.set('details', 'true');
    }
    return this.http.get<IApiResponse<IMentorshipTemplate>>(`${this.baseUrl}/templates/read.php`, { params });
  }

  createTemplate(template: Partial<IMentorshipTemplate>): Observable<IApiResponse<IMentorshipTemplate>> {
    return this.http.post<IApiResponse<IMentorshipTemplate>>(`${this.baseUrl}/templates/create.php`, template);
  }

  updateTemplate(id: number, template: Partial<IMentorshipTemplate>): Observable<IApiResponse<IMentorshipTemplate>> {
    return this.http.put<IApiResponse<IMentorshipTemplate>>(`${this.baseUrl}/templates/update.php?id=${id}`, template);
  }

  searchTemplates(searchTerm: string): Observable<IApiResponse<IMentorshipTemplate[]>> {
    const params = new HttpParams().set('search', searchTerm);
    return this.http.get<IApiResponse<IMentorshipTemplate[]>>(`${this.baseUrl}/templates/read.php`, { params });
  }

  getTemplatesByCategory(category: string): Observable<IApiResponse<IMentorshipTemplate[]>> {
    const params = new HttpParams().set('category', category);
    return this.http.get<IApiResponse<IMentorshipTemplate[]>>(`${this.baseUrl}/templates/read.php`, { params });
  }

  // ===========================================
  // CATEGORY METHODS
  // ===========================================

  getCategories(templateId: number, hierarchical = false): Observable<IApiResponse<IMentorshipCategory[]>> {
    let params = new HttpParams().set('template_id', templateId.toString());
    if (hierarchical) {
      params = params.set('hierarchical', 'true');
    }
    return this.http.get<IApiResponse<IMentorshipCategory[]>>(`${this.baseUrl}/categories/read.php`, { params });
  }

  getCategory(id: number): Observable<IApiResponse<IMentorshipCategory>> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<IApiResponse<IMentorshipCategory>>(`${this.baseUrl}/categories/read.php`, { params });
  }

  createCategory(category: Partial<IMentorshipCategory>): Observable<IApiResponse<IMentorshipCategory>> {
    return this.http.post<IApiResponse<IMentorshipCategory>>(`${this.baseUrl}/categories/create.php`, category);
  }

  updateCategory(id: number, category: Partial<IMentorshipCategory>): Observable<IApiResponse<IMentorshipCategory>> {
    return this.http.put<IApiResponse<IMentorshipCategory>>(`${this.baseUrl}/categories/update.php?id=${id}`, category);
  }

  reorderCategories(templateId: number, orderData: {id: number, sort_order: number}[]): Observable<IApiResponse<any>> {
    return this.http.post<IApiResponse<any>>(`${this.baseUrl}/categories/reorder.php?template_id=${templateId}`, orderData);
  }

  // ===========================================
  // QUESTION METHODS
  // ===========================================

  getQuestions(templateId: number): Observable<IApiResponse<IMentorshipQuestion[]>> {
    const params = new HttpParams().set('template_id', templateId.toString());
    return this.http.get<IApiResponse<IMentorshipQuestion[]>>(`${this.baseUrl}/questions/read.php`, { params });
  }

  getQuestionsByCategory(categoryId: number): Observable<IApiResponse<IMentorshipQuestion[]>> {
    const params = new HttpParams().set('category_id', categoryId.toString());
    return this.http.get<IApiResponse<IMentorshipQuestion[]>>(`${this.baseUrl}/questions/read.php`, { params });
  }

  getQuestion(id: number): Observable<IApiResponse<IMentorshipQuestion>> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<IApiResponse<IMentorshipQuestion>>(`${this.baseUrl}/questions/read.php`, { params });
  }

  createQuestion(question: Partial<IMentorshipQuestion>): Observable<IApiResponse<IMentorshipQuestion>> {
    return this.http.post<IApiResponse<IMentorshipQuestion>>(`${this.baseUrl}/questions/create.php`, question);
  }

  updateQuestion(id: number, question: Partial<IMentorshipQuestion>): Observable<IApiResponse<IMentorshipQuestion>> {
    return this.http.put<IApiResponse<IMentorshipQuestion>>(`${this.baseUrl}/questions/update.php?id=${id}`, question);
  }

  reorderQuestions(templateId: number, orderData: {id: number, sort_order: number}[]): Observable<IApiResponse<any>> {
    return this.http.post<IApiResponse<any>>(`${this.baseUrl}/questions/reorder.php?template_id=${templateId}`, orderData);
  }

  // ===========================================
  // SESSION METHODS
  // ===========================================

  getSessions(): Observable<IApiResponse<IMentorshipSession[]>> {
    return this.http.get<IApiResponse<IMentorshipSession[]>>(`${this.baseUrl}/sessions/read.php`);
  }

  getSession(id: number, withDetails = false): Observable<IApiResponse<IMentorshipSession>> {
    let params = new HttpParams().set('id', id.toString());
    if (withDetails) {
      params = params.set('details', 'true');
    }
    return this.http.get<IApiResponse<IMentorshipSession>>(`${this.baseUrl}/sessions/read.php`, { params });
  }

  getSessionsByCompany(companyId: number): Observable<IApiResponse<IMentorshipSession[]>> {
    const params = new HttpParams().set('company_id', companyId.toString());
    return this.http.get<IApiResponse<IMentorshipSession[]>>(`${this.baseUrl}/sessions/read.php`, { params });
  }

  getSessionsByTemplate(templateId: number): Observable<IApiResponse<IMentorshipSession[]>> {
    const params = new HttpParams().set('template_id', templateId.toString());
    return this.http.get<IApiResponse<IMentorshipSession[]>>(`${this.baseUrl}/sessions/read.php`, { params });
  }

  getRecentSessions(limit = 10): Observable<IApiResponse<IMentorshipSession[]>> {
    const params = new HttpParams().set('recent', '').set('limit', limit.toString());
    return this.http.get<IApiResponse<IMentorshipSession[]>>(`${this.baseUrl}/sessions/read.php`, { params });
  }

  createSession(session: Partial<IMentorshipSession>): Observable<IApiResponse<IMentorshipSession>> {
    return this.http.post<IApiResponse<IMentorshipSession>>(`${this.baseUrl}/sessions/create.php`, session);
  }

  updateSession(id: number, session: Partial<IMentorshipSession>): Observable<IApiResponse<IMentorshipSession>> {
    return this.http.put<IApiResponse<IMentorshipSession>>(`${this.baseUrl}/sessions/update.php?id=${id}`, session);
  }

  getSessionStatistics(companyId?: number, templateId?: number): Observable<IApiResponse<IMentorshipStatistics>> {
    let params = new HttpParams().set('statistics', '');
    if (companyId) params = params.set('company_id', companyId.toString());
    if (templateId) params = params.set('template_id', templateId.toString());
    return this.http.get<IApiResponse<IMentorshipStatistics>>(`${this.baseUrl}/sessions/read.php`, { params });
  }

  // ===========================================
  // RESPONSE METHODS
  // ===========================================

  getResponsesBySession(sessionId: number): Observable<IApiResponse<IMentorshipResponse[]>> {
    const params = new HttpParams().set('session_id', sessionId.toString());
    return this.http.get<IApiResponse<IMentorshipResponse[]>>(`${this.baseUrl}/responses/read.php`, { params });
  }

  getResponse(id: number): Observable<IApiResponse<IMentorshipResponse>> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<IApiResponse<IMentorshipResponse>>(`${this.baseUrl}/responses/read.php`, { params });
  }

  upsertResponse(response: Partial<IMentorshipResponse>): Observable<IApiResponse<IMentorshipResponse>> {
    return this.http.post<IApiResponse<IMentorshipResponse>>(`${this.baseUrl}/responses/upsert.php`, response);
  }

  saveMultipleResponses(sessionId: number, responses: Partial<IMentorshipResponse>[]): Observable<IApiResponse<any>> {
    return this.http.post<IApiResponse<any>>(`${this.baseUrl}/responses/save-multiple.php?session_id=${sessionId}`, responses);
  }

  getResponseStatistics(sessionId?: number, questionId?: number): Observable<IApiResponse<IMentorshipStatistics>> {
    let params = new HttpParams().set('statistics', '');
    if (sessionId) params = params.set('session_id', sessionId.toString());
    if (questionId) params = params.set('question_id', questionId.toString());
    return this.http.get<IApiResponse<IMentorshipStatistics>>(`${this.baseUrl}/responses/read.php`, { params });
  }

  // ===========================================
  // TASK METHODS
  // ===========================================

  getTasks(): Observable<IApiResponse<IMentorshipTask[]>> {
    return this.http.get<IApiResponse<IMentorshipTask[]>>(`${this.baseUrl}/tasks/read.php`);
  }

  getTask(id: number): Observable<IApiResponse<IMentorshipTask>> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<IApiResponse<IMentorshipTask>>(`${this.baseUrl}/tasks/read.php`, { params });
  }

  getTasksBySession(sessionId: number): Observable<IApiResponse<IMentorshipTask[]>> {
    const params = new HttpParams().set('session_id', sessionId.toString());
    return this.http.get<IApiResponse<IMentorshipTask[]>>(`${this.baseUrl}/tasks/read.php`, { params });
  }

  getTasksByCompany(companyId: number): Observable<IApiResponse<IMentorshipTask[]>> {
    const params = new HttpParams().set('company_id', companyId.toString());
    return this.http.get<IApiResponse<IMentorshipTask[]>>(`${this.baseUrl}/tasks/read.php`, { params });
  }

  getTasksByStatus(status: 'pending' | 'in_progress' | 'done'): Observable<IApiResponse<IMentorshipTask[]>> {
    const params = new HttpParams().set('status', status);
    return this.http.get<IApiResponse<IMentorshipTask[]>>(`${this.baseUrl}/tasks/read.php`, { params });
  }

  getTasksAssignedToUser(userId: number): Observable<IApiResponse<IMentorshipTask[]>> {
    const params = new HttpParams().set('assigned_to', userId.toString());
    return this.http.get<IApiResponse<IMentorshipTask[]>>(`${this.baseUrl}/tasks/read.php`, { params });
  }

  getOverdueTasks(): Observable<IApiResponse<IMentorshipTask[]>> {
    const params = new HttpParams().set('overdue', '');
    return this.http.get<IApiResponse<IMentorshipTask[]>>(`${this.baseUrl}/tasks/read.php`, { params });
  }

  createTask(task: Partial<IMentorshipTask>): Observable<IApiResponse<IMentorshipTask>> {
    return this.http.post<IApiResponse<IMentorshipTask>>(`${this.baseUrl}/tasks/create.php`, task);
  }

  updateTask(id: number, task: Partial<IMentorshipTask>): Observable<IApiResponse<IMentorshipTask>> {
    return this.http.put<IApiResponse<IMentorshipTask>>(`${this.baseUrl}/tasks/update.php?id=${id}`, task);
  }

  updateTaskStatus(id: number, status: 'pending' | 'in_progress' | 'done'): Observable<IApiResponse<IMentorshipTask>> {
    return this.http.put<IApiResponse<IMentorshipTask>>(`${this.baseUrl}/tasks/update-status.php?id=${id}`, { status });
  }

  createTaskFromTrigger(sessionId: number, questionId: number, companyId: number, responseData?: string): Observable<IApiResponse<IMentorshipTask>> {
    const data = {
      session_id: sessionId,
      question_id: questionId,
      company_id: companyId,
      response_data: responseData
    };
    return this.http.post<IApiResponse<IMentorshipTask>>(`${this.baseUrl}/tasks/create-from-trigger.php`, data);
  }

  getTaskStatistics(companyId?: number, userId?: number): Observable<IApiResponse<IMentorshipStatistics>> {
    let params = new HttpParams().set('statistics', '');
    if (companyId) params = params.set('company_id', companyId.toString());
    if (userId) params = params.set('user_id', userId.toString());
    return this.http.get<IApiResponse<IMentorshipStatistics>>(`${this.baseUrl}/tasks/read.php`, { params });
  }
}
