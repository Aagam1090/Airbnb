import { Component, Input,Output,EventEmitter } from '@angular/core';
import { OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent {
  @Input() reviewData: Review[] = [];  // Input for review data
  @Output() onListingBack = new EventEmitter<void>(); // Event emitter for going back
  displayedColumns: string[] = ['id', 'reviewer_name', 'comments', 'actions'];
  
  dataSource = new MatTableDataSource<Review>(this.reviewData); // Your data array

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;

  ngOnInit() {
    this.dataSource.data = this.reviewData; 
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges() {
    console.log('Review data changed', this.reviewData);
  }

  deleteReview(id: string) {
    console.log('Delete review', id);
    // Implement deletion logic
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

