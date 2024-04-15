import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges,Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ReviewService } from 'src/app/service/review.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit, OnChanges {
  @Input() dataresponse!: any[];
  @ViewChild(MatSort, { static: false }) sort: MatSort | null = null;
  @Output() onBack = new EventEmitter<void>(); 
  showReviews = false;
  showLisiting = true;
  reviewData: any[] = [];

  constructor(private reviewService: ReviewService){}

  dataSource = new MatTableDataSource<any>([]);

  displayedColumns: string[] = ['name', 'beds', 'price', 'amenities', 'totalRating'];

  ngOnInit(): void {
    this.updateDataSource();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataresponse']) {
      this.updateDataSource();
    }
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
    console.log('Going back to listing');
    this.showReviews = false;
    this.showLisiting = true; // Show the search form again
  }

  private updateDataSource() {
    if (this.dataresponse && this.dataresponse.length > 0) {
      // Slice the array to get the top 10 results and process amenities
      const topTenResults = this.dataresponse.slice(0, 10).map(item => {
        // Process amenities to ensure it is an array and only the top three are taken
        let amenitiesArray = [];
        if (Array.isArray(item.amenities)) {
          amenitiesArray = item.amenities;
        } else if (typeof item.amenities === 'string') {
          amenitiesArray = item.amenities.split(',').map((a: string) => a.trim());
        }

        // Get the top three amenities
        const topThreeAmenities = amenitiesArray.slice(0, 3);

        // Return the modified item with only the top three amenities
        return {...item, amenities: topThreeAmenities};
      });

      this.dataSource = new MatTableDataSource<any>(topTenResults);
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    } else {
      this.dataSource = new MatTableDataSource<any>([]);
    }
  }
}
