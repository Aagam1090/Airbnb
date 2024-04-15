import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit, OnChanges {
  @Input() dataresponse!: any[];
  @ViewChild(MatSort, { static: false }) sort: MatSort | null = null;

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
