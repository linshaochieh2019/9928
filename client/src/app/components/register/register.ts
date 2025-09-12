// client/src/app/components/register/register.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { environment } from '../../../environments/environment';

/* global google */
declare const google: any;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  // styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) { }


  ngOnInit() {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => this.handleGoogleResponse(response),
    });

    google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      { theme: "outline", size: "large" }
    );
  }

  handleGoogleResponse(response: any) {
    this.authService.googleLogin(response.credential).subscribe({
      next: () => this.router.navigate(['/']),
      error: err => console.error('Google login failed', err)
    });
  }

  onRegister() {
    this.authService.register(this.name, this.email, this.password).subscribe({
      next: () => this.router.navigate(['/login']),
      error: err => this.error = err.error.error
    });
  }
}
