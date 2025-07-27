import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISupplier } from '../../models/schema';
import { Constants } from '../service';

@Injectable({ providedIn: 'root' })
export class SupplierService {
  private apiUrl = `${Constants.ApiBase}/suppliers`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ISupplier[]> {
    return this.http.get<ISupplier[]>(`${this.apiUrl}/list.php`);
  }

  getById(id: number): Observable<ISupplier> {
    return this.http.post<ISupplier>(`${this.apiUrl}/get.php`, { id });
  }

  add(item: ISupplier): Observable<ISupplier> {
    return this.http.post<ISupplier>(`${this.apiUrl}/add.php`, item);
  }

  update(item: ISupplier): Observable<ISupplier> {
    return this.http.put<ISupplier>(`${this.apiUrl}/update.php`, item);
  }

  save(item: ISupplier): Observable<ISupplier> {
    return item.id ? this.update(item) : this.add(item);
  }

  delete(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete.php`, { id });
  }
}
