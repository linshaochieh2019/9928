import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-test-connection',
  standalone: true,
  imports: [],
  template: `<p>{{ message }}</p>`,
})
export class TestConnectionComponent implements OnInit {
  message = 'Loading...';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getTest().subscribe({
      next: res => this.message = res.message,
      error: err => this.message = 'Connection failed',
    });
  }
}
