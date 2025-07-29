import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../service';
import { ICompanyProgramStage, IStageTransition, IStageStatistics, ICompanyStageView } from '../../models/schema';

@Injectable({ providedIn: 'root' })
export class CompanyProgramStageService {
  private apiUrl = `${Constants.ApiBase}/company-program-stages`;

  constructor(private http: HttpClient) {
    console.log('CompanyProgramStageService apiUrl:', this.apiUrl);
  }

  /**
   * Get all company program stages or filter by company/program
   */
  getAll(filters?: {
    company_id?: number;
    program_id?: number;
    current_only?: boolean
  }): Observable<ICompanyProgramStage[] | ICompanyProgramStage> {
    let url = `${this.apiUrl}/list.php`;
    const params = new URLSearchParams();

    if (filters?.company_id) params.append('company_id', filters.company_id.toString());
    if (filters?.program_id) params.append('program_id', filters.program_id.toString());
    if (filters?.current_only) params.append('current_only', 'true');

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return this.http.get<ICompanyProgramStage[] | ICompanyProgramStage>(url);
  }

  /**
   * Get stages for a specific company in a program
   */
  getByCompanyAndProgram(companyId: number, programId: number): Observable<ICompanyProgramStage[]> {
    return this.http.get<ICompanyProgramStage[]>(
      `${this.apiUrl}/list.php?company_id=${companyId}&program_id=${programId}`
    );
  }

  /**
   * Get current stage for a company in a program
   */
  getCurrentStage(companyId: number, programId: number): Observable<ICompanyProgramStage> {
    return this.http.get<ICompanyProgramStage>(
      `${this.apiUrl}/list.php?company_id=${companyId}&program_id=${programId}&current_only=true`
    );
  }

  /**
   * Get all companies in a program with their current stages
   */
  getCompaniesByProgram(programId: number): Observable<ICompanyStageView[]> {
    return this.http.get<ICompanyStageView[]>(
      `${this.apiUrl}/list.php?program_id=${programId}`
    );
  }

  /**
   * Get a specific company program stage by ID
   */
  getById(id: number): Observable<ICompanyProgramStage> {
    return this.http.get<ICompanyProgramStage>(`${this.apiUrl}/get.php?id=${id}`);
  }

  /**
   * Advance company to next stage
   */
  advanceToNextStage(companyId: number, programId: number, userId?: number): Observable<ICompanyProgramStage> {
    const transition: IStageTransition = {
      action: 'advance',
      company_id: companyId,
      program_id: programId,
      user_id: userId
    };
    return this.http.post<ICompanyProgramStage>(`${this.apiUrl}/save.php`, transition);
  }

  /**
   * Move company to a specific stage
   */
  moveToStage(
    companyId: number,
    programId: number,
    targetStageId: number,
    userId?: number
  ): Observable<ICompanyProgramStage> {
    const transition: IStageTransition = {
      action: 'move_to',
      company_id: companyId,
      program_id: programId,
      target_stage_id: targetStageId,
      user_id: userId
    };
    return this.http.post<ICompanyProgramStage>(`${this.apiUrl}/save.php`, transition);
  }

  /**
   * Create a new stage record for a company
   */
  createStageRecord(
    companyId: number,
    programId: number,
    programStageId: number,
    userId?: number
  ): Observable<ICompanyProgramStage> {
    const transition: IStageTransition = {
      action: 'create',
      company_id: companyId,
      program_id: programId,
      program_stage_id: programStageId,
      user_id: userId
    };
    return this.http.post<ICompanyProgramStage>(`${this.apiUrl}/save.php`, transition);
  }

  /**
   * Get stage statistics for a program
   */
  getStageStatistics(programId: number): Observable<IStageStatistics[]> {
    return this.http.get<IStageStatistics[]>(`${this.apiUrl}/statistics.php?program_id=${programId}`);
  }

  /**
   * Delete a company program stage record
   */
  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/delete.php`, {
      body: { id }
    });
  }
}
