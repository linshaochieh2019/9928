import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-choose-role',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './choose-role.html',
  styleUrls: ['./choose-role.scss']
})
export class ChooseRoleComponent { 
  toastMessage: string | null = null;
  toastType: 'success' | 'danger' = 'success';

  constructor(private authService: AuthService, private router: Router) {}

  setRole(role: string) {
    this.authService.setRole(role).subscribe({
      next: () => {
        this.toastMessage = `✅ Role set to ${role.charAt(0).toUpperCase() + role.slice(1)}.`;
        this.toastType = 'success';
        setTimeout(() => {
          this.toastMessage = null;
          this.router.navigate(['/']);
        }, 1500); // auto redirect after short delay
      },
      error: err => {
        this.toastMessage = err.error?.message || '❌ Failed to set role.';
        this.toastType = 'danger';
        setTimeout(() => this.toastMessage = null, 4000);
      }
    });
  }
}
