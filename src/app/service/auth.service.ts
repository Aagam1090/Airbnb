import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

   constructor(private http : HttpClient) { }

  // // login(email: string, password: string) {
  // //   const apiUrl = 'your_backend_endpoint_url';
  // //   const data = {
  // //     email: email,
  // //     password: password
  // //   };
  // //   return this.http.post(apiUrl, data);
  // // }
}
