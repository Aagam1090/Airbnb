import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000/'; // Ensure no leading space in URL
  loggedIn = false;

  constructor(private http: HttpClient) { }

  getLoginStatus() {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  setLoginStatus(status: boolean) {
    this.loggedIn = status;
    localStorage.setItem('isLoggedIn', status ? 'true' : 'false');
  }

  login(email: string, password: string): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.apiUrl + 'login', { email, password }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response'
    }).pipe(
      tap(response => {
        if (response.body && response.body.success) {
          this.setLoginStatus(true);
        } else {
          this.setLoginStatus(false); // Set status to false if login is not successful
          throw new Error(response.body ? response.body.message : 'Unknown error during login');
        }
      })
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
      })
    );
  }
}
