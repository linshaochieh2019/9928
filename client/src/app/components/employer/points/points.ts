import { Component, OnInit } from '@angular/core';
import { PointsService } from '../../../services/points';
import { AuthService } from '../../../services/auth';
import { DatePipe, NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-points',
  standalone: true,
  templateUrl: './points.html',
  imports: [NgClass, DatePipe, RouterModule],
})
export class PointsComponent implements OnInit {
  balance = 0;
  transactions: any[] = [];
  loading = true;

  constructor(
    private pointsService: PointsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const employerId = this.authService.getEmployerId(); // This can be null
    if (employerId) {
      this.pointsService.getHistory(employerId).subscribe({
        next: (data) => {
          this.balance = data.balance;
          this.transactions = data.transactions;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      this.loading = false; // No employerId, stop loading
      console.warn('No employer ID found. Cannot fetch points history.');
    }
  }
}
