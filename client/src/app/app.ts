import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PingService } from './services/ping';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
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
