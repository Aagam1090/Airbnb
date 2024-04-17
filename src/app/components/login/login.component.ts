import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { FormsModule } from '@angular/forms';

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
    // Store email in local storage
    // localStorage.setItem('email', this.email);
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful', response);

        // Determine the type of user based on credentials
        this.setUserType(this.email, this.password);

        if (this.authService.getLoginStatus()) {
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

  setUserType(email: string, password: string) {
    if (email === 'admin@usc.edu' && password === 'admin123') {
      // Set the user type to admin
      localStorage.setItem('userType', 'admin');
      console.log(localStorage.getItem('userType'));
    } else {
      // Set the user type to normal
      console.log(localStorage.getItem('userType'));
      localStorage.setItem('userType', 'normal');
    }
  }
}
