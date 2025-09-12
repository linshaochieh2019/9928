// client/src/app/components/auth/reset-password/reset-password.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  standalone: true,
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Reset Password</h2>
    <form (ngSubmit)="submit()">
      <input [(ngModel)]="password" name="password" type="password" placeholder="New password" required>
      <button type="submit">Reset</button>
    </form>
    <p *ngIf="message">{{ message }}</p>
  `
})
export class ResetPasswordComponent {
  password = '';
  token = '';
  message = '';

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
        this.message = 'Password reset successful. Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: err => this.message = err.error?.message || 'Error resetting password'
    });
  }
}
