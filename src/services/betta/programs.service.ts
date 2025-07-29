import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProgram } from '../../models/schema';
import { Constants } from '../service';


@Injectable({ providedIn: 'root' })
export class ProgramService {
  private apiUrl = `${Constants.ApiBase}/programs`;

  constructor(private http: HttpClient) {
    console.log('ProgramService apiUrl:', this.apiUrl);
  }

  getAll(): Observable<IProgram[]> {
    return this.http.get<IProgram[]>(`${this.apiUrl}/list.php`);
  }

  getById(id: number): Observable<IProgram> {
    return this.http.post<IProgram>(`${this.apiUrl}/get.php`, { id });
  }

  add(item: IProgram): Observable<IProgram> {
    return this.http.post<IProgram>(`${this.apiUrl}/add.php`, item);
  }

  update(item: IProgram): Observable<IProgram> {
    return this.http.put<IProgram>(`${this.apiUrl}/update.php`, item);
  }

  save(item: IProgram): Observable<IProgram> {
    return item.id ? this.update(item) : this.add(item);
  }

  delete(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete.php`, { id });
  }
}
