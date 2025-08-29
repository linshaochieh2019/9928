import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { TeacherListComponent } from './components/teacher/list/list';
import { TeacherProfileComponent } from './components/teacher/profile/profile';
import { MyProfileComponent } from './components/teacher/my-profile/my-profile';
import { EmployerListComponent } from './components/employer/list/list';

export const routes: Routes = [
  { path: '', component: LandingComponent },          // landing page
  { path: 'login', component: LoginComponent },      // login page
  { path: 'register', component: RegisterComponent }, // registration page
  { path: 'teachers', component: TeacherListComponent }, // teacher list
  { path: 'teachers/:id', component: TeacherProfileComponent }, // teacher profile
  { path: 'my-profile', component: MyProfileComponent }, // my profile
  { path: 'employers', component: EmployerListComponent }, // employer list
  { path: '**', redirectTo: '' }                      // fallback → landing
];
