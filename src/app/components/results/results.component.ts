import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit{
  displayedColumns: string[] = ['name', 'location', 'price', 'amenities', 'totalRating', 'detailedReviews'];
  dataSource = new MatTableDataSource([
    { name: 'Property 1', location: 'New York', price: 1200, amenities: 'Pool, Gym', totalRating: 4.5, detailedReviews: 'Very good, clean.' },
    { name: 'Property 2', location: 'Chicago', price: 1000, amenities: 'Parking, WiFi', totalRating: 4.2, detailedReviews: 'Comfortable, nice view.' },
    // Add more data as needed
  ]);

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

}
