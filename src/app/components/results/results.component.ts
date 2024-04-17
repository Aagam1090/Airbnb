import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges, Output, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { ReviewService } from 'src/app/service/review.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() dataresponse!: any[];
  @Output() onBack = new EventEmitter<void>();
  showReviews = false;
  showListing = true;
  reviewData: any[] = [];
  city: string = '';
  listingId: string = '';
  private subscriptions: Subscription = new Subscription();

  constructor(private reviewService: ReviewService) {}

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['name', 'beds', 'price', 'amenities', 'totalRating'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.dataSource.data = this.dataresponse?.map(item => ({
      ...item,
      amenities: this.formatAmenities(item.amenities),
      showMore: false
    })) || [];
  }

  formatAmenities(amenities: string | string[]): string {
    if (typeof amenities === 'string') {
      try {
        return JSON.parse(amenities).join(', ');
      } catch (error) {
        console.error('Error parsing amenities:', error);
        return amenities;
      }
    } else if (Array.isArray(amenities)) {
      return amenities.join(', ');
    }
    return '';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataresponse']) {
      this.dataSource.data = this.dataresponse?.map(d => ({
        ...d,
        amenities: this.formatAmenities(d.amenities),
        showMore: false
      }));
      this.dataSource.paginator = this.paginator;
      if (this.paginator) {
        this.paginator.firstPage();
      }
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  goBack() {
    this.onBack.emit();
  }

  storeData(row: any) {
    if (row.review_scores_rating !== 'N/A') {
      const sub = this.reviewService.getReviews(row.id, row.city).subscribe(
        data => {
          console.log('Reviews:', data);
          this.reviewData = data;
          this.listingId = row.id;
          this.city = row.city;
          this.showReviews = true;
          this.showListing = false;
        },
        error => console.error('Error fetching reviews:', error)
      );
      this.subscriptions.add(sub);
    }
  }
  
  toggleShowMore(element: any): void {
    element.showMore = !element.showMore;
  }


  handleListingBack(): void {
    this.showReviews = false;
    this.showListing = true;
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      if (this.paginator) {
        this.paginator.firstPage();
      }
    }, 0);
  }
}
