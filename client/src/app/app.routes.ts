import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing';
import { TeacherComponent } from './components/teacher/teacher.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },          // landing page
  { path: 'teachers', component: TeacherComponent },  // teacher CRUD
  { path: '**', redirectTo: '' }                      // fallback → landing
];
