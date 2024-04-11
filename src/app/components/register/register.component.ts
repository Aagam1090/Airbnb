import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
  fullName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onRegister() {
    console.log(this.fullName);
    console.log(this.email);

    this.authService.register(this.fullName,this.email,this.password)
    .subscribe(response => {
        console.log('Registration successful', response);
        this.router.navigate(['/login']); // or some other route
      }, error => {
        console.error('Registration failed', error);
      });
    }
  }
