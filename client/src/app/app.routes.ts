import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { ProfileComponent } from './components/teacher/profile/profile';
import { EmployerListComponent } from './components/employer/list/list';

export const routes: Routes = [
  { path: '', component: LandingComponent },          // landing page
  { path: 'login', component: LoginComponent },      // login page
  { path: 'register', component: RegisterComponent }, // registration page
  { path: 'profile', component: ProfileComponent },   // teacher profile
  { path: 'employers', component: EmployerListComponent }, // employer list
  { path: '**', redirectTo: '' }                      // fallback → landing
];
