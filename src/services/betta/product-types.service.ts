import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProductType } from '../../models/schema';
import { Constants } from '../service';


@Injectable({ providedIn: 'root' })
export class ProductTypeService {
  private apiUrl = `${Constants.ApiBase}/product_types`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<IProductType[]> {
    return this.http.get<IProductType[]>(`${this.apiUrl}/list.php`);
  }

  getById(id: number): Observable<IProductType> {
    return this.http.post<IProductType>(`${this.apiUrl}/get.php`, { id });
  }

  add(item: IProductType): Observable<IProductType> {
    return this.http.post<IProductType>(`${this.apiUrl}/add.php`, item);
  }

  update(item: IProductType): Observable<IProductType> {
    return this.http.put<IProductType>(`${this.apiUrl}/update.php`, item);
  }

  save(item: IProductType): Observable<IProductType> {
    return item.id ? this.update(item) : this.add(item);
  }

  delete(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete.php`, { id });
  }
}
