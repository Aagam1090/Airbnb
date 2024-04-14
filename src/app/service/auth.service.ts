import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'http://localhost:5000/';
  loggedIn = false;
  constructor(private http: HttpClient) { }

  getLoginStatus() {
    return this.loggedIn;
  }

  setLoginStatus(status: boolean) {
    this.loggedIn = status;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<{ success: boolean, message: string }>(this.apiUrl+'login', { email, password }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      tap(res => {
        const response = res as { success: boolean, message: string };
        if (response.success) {
          this.setLoginStatus(true);
        } else {
          throw new Error(response.message || 'Unknown error during login');
        }
      }),
    );
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post<{ success: boolean, message: string }>(
      `${this.apiUrl}register`, 
      { name, email, password },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).pipe(
      tap(res => {
        const response = res as { success: boolean, message: string };
        if (!response.success) {
          throw new Error(response.message || 'Unknown error during registration');
        }
      }),
    );
  }
}
