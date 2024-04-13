import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

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
      city: [''],
      priceMin: [''],
      priceMax: [''],
      bedrooms: [''],
      people: [''],
      amenities: ['']
    });
  }

  submitForm() {
    console.log(this.registrationForm.value);
  }

}
