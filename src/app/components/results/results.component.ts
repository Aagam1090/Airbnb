import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ReviewService } from 'src/app/service/review.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() dataresponse!: any[]; // Assuming dataresponse is an array of objects.
  @Output() onBack = new EventEmitter<void>(); 
  showReviews = false;
  showLisiting = true;
  reviewData: any[] = [];

  constructor(private reviewService: ReviewService) {}

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['name', 'beds', 'price', 'amenities', 'totalRating'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.dataSource.data = this.dataresponse || [];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataresponse']) {
      this.dataSource.data = this.dataresponse;
      this.dataSource.paginator = this.paginator;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  goBack() {
    this.onBack.emit(); 
  }

  storeData(row: any) {
    if(row.review_scores_rating !== 'N/A') {
      this.reviewService.getReviews(row.id, row.city).subscribe(
        data => {
          console.log('Reviews:', data);
          this.reviewData = data;
          this.showReviews = true;
          this.showLisiting = false;
        },
        error => console.error('Error fetching reviews:', error)
      );
    }
  }

  handleListingBack(): void {
    this.showReviews = false;
    this.showLisiting = true; // Show the search form again
  }
}
