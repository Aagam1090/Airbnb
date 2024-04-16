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
  errorMessage: string = "";

  constructor(private router: Router, private authService: AuthService) { }

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.authService.setLoginStatus(true);
          this.router.navigate(['/search']);
        } else {
          // Normally, 200 status code will not be in 'next' if there's an error
          this.errorMessage = 'Incorrect email or password';
          this.authService.setLoginStatus(false);
        }
      },
      error: (error) => {
        console.error('Login failed', error);
        this.errorMessage = 'Incorrect email or password'; // Set the error message
      }
    });
  }
}
