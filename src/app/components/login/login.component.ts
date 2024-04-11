import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = "";
  password: string = "";

  constructor(private router: Router, private authService: AuthService) { }

  onSubmit() {
    console.log(this.email); // These properties are already updated
    console.log(this.password); // due to two-way data binding with ngModel
    this.authService.login(this.email, this.password)
      .subscribe(response => {
        console.log('Response from Auth API:', response);
        // Handle successful login, e.g., navigate to a different route
      }, error => {
        console.error('Error from Auth API:', error);
        // Handle login error
      });
  }
}
