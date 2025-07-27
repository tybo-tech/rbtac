import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICompanyOrder } from '../../models/schema';
import { Constants } from '../service';


@Injectable({ providedIn: 'root' })
export class CompanyOrderService {
  private apiUrl = `${Constants.ApiBase}/company_orders`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ICompanyOrder[]> {
    return this.http.get<ICompanyOrder[]>(`${this.apiUrl}/list.php`);
  }

  getById(id: number): Observable<ICompanyOrder> {
    return this.http.post<ICompanyOrder>(`${this.apiUrl}/get.php`, { id });
  }

  add(item: ICompanyOrder): Observable<ICompanyOrder> {
    return this.http.post<ICompanyOrder>(`${this.apiUrl}/add.php`, item);
  }

  update(item: ICompanyOrder): Observable<ICompanyOrder> {
    return this.http.put<ICompanyOrder>(`${this.apiUrl}/update.php`, item);
  }

  save(item: ICompanyOrder): Observable<ICompanyOrder> {
    return item.id ? this.update(item) : this.add(item);
  }

  delete(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete.php`, { id });
  }
}
