// client/src/app/components/auth/forgot-password/forgot-password.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth';

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Forgot Password</h2>
    <form (ngSubmit)="submit()">
      <input [(ngModel)]="email" name="email" placeholder="Your email" required>
      <button type="submit">Send Reset Link</button>
    </form>
    <p *ngIf="message">{{ message }}</p>
  `
})
export class ForgotPasswordComponent {
  email = '';
  message = '';

  constructor(private auth: AuthService) {}

  submit() {
    this.auth.forgotPassword(this.email).subscribe({
      next: () => this.message = 'Check your email for a reset link',
      error: err => this.message = err.error?.message || 'Error sending reset link'
    });
  }
}
