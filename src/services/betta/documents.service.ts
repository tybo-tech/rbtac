import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDocument } from '../../models/schema';
import { Constants } from '../service';


@Injectable({ providedIn: 'root' })
export class DocumentService {
  private apiUrl = `${Constants.ApiBase}/documents`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<IDocument[]> {
    return this.http.get<IDocument[]>(`${this.apiUrl}/list.php`);
  }

  getById(id: number): Observable<IDocument> {
    return this.http.post<IDocument>(`${this.apiUrl}/get.php`, { id });
  }

  add(item: IDocument): Observable<IDocument> {
    return this.http.post<IDocument>(`${this.apiUrl}/add.php`, item);
  }

  update(item: IDocument): Observable<IDocument> {
    return this.http.put<IDocument>(`${this.apiUrl}/update.php`, item);
  }

  save(item: IDocument): Observable<IDocument> {
    return item.id ? this.update(item) : this.add(item);
  }

  delete(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete.php`, { id });
  }
}
