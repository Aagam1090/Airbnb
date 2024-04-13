import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormArray } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  registrationForm: FormGroup;
  cityList: string[] = ['New York', 'Los Angeles', 'Chicago', 'Houston'];
  amenitiesList: string[] = ['Pool', 'Gym', 'Parking', 'WiFi'];

  constructor(private formBuilder: FormBuilder) {
    this.registrationForm = this.formBuilder.group({
      name: [''],
      city: ['', Validators.required],
      priceMin: ['', [Validators.required, Validators.min(0)]],
      priceMax: ['', [Validators.required, Validators.min(0)]],
      bedrooms: ['', [Validators.min(1), Validators.max(30)]],
      people: ['', [Validators.min(1), Validators.max(30)]],
      amenities: [this.getDefaultAmenities()]
    }, { validators: this.priceRangeValidator });
  }

  priceRangeValidator(form: FormGroup): { [key: string]: any } | null {
    const min = form.get('priceMin')?.value || 0;
    const max = form.get('priceMax')?.value || 0;
    return min !== null && max !== null && min <= max ? null : { 'priceRangeInvalid': true };
  }
  getDefaultAmenities(): string[] {
    // Return an empty array if no default value is desired
    // or return an array with default selected values
    return []; // This sets the amenities to have no pre-selected values
  }

  submitForm() {
    if (this.registrationForm.valid) {
      console.log(this.registrationForm.value);
    } else {
      console.error('Form is not valid');
    }
  }

}
