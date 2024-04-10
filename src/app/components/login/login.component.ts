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
    this.authService.login(this.email, this.password)
    .subscribe(response => {
      console.log('Response from Auth API:', response);
    }, error => {
      // Handle error
      console.error('Error from Auth API:', error);
    });
  }
}
