import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = "";
  password: string = "";

  constructor(private router: Router) { }

  onSubmit() {
    // Handle form submission logic here
    console.log('Email:', this.email);
    console.log('Password:', this.password);
  }
}