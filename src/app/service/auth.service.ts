import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';  // Import throwError here
import { tap, catchError } from 'rxjs/operators';

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
      tap(res => {
        // Assuming the response is of type HttpResponse and actual data is in the body
        const body = res.body as { success: boolean, message: string, name: string };
        if (body && body.success) {
          this.setLoginStatus(true);
          localStorage.setItem('name', body.name);
        } else {
          this.setLoginStatus(false);
          // Throw an error with the response message or a default message
          throw new Error(body ? body.message : 'Unknown error during login');
        }
      }),
      catchError(error => {
        // Handle errors that may occur during the HTTP request or error thrown in tap
        console.error('Login error:', error);
        return throwError(error); // Re-throw the error so that subscribing functions can handle it
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
        const response = res as { success: boolean, message: string, name: string};
        localStorage.setItem('name', response.name);
        if (!response.success) {
          throw new Error(response.message || 'Unknown error during registration');
        }
      })
    );
  }
}
