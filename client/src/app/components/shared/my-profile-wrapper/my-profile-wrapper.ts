import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { MyProfileComponent } from '../../teacher/my-profile/my-profile';
import { MyEmployerProfileComponent } from '../../employer/my-employer-profile/my-employer-profile';

@Component({
  selector: 'app-my-profile-wrapper',
  standalone: true,
  imports: [MyProfileComponent, MyEmployerProfileComponent],
  template: `
    @if (role === 'teacher') {
      <app-my-profile />
    } @else if (role === 'employer') {
      <app-my-employer-profile />
    } @else {
      <p>Please log in to see your profile.</p>
    }
  `
})
export class MyProfileWrapperComponent implements OnInit {
  role: string | null = null;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.role = this.auth.getRole();
  }
}
