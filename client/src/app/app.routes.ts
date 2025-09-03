import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { TeacherListComponent } from './components/teacher/list/list';
import { TeacherProfileComponent } from './components/teacher/profile/profile';
import { MyProfileWrapperComponent } from './components/shared/my-profile-wrapper/my-profile-wrapper';
import { EmployerListComponent } from './components/employer/list/list';
import { EmployerDetailComponent } from './components/employer/employer-detail/employer-detail';

export const routes: Routes = [
  { path: '', component: LandingComponent },          // landing page
  { path: 'login', component: LoginComponent },      // login page
  { path: 'register', component: RegisterComponent }, // registration page
  { path: 'teachers', component: TeacherListComponent }, // teacher list
  { path: 'teachers/:id', component: TeacherProfileComponent }, // teacher profile
  { path: 'my-profile', component: MyProfileWrapperComponent }, // my profile wrapper
  { path: 'employers', component: EmployerListComponent }, // employer list
  { path: 'employers/:id', component: EmployerDetailComponent }, // employer detail
  { path: '**', redirectTo: '' }                      // fallback → landing
];
