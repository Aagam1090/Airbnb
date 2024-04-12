import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
    user = {
      name: '',
      email: '',
      password: ''
    };

    onSubmit() {
      console.log('User data:', this.user);
      // Here you can handle the submission, e.g., send data to your backend
    }
}
