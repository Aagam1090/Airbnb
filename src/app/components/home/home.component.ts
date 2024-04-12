import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router: Router) { }

  login(){
    console.log("Login Pressed");
    this.router.navigate(['/login']);
  }

  register(){
    this.router.navigate(['/register']);
  }
}
