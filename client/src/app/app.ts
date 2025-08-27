import { Component, signal } from '@angular/core';

// Routing
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

// Components and Services
import { PingService } from './services/ping';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('client');

  constructor(private pingService: PingService) {
    this.pingService.pingServer().subscribe(response => {
      console.log(response.message);
    });
  }
}
