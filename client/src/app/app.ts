import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing
import { RouterOutlet} from '@angular/router';

// Components and Services
import { PingService } from './services/ping';
import { AuthService } from './services/auth';
import { NavbarComponent } from './components/navbar/navbar';
import { FooterComponent } from './components/footer/footer';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, NavbarComponent, FooterComponent],
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
}
