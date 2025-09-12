import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  standalone: true,
  selector: 'app-verify-email',
  imports: [CommonModule],
  templateUrl: './verify-email.html',
})
export class VerifyEmailComponent implements OnInit {
  message = '';
  success = false;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token') || '';
    this.auth.verifyEmail(token).subscribe({
      next: () => {
        this.message = '✅ Your email has been verified successfully!';
        this.success = true;
        this.loading = false;
      },
      error: err => {
        this.message = err.error?.message || '❌ Verification failed.';
        this.success = false;
        this.loading = false;
      }
    });
  }

  goLogin() {
    this.router.navigate(['/login']);
  }
}
