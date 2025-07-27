import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICompanyReason } from '../../models/schema';
import { Constants } from '../service';


@Injectable({ providedIn: 'root' })
export class CompanyReasonService {
  private apiUrl = `${Constants.ApiBase}/company_reasons`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ICompanyReason[]> {
    return this.http.get<ICompanyReason[]>(`${this.apiUrl}/list.php`);
  }

  getById(id: number): Observable<ICompanyReason> {
    return this.http.post<ICompanyReason>(`${this.apiUrl}/get.php`, { id });
  }

  add(item: ICompanyReason): Observable<ICompanyReason> {
    return this.http.post<ICompanyReason>(`${this.apiUrl}/add.php`, item);
  }

  update(item: ICompanyReason): Observable<ICompanyReason> {
    return this.http.put<ICompanyReason>(`${this.apiUrl}/update.php`, item);
  }

  save(item: ICompanyReason): Observable<ICompanyReason> {
    return item.id ? this.update(item) : this.add(item);
  }

  delete(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete.php`, { id });
  }
}
