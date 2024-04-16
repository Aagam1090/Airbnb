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

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful', response.status);
      
        if (response.status === 200) {
          this.authService.setLoginStatus(true);
          this.router.navigate(['/search']);
        }
        else{
          this.authService.setLoginStatus(false);
          console.log('Login failed');
        }
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  }
}
