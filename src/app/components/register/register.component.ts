import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

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

    constructor(private router: Router, private authService: AuthService) {}

    onRegister() {
      console.log('User data:', this.user);
      this.authService.register(this.user.name, this.user.email, this.user.password).subscribe({
        next: () => {
          this.router.navigate(['/search']);  // Navigate on successful registration
        },
        error: (error) => {
          console.error('Registration failed:', error.message);
          
        }
      });
    }
}

