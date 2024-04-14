import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetcityService {
  private apiUrl = 'http://127.0.0.1:5000/getCitites'; // URL to web API

  constructor(private http: HttpClient) { }

  getCities(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }
}
