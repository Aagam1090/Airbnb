import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn = false;
  constructor(private http : HttpClient) { }

  getLoginStatus(){
    return this.loggedIn;
  }

  setLoginStatus(status: boolean){
    this.loggedIn = status;
  }

  // // login(email: string, password: string) {
  // //   const apiUrl = 'your_backend_endpoint_url';
  // //   const data = {
  // //     email: email,
  // //     password: password
  // //   };
  // //   return this.http.post(apiUrl, data);
  // // }
}
