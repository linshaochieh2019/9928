// client/src/app/components/auth/reset-password/reset-password.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  standalone: true,
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.html',
})
export class ResetPasswordComponent {
  password = '';
  token = '';
  message = '';
  success: boolean | null = null;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  submit() {
    this.auth.resetPassword(this.token, this.password).subscribe({
      next: () => {
        this.success = true;
        this.message = 'Password reset successful. Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 5000);
      },
      error: err => this.message = err.error?.message || 'Error resetting password'
    });
  }
}
