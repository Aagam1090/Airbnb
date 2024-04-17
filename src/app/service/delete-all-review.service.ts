import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeleteAllReviewService {

  private apiUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) { }

  removeReviews(listingId: string, city: string): Observable<any> {
    const params = {
      listing_id: listingId,
      city: city
    };
    return this.http.get<any>(this.apiUrl+'/removeAllReviews', { params });
  }
}
