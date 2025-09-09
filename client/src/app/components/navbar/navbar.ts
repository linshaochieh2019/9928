import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
})
export class NavbarComponent {
  constructor(public authService: AuthService, private router: Router) { }

  goToMyProfile() {
    const teacherId = this.authService.getTeacherId();
    const employerId = this.authService.getEmployerId();
    if (teacherId) {
      this.router.navigate(['/teachers', teacherId]);
    } else if (employerId) {
      this.router.navigate(['/employers', employerId]);
    } else {
      console.warn('No profile found for this user');
    }
  }

  logout() {
    this.authService.logout();
    // direct back to home page after logout
    this.router.navigate(['/']);
  }
}
