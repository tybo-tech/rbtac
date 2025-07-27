import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IReason } from '../../models/schema';
import { Constants } from '../service';

@Injectable({ providedIn: 'root' })
export class ReasonService {
  private apiUrl = `${Constants.ApiBase}/reasons`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<IReason[]> {
    return this.http.get<IReason[]>(`${this.apiUrl}/list.php`);
  }

  getById(id: number): Observable<IReason> {
    return this.http.post<IReason>(`${this.apiUrl}/get.php`, { id });
  }

  add(item: IReason): Observable<IReason> {
    return this.http.post<IReason>(`${this.apiUrl}/add.php`, item);
  }

  update(item: IReason): Observable<IReason> {
    return this.http.put<IReason>(`${this.apiUrl}/update.php`, item);
  }

  save(item: IReason): Observable<IReason> {
    return item.id ? this.update(item) : this.add(item);
  }

  delete(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete.php`, { id });
  }
}
