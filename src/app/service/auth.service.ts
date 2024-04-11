import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http : HttpClient) { console.log("In auth");}

login(email: string, password: string) {
  console.log(email);
  console.log(password);
  
  const apiUrl = 'http://127.0.0.1:5000/login';
  const data = {
    email: email,
    password: password
  };
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  
  return this.http.post(apiUrl, data, httpOptions);
}

register(fullname: string, email: string, password: string) {
  const apiUrl = 'http://127.0.0.1:5000/register';
  const data = {
    fullname: fullname,
    email: email,
    password: password
  };
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  return this.http.post(apiUrl, data, httpOptions);
}
}
