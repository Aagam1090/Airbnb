import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { GetcityService } from '../service/getcity.service';
import { InsertpropertyService } from '../service/insertproperty.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../components/success-dialog/success-dialog.component';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-insert',
  templateUrl: './insert.component.html',
  styleUrls: ['./insert.component.css']
})
export class InsertComponent {
  propertyForm!: FormGroup;
  cityList: string[] = [];
  // cityList: string[] = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Other'];
  showOtherCityField = false;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private getCityService: GetcityService, private insertPropertyService: InsertpropertyService, private router: Router, public dialog: MatDialog, private authService: AuthService) {}

  ngOnInit(): void {
    this.propertyForm = this.formBuilder.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      city: ['', Validators.required],
      otherCity: [{value: '', disabled: true}],
      price: [null, Validators.required],
      bedrooms: [null, [Validators.required, Validators.max(50)]],
      bathrooms: [null, [Validators.required, Validators.max(50)]],
      guests: [null, [Validators.required, Validators.max(100)]],
      amenities: [''],
      propertyType: ['', Validators.required],
      rating: [null, [Validators.required, Validators.min(0), Validators.max(10)]],
      review: [''],
      reviewer_name:['']
    });

    this.propertyForm.get('city')?.valueChanges.subscribe(value => {
      this.showOtherCityField = value === 'Other';
      if (this.showOtherCityField) {
        this.propertyForm.get('otherCity')?.enable();
      } else {
        this.propertyForm.get('otherCity')?.disable();
      }
    });

    this.getCityService.getCities().subscribe(cities => {
      console.log('Cities:', cities);
      this.cityList = cities;
      this.cityList.push("Other");
    });
  }

  onSubmitPropertyForm() {
    if (this.propertyForm.valid) {
      const formData = this.propertyForm.value;
      formData['reviewer_name'] = localStorage.getItem('name');
      console.log(formData);
      if (!this.propertyForm.get('otherCity')?.enabled) {
        delete formData.otherCity;  // Ensure otherCity is not sent unnecessarily
      }
      this.insertPropertyService.insertProperty(formData).subscribe({
        next: (response) => {
          console.log('Property added successfully:', response);
          this.openSuccessDialog();
        },
        error: (error) => {
          console.error('Failed to add property:', error);
        }
      });
    } else {
      console.error('Form is not valid:', this.propertyForm.errors);
    }
  }
  openSuccessDialog() {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result === 'done') {
        this.authService.getLoginStatus()
        this.router.navigate(['/search']);  // Redirect to the search page
      }
    });
  }
}