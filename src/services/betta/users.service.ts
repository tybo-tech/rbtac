import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../../models/schema';
import { Constants } from '../service';


@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${Constants.ApiBase}/users`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.apiUrl}/list.php`);
  }

  getById(id: number): Observable<IUser> {
    return this.http.post<IUser>(`${this.apiUrl}/get.php`, { id });
  }

  add(item: IUser): Observable<IUser> {
    return this.http.post<IUser>(`${this.apiUrl}/add.php`, item);
  }

  update(item: IUser): Observable<IUser> {
    return this.http.put<IUser>(`${this.apiUrl}/update.php`, item);
  }

  save(item: IUser): Observable<IUser> {
    return item.id ? this.update(item) : this.add(item);
  }

  delete(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete.php`, { id });
  }
}
