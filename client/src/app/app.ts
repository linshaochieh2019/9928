import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

// Components and Services
import { PingService } from './services/ping';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('client');

  constructor(private pingService: PingService, public authService: AuthService) {
    this.pingService.pingServer().subscribe(response => {
      console.log(response.message);
    });
  }

  logout() {
    this.authService.logout();
  }
}
