import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct } from '../../models/schema';
import { Constants } from '../service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${Constants.ApiBase}/products`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.apiUrl}/list.php`);
  }

  getById(id: number): Observable<IProduct> {
    return this.http.post<IProduct>(`${this.apiUrl}/get.php`, { id });
  }

  add(item: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(`${this.apiUrl}/add.php`, item);
  }

  update(item: IProduct): Observable<IProduct> {
    return this.http.put<IProduct>(`${this.apiUrl}/update.php`, item);
  }

  save(item: IProduct): Observable<IProduct> {
    return item.id ? this.update(item) : this.add(item);
  }

  delete(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete.php`, { id });
  }
}
