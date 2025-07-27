import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICompanyOrderProduct } from '../../models/schema';
import { Constants } from '../service';


@Injectable({ providedIn: 'root' })
export class CompanyOrderProductService {
  private apiUrl = `${Constants.ApiBase}/company_order_products`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ICompanyOrderProduct[]> {
    return this.http.get<ICompanyOrderProduct[]>(`${this.apiUrl}/list.php`);
  }

  getById(id: number): Observable<ICompanyOrderProduct> {
    return this.http.post<ICompanyOrderProduct>(`${this.apiUrl}/get.php`, { id });
  }

  add(item: ICompanyOrderProduct): Observable<ICompanyOrderProduct> {
    return this.http.post<ICompanyOrderProduct>(`${this.apiUrl}/add.php`, item);
  }

  update(item: ICompanyOrderProduct): Observable<ICompanyOrderProduct> {
    return this.http.put<ICompanyOrderProduct>(`${this.apiUrl}/update.php`, item);
  }

  save(item: ICompanyOrderProduct): Observable<ICompanyOrderProduct> {
    return item.id ? this.update(item) : this.add(item);
  }

  delete(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete.php`, { id });
  }
}
