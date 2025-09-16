import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password';
import { VerifyEmailComponent } from './components/auth/verify-email/verify-email';
import { ChooseRoleComponent } from './components/auth/choose-role/choose-role';
import { TeacherListComponent } from './components/teacher/list/list';
import { TeacherProfileComponent } from './components/teacher/profile/profile';
import { MyProfileComponent } from './components/teacher/my-profile/my-profile';
import { EmployerListComponent } from './components/employer/list/list';
import { EmployerDetailComponent } from './components/employer/employer-detail/employer-detail';
import { MyEmployerProfileComponent } from './components/employer/my-employer-profile/my-employer-profile';
import { UnlockedTeachersComponent } from './components/teacher/unlocked-teachers/unlocked-teachers';
import { BuyPointsComponent } from './components/employer/buy-points/buy-points';
import { PaymentResultComponent } from './components/employer/payment-result/payment-result';
import { PointsComponent } from './components/employer/points/points';

export const routes: Routes = [
  { path: '', component: LandingComponent },          // landing page
  { path: 'login', component: LoginComponent },      // login page
  { path: 'register', component: RegisterComponent }, // registration page
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'verify-email/:token', component: VerifyEmailComponent }, // email verification
  { path: 'choose-role', component: ChooseRoleComponent }, // choose role
  { path: 'teachers', component: TeacherListComponent }, // teacher list
  { path: 'teacher/my-profile', component: MyProfileComponent }, // my profile
  { path: 'teachers/:id', component: TeacherProfileComponent }, // teacher profile
  { path: 'employers', component: EmployerListComponent }, // employer list
  { path: 'employers/my-employer-profile', component: MyEmployerProfileComponent }, // my employer profile
  { path: 'employers/unlocked-teachers', component: UnlockedTeachersComponent }, // unlocked teachers
  { path: 'employers/buy-points', component: BuyPointsComponent }, // buy points
  { path: 'employers/payment-result', component: PaymentResultComponent }, // payment result
  { path: 'employers/points', component: PointsComponent }, // points history
  { path: 'employers/:id', component: EmployerDetailComponent }, // employer detail
  { path: '**', redirectTo: '' }                      // fallback → landing
];
