import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing';
import { TeacherComponent } from './components/teacher/teacher.component';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';

export const routes: Routes = [
  { path: '', component: LandingComponent },          // landing page
  { path: 'teachers', component: TeacherComponent },  // teacher CRUD
  { path: 'login', component: LoginComponent },      // login page
  { path: 'register', component: RegisterComponent }, // registration page
  { path: '**', redirectTo: '' }                      // fallback → landing
];
