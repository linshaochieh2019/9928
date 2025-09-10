import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { TeacherListComponent } from './components/teacher/list/list';
import { TeacherProfileComponent } from './components/teacher/profile/profile';
import { MyProfileComponent } from './components/teacher/my-profile/my-profile';
import { EmployerListComponent } from './components/employer/list/list';
import { EmployerDetailComponent } from './components/employer/employer-detail/employer-detail';
import { MyEmployerProfileComponent } from './components/employer/my-employer-profile/my-employer-profile';
import { UnlockedTeachersComponent } from './components/teacher/unlocked-teachers/unlocked-teachers';

export const routes: Routes = [
  { path: '', component: LandingComponent },          // landing page
  { path: 'login', component: LoginComponent },      // login page
  { path: 'register', component: RegisterComponent }, // registration page
  { path: 'teachers', component: TeacherListComponent }, // teacher list
  { path: 'teacher/my-profile', component: MyProfileComponent }, // my profile
  { path: 'teachers/:id', component: TeacherProfileComponent }, // teacher profile
  { path: 'employers', component: EmployerListComponent }, // employer list
  { path: 'employers/my-employer-profile', component: MyEmployerProfileComponent }, // my employer profile
  { path: 'employers/unlocked-teachers', component: UnlockedTeachersComponent }, // unlocked teachers
  { path: 'employers/:id', component: EmployerDetailComponent }, // employer detail
  { path: '**', redirectTo: '' }                      // fallback → landing
];
