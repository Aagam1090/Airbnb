import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://127.0.0.1:5000'; // Adjust the URL based on your actual Flask server URL

  constructor(private http: HttpClient) { }

  getReviews(listingId: string, city: string): Observable<any[]> {
    let params = new HttpParams()
      .set('listing_id', listingId)
      .set('city', city);

    return this.http.get<any[]>(`${this.apiUrl}/getReviews`, { params });
  }

  deleteReview(reviewId: string, city: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/deleteReview`, { review_id: reviewId, city: city });
  }
}
