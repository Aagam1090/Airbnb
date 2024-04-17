import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { SearchComponent } from './search/search.component';
import { InsertComponent } from './insert/insert.component';
import { AuthGuard } from './auth.guard';
import { BulkInsertComponent } from './components/bulk-insert/bulk-insert.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'search', component: SearchComponent ,canActivate: [AuthGuard] },
  { path: 'insert', component: InsertComponent, canActivate: [AuthGuard]  },
  { path: 'logout', component: HomeComponent },
  { path: 'bulk-insert', component: BulkInsertComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
