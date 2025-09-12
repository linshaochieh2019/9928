import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-choose-role',
  imports: [],
  templateUrl: './choose-role.html',
  styleUrl: './choose-role.scss'
})
export class ChooseRole { 
  message: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  setRole(role: string) {
    this.authService.setRole(role).subscribe({
      next: () => this.router.navigate(['/']),
      error: err => this.message = err.error?.message || '❌ Failed to set role'
    });
  }
}


