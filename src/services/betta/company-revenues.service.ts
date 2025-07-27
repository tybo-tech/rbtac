import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICompanyRevenue } from '../../models/schema';
import { Constants } from '../service';


@Injectable({ providedIn: 'root' })
export class CompanyRevenueService {
  private apiUrl = `${Constants.ApiBase}/company_revenues`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ICompanyRevenue[]> {
    return this.http.get<ICompanyRevenue[]>(`${this.apiUrl}/list.php`);
  }

  getById(id: number): Observable<ICompanyRevenue> {
    return this.http.post<ICompanyRevenue>(`${this.apiUrl}/get.php`, { id });
  }

  add(item: ICompanyRevenue): Observable<ICompanyRevenue> {
    return this.http.post<ICompanyRevenue>(`${this.apiUrl}/add.php`, item);
  }

  update(item: ICompanyRevenue): Observable<ICompanyRevenue> {
    return this.http.put<ICompanyRevenue>(`${this.apiUrl}/update.php`, item);
  }

  save(item: ICompanyRevenue): Observable<ICompanyRevenue> {
    return item.id ? this.update(item) : this.add(item);
  }

  delete(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete.php`, { id });
  }
}
