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
        if (this.authService.getLoginStatus()) {
          this.router.navigate(['/search']);
        }
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  }
}
