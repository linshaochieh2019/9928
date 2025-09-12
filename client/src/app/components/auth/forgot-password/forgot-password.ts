// client/src/app/components/auth/forgot-password/forgot-password.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.html',
})
export class ForgotPasswordComponent {
  email = '';
  message = '';
  success: boolean | null = null;

  constructor(private auth: AuthService) { }

  submit() {
    this.auth.forgotPassword(this.email).subscribe({
      next: () => {
        this.success = true;
        this.message = '📩 Check your email for a reset link.';
        setTimeout(() => (this.message = ''), 4000);
      },
      error: (err) => {
        this.success = false;
        this.message = err.error?.message || '❌ Error sending reset link.';
        setTimeout(() => (this.message = ''), 4000);
      },
    });
  }
}
