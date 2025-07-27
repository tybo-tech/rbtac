import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICompanyProgram } from '../../models/schema';
import { Constants } from '../service';


@Injectable({ providedIn: 'root' })
export class CompanyProgramService {
  private apiUrl = `${Constants.ApiBase}/company_programs`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ICompanyProgram[]> {
    return this.http.get<ICompanyProgram[]>(`${this.apiUrl}/list.php`);
  }

  getById(id: number): Observable<ICompanyProgram> {
    return this.http.post<ICompanyProgram>(`${this.apiUrl}/get.php`, { id });
  }

  add(item: ICompanyProgram): Observable<ICompanyProgram> {
    return this.http.post<ICompanyProgram>(`${this.apiUrl}/add.php`, item);
  }

  update(item: ICompanyProgram): Observable<ICompanyProgram> {
    return this.http.put<ICompanyProgram>(`${this.apiUrl}/update.php`, item);
  }

  save(item: ICompanyProgram): Observable<ICompanyProgram> {
    return item.id ? this.update(item) : this.add(item);
  }

  delete(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete.php`, { id });
  }
}
