import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InsertpropertyService {

  private apiUrl = 'http://127.0.0.1:5000/insert'; // URL to web API

  constructor(private http: HttpClient) { }

  insertProperty(formData: any): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }
}
