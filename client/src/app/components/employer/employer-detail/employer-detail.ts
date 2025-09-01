import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployerService } from '../../../services/employer.service';
import { Employer } from '../../../models/employer.model';

@Component({
  selector: 'app-employer-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employer-detail.html'
})
export class EmployerDetailComponent implements OnInit {
  employer?: Employer;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private employerService: EmployerService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
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
