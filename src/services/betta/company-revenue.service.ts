import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICompanyRevenue } from '../../models/schema';
import { Constants } from '../service';

@Injectable({ providedIn: 'root' })
export class CompanyRevenueService {
  private apiUrl = `${Constants.ApiBase}/company-revenues`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ICompanyRevenue[]> {
    return this.http.get<ICompanyRevenue[]>(`${this.apiUrl}/list.php`);
  }

  getById(id: number): Observable<ICompanyRevenue> {
    return this.http.get<ICompanyRevenue>(`${this.apiUrl}/get.php?id=${id}`);
  }

  getByCompanyId(companyId: number): Observable<ICompanyRevenue[]> {
    return this.http.get<ICompanyRevenue[]>(`${this.apiUrl}/list.php?company_id=${companyId}`);
  }

  getByYear(year: number): Observable<ICompanyRevenue[]> {
    return this.http.get<ICompanyRevenue[]>(`${this.apiUrl}/list.php?year=${year}`);
  }

  getByCompanyAndYear(companyId: number, year: number): Observable<ICompanyRevenue[]> {
    return this.http.get<ICompanyRevenue[]>(`${this.apiUrl}/list.php?company_id=${companyId}&year=${year}`);
  }

  add(item: ICompanyRevenue): Observable<ICompanyRevenue> {
    return this.http.post<ICompanyRevenue>(`${this.apiUrl}/save.php`, item);
  }

  update(item: ICompanyRevenue): Observable<ICompanyRevenue> {
    return this.http.post<ICompanyRevenue>(`${this.apiUrl}/save.php`, item);
  }

  save(item: ICompanyRevenue): Observable<ICompanyRevenue> {
    return this.http.post<ICompanyRevenue>(`${this.apiUrl}/save.php`, item);
  }

  delete(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete.php`, { id });
  }

  getRevenueSummary(companyId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/summary.php?company_id=${companyId}`);
  }

  getMonthlyTrend(companyId: number, year: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/trend.php?company_id=${companyId}&year=${year}`);
  }
}
