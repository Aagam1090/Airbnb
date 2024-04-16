import { Component, Input,Output,EventEmitter } from '@angular/core';
import { OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ReviewService } from 'src/app/service/review.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent {
  @Input() reviewData: Review[] = [];  // Input for review data
  @Input() city: string = ''; // Input for city
  @Output() onListingBack = new EventEmitter<void>(); // Event emitter for going back
  displayedColumns: string[] = ['id', 'reviewer_name', 'comments', 'actions'];
  
  dataSource = new MatTableDataSource<Review>(this.reviewData); // Your data array

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;

  constructor(private reviewService: ReviewService) {}

  ngOnInit() {
    this.dataSource.data = this.reviewData; 
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges() {
    console.log('Review data changed', this.reviewData);
  }

  deleteReview(id: string) {
    this.reviewService.deleteReview(id, this.city).subscribe({
      next: (response) => {
        this.dataSource.data = this.dataSource.data.filter(review => review.id !== id);
        console.log('Delete successful', response);
      },
      error: (error) => console.error('Error deleting review', error)
    });
  }

  updateReview(id: string) {
    console.log('Update review', id);
    // Implement update logic
  }
  
  goBackListing(){
    console.log('Going back to listing');
    this.onListingBack.emit();
  }
}

interface Review {
  id: string;
  reviewer_id: string;
  reviewer_name: string;
  comments: string;
}

