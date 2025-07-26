// src/app/login.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { EmailService } from './email.service';
import { Constants } from './service';
import { Users, initUsers } from '../models/User';
const api = Constants.ApiBase;
const websiteId = 'tybo-editor'; // Replace with your actual website ID
// private apiUrl = `${Constants.ApiBase}/collection-data`;

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private loginApiUrl = `${api}/users/login.php`;
  private registerApiUrl = `${api}/users/register.php`;
  private updateApiUrl = `${api}/users/update.php`;
  private checkEmailApiUrl = `${api}/users/check-email.php`;
  private getUSerApiUrl = `${api}/users/get.php`;
  private allUSersApiUrl = `${api}/users/list.php`;
  //get-by-token.php
  private getUSerByTokenApiUrl = `${api}/users/get-by-token.php`;
  private resetPasswordApiUrl = `${api}/users/reset-password.php`;
  private userKey = 'TYBO_USER'; // Key for storing user data in local storage

  private user = new BehaviorSubject<Users>(initUsers);
  $user = this.user.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private emailService: EmailService
  ) {
    const user = this.getUserSession();
    if (user) {
      this.updateUser(user);
    }
  }
  get isAuthenticated(): boolean {
    const user = this.userValue;
    return user && user.email && user.role ? true : false;
  }
  get isAdmin(): boolean {
    if (!this.isAuthenticated) return false;
    const user = this.userValue;
    return (user && user.role && user.role.toLowerCase() === 'admin') || false;
  }
  checkEmail(email: string): Observable<Users> {
    const body = { email, website_id: websiteId };
    return this.http.get<Users>(
      `${this.checkEmailApiUrl}?email=${email}&website_id=${websiteId}`
    );
  }
  //get-by-token.php
  getByToken(token: string): Observable<Users> {
    return this.http.get<Users>(`${this.getUSerByTokenApiUrl}?token=${token}`);
  }

  get(id: string): Observable<Users> {
    const body = { id, website_id: websiteId };
    return this.http.post<Users>(this.getUSerApiUrl, body);
  }
  all(): Observable<Users[]> {
    return this.http.get<Users[]>(this.allUSersApiUrl);
  }
  login(username: string, password: string): Observable<Users> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { ...initLogin, email: username, password };

    return this.http.post<any>(this.loginApiUrl, body, { headers }).pipe(
      map((response) => {
        if (response && response.password) {
          return response;
        }

        throw new Error('Invalid credentials');
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        return throwError('Authentication failed');
      })
    );
  }
  register(
    name: string,
    email: string,
    password: string,
    role: string,
    metadata?: any
  ): Observable<Users> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { ...initSignUp, name, email, password, role, metadata };

    return this.http.post<any>(this.registerApiUrl, body).pipe(
      map((response) => {
        if (response && response.role) {
          return response;
        }

        throw new Error('Invalid credentials');
      }),
      catchError((error) => {
        console.error('Registration failed:', error);
        return throwError('Registration failed');
      })
    );
  }

  update(user: Users) {
    return this.http.post<Users>(this.updateApiUrl, user);
  }

  resetPassword(input: {
    newPassword: string;
    website_id: number;
    email: string;
  }) {
    return this.http.post<Users>(this.resetPasswordApiUrl, input);
  }

  get userValue(): Users {
    return this.user.value;
  }
  updateUser(user: Users) {
    const updatedUser = { ...user }; // Ensure immutability
    this.user.next(updatedUser);
    localStorage.setItem(this.userKey, JSON.stringify(updatedUser));
  }

  getUserSession(): Users | undefined {
    const user = localStorage.getItem(this.userKey);
    try {
      return user ? JSON.parse(user) : undefined;
    } catch (error) {
      console.error('Error parsing user session data:', error);
      return undefined;
    }
  }

  // Add a method to clear user data and token from local storage
  clearUserData() {
    this.user.next(initUsers);
    localStorage.removeItem(this.userKey);
  }
  checkSession() {
    if (
      this.user.value.role.toLowerCase() !== 'admin' ||
      !this.user.value.email
    ) {
      this.router.navigate([`/login`]);
    }
  }
  logout() {
    this.clearUserData();
    this.user.next(initUsers);
    this.router.navigate(['/login']);
  }

  generateToken(): string {
    const token = btoa(`${new Date().getTime()}${(Math.random() + 1) * 1000}`);
    return token;
  }

  redirectToPage(packageParam: string, templateParam: string) {
    if (packageParam) {
      // this.router.navigate(['/checkout', packageParam]);
      window.location.href = `https://editor.tybo.co.za/checkout/${packageParam}`;
      return;
    }
    if (templateParam) {
      // this.router.navigate(['/clone', templateParam]);
      window.location.href = `https://editor.tybo.co.za/clone/${templateParam}`;
      return;
    }
    // Projects
    this.router.navigate(['/']);
  }
}

export const initSignUp = {
  email: '',
  password: '',
  role: '',
  website_id: websiteId,
  name: '',
};

export const initLogin = {
  email: '',
  password: '',
  website_id: websiteId,
};
