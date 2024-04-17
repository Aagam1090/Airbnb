import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private authService:AuthService,private router:Router) { }
  loggedIn = false;

  ngOnInit() {
    this.loggedIn = this.authService.getLoginStatus();
  }

  logout(){
    this.authService.setLoginStatus(false);
    localStorage.setItem('userType', 'normal');
    this.router.navigate(['/logout']);
  }

  isAdmin(){
    if(localStorage.getItem('userType') == 'admin'){
      return true;
    }
    return false;
  }
}
