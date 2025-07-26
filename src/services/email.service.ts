import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IEmail, IEmailResponse } from '../models/Email';
import { Constants } from '../models/Constants';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  url = `${Constants.ApiBase}/mail/send.php`;

  constructor(private http: HttpClient) {}
  send(user: IEmail) {
    return this.http.post<IEmailResponse>(this.url, user);
  }
}
