import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';
import { EmployerService } from '../../../services/employer.service';
import { Employer } from '../../../models/employer.model';

@Component({
  selector: 'app-employer-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employer-detail.html'
})
export class EmployerDetailComponent implements OnInit {
  employer?: Employer;
  loading = true;
  error: string | null = null;
  isMyProfile = false; // to toggle edit options if needed

  constructor(
    private route: ActivatedRoute,
    private employerService: EmployerService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.fetchEmployer(id);

        this.authService.currentUser$.subscribe((me) => {
          if (me && me.employerId === id) {
            this.isMyProfile = true;
          }
        });
      } else {
        this.error = 'Invalid employer ID';
        this.loading = false;
      }
    });
  }

  private fetchEmployer(id: string): void {
    this.loading = true;
    this.error = null;

    this.employerService.getEmployerById(id).subscribe({
      next: (data) => {
        this.employer = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load employer profile';
        this.loading = false;
      }
    });
  }
}
