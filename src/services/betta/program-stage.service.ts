import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../service';
import { IProgramStage } from '../../models/schema';

@Injectable({ providedIn: 'root' })
export class ProgramStageService {
  private apiUrl = `${Constants.ApiBase}/program-stages`;

  constructor(private http: HttpClient) {
    console.log('ProgramStageService apiUrl:', this.apiUrl);
  }

  /**
   * Get all program stages or stages for a specific program
   */
  getAll(programId?: number): Observable<IProgramStage[]> {
    const url = programId
      ? `${this.apiUrl}/list.php?program_id=${programId}`
      : `${this.apiUrl}/list.php`;
    return this.http.get<IProgramStage[]>(url);
  }

  /**
   * Get stages for a specific program
   */
  getByProgramId(programId: number): Observable<IProgramStage[]> {
    return this.http.get<IProgramStage[]>(`${this.apiUrl}/list.php?program_id=${programId}`);
  }

  /**
   * Get a specific program stage by ID
   */
  getById(id: number): Observable<IProgramStage> {
    return this.http.get<IProgramStage>(`${this.apiUrl}/get.php?id=${id}`);
  }

  /**
   * Create a new program stage
   */
  create(stage: IProgramStage): Observable<IProgramStage> {
    return this.http.post<IProgramStage>(`${this.apiUrl}/save.php`, stage);
  }

  /**
   * Update an existing program stage
   */
  update(stage: IProgramStage): Observable<IProgramStage> {
    return this.http.put<IProgramStage>(`${this.apiUrl}/save.php`, stage);
  }

  /**
   * Save a program stage (create or update based on ID presence)
   */
  save(stage: IProgramStage): Observable<IProgramStage> {
    return stage.id
      ? this.update(stage)
      : this.create(stage);
  }

  /**
   * Delete a program stage
   */
  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/delete.php`, {
      body: { id }
    });
  }
}
