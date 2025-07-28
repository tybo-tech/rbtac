import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICompany } from '../../models/schema';
import { Constants } from '../service';
import { TableFilter } from '../../models/TableColumn';


@Injectable({ providedIn: 'root' })
export class CompanyService {
  private apiUrl = `${Constants.ApiBase}/companies`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ICompany[]> {
    return this.http.get<ICompany[]>(`${this.apiUrl}/list.php`);
  }

  getById(id: number): Observable<ICompany> {
    return this.http.post<ICompany>(`${this.apiUrl}/get.php`, { id });
  }

  add(item: ICompany): Observable<ICompany> {
    return this.http.post<ICompany>(`${this.apiUrl}/add.php`, item);
  }

  update(item: ICompany): Observable<ICompany> {
    return this.http.put<ICompany>(`${this.apiUrl}/update.php`, item);
  }

  save(item: ICompany): Observable<ICompany> {
    return item.id ? this.update(item) : this.add(item);
  }

  delete(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete.php`, { id });
  }

  getWithFilters(filters: TableFilter[] = []): Observable<ICompany[]> {
  return this.http.post<ICompany[]>(`${this.apiUrl}/list.dynamic.php`, {
    filters,
  });
}

}
