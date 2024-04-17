import { Component, Input,Output,EventEmitter } from '@angular/core';
import { OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ReviewService } from 'src/app/service/review.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateReviewModalComponent } from '../update-review-modal/update-review-modal.component';
import { AddReviewModalComponent } from '../add-review-modal/add-review-modal.component';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})

export class ReviewsComponent {
  @Input() reviewData: Review[] = [];  // Input for review data
  @Input() city: string = ''; // Input for city
  @Input() listingId: string = ''; // Input for listing id
  @Output() onListingBack = new EventEmitter<void>(); // Event emitter for going back
  displayedColumns: string[] = ['id', 'reviewer_name', 'comments', 'actions'];
  
  dataSource = new MatTableDataSource<Review>(this.reviewData); // Your data array

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;

  constructor(
    private reviewService: ReviewService,
    public dialog: MatDialog
  ) {}

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
        this.reviewData = this.reviewData.filter(review => review.id !== id);
        this.dataSource.data = this.reviewData;
        console.log('Delete successful', response);
      },
      error: (error) => console.error('Error deleting review', error)
    });
  }

  updateReview(review: any): void {
    const dialogRef = this.dialog.open(UpdateReviewModalComponent, {
      width: '250px',
      data: { id: review.id, reviewer_name: review.reviewer_name, comments: review.comments, city: this.city}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('The dialog was closed', result, review);
        this.reviewService.updateReview(review.id, result).subscribe({
          next: response => {
            console.log('Review updated successfully', response);
            // Update the local data without reloading from the server
            const index = this.dataSource.data.findIndex(item => item.id === review.id);
            if (index !== -1) {
              // Replace the item at the found index with updated data
              this.dataSource.data[index] = {...this.dataSource.data[index], ...result};
              // Notify the table that the data has changed
              this.dataSource.data = [...this.dataSource.data];
            }
          },
          error: error => console.error('Error updating review', error)
        });
      }
    });
  }

  addReview(): void {
    const dialogRef = this.dialog.open(AddReviewModalComponent, {
      width: '250px'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Add dialog was closed', result);
        // Generate a new review ID here or in the backend
        const listingId = this.listingId; // The ID of the listing being reviewed
        const reviewer_name = 'Admin'; // The name of the reviewer
        this.reviewService.addReview(listingId, result.comments, reviewer_name, this.city).subscribe({
          next: response => {
            console.log('Review added successfully', response);
            // Add the new review to the beginning of the data array
            this.reviewData = [{ id: response.review_id, reviewer_id: response.reviewer_id, reviewer_name: reviewer_name, comments: result.comments }, ...this.reviewData];
            this.dataSource.data = this.reviewData;
            
            // Refresh the table's data source
            this.dataSource.data = this.reviewData;
          },
          error: error => console.error('Error adding review', error)
        });
      }
    });
  }  
  
  goBackListing(){
    console.log('Going back to listing');
    this.onListingBack.emit();
  }
  isAuthorized(reviewerName: string): boolean {
    
    const loggedInReviewerName = localStorage.getItem("name");

    return reviewerName === loggedInReviewerName || loggedInReviewerName === 'Admin';
  }
}

interface Review {
  id: string;
  reviewer_id: string;
  reviewer_name: string;
  comments: string;
}

