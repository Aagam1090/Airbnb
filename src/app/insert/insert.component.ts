import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-insert',
  templateUrl: './insert.component.html',
  styleUrls: ['./insert.component.css']
})
export class InsertComponent implements OnInit {
  propertyForm!: FormGroup;
  cityList: string[] = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Other'];
  showOtherCityField = false; // This property will control the visibility of the 'Other' city input field

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.propertyForm = this.formBuilder.group({
      name: ['', Validators.required],
      field: [''],
      location: ['', Validators.required],
      city: ['', Validators.required],
      otherCity: [{value: '', disabled: true}],
      price: [null, Validators.required],
      bedrooms: [null, [Validators.required, Validators.max(50)]],
      guests: [null, [Validators.required, Validators.max(100)]],
      amenities: [''],
      propertyType: ['', Validators.required],
      rating: [null, [Validators.required, Validators.min(0), Validators.max(10)]],
      review: ['']
    });

    this.propertyForm.get('city')?.valueChanges.subscribe(value => {
      this.showOtherCityField = value === 'Other';
      if (this.showOtherCityField) {
        this.propertyForm.get('otherCity')?.enable();
      } else {
        this.propertyForm.get('otherCity')?.disable();
      }
    });
  }

  onSubmitPropertyForm() {
    if (this.propertyForm.valid) {
      const formData = this.propertyForm.value;
      if (!this.propertyForm.get('otherCity')?.enabled) {
        delete formData.otherCity;
      }
      this.http.post('http://your-backend-url/properties', formData).subscribe({
        next: (response) => {
          console.log('Property added successfully:', response);
        },
        error: (error) => {
          console.error('Failed to add property:', error);
        }
      });
    } else {
      console.error('Form is not valid:', this.propertyForm.errors);
    }
  }
}