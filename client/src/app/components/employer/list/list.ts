import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployerService } from '../../../services/employer.service';
import { Employer } from '../../../models/employer.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-employer-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list.html'
})
export class EmployerListComponent implements OnInit {
  employers: Employer[] = [];
  loading = true;
  error: string | null = null;

  constructor(private employerService: EmployerService) {}

  ngOnInit() {
    this.employerService.listEmployers().subscribe({
      next: (data) => {
        this.employers = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load employers';
        this.loading = false;
      }
    });
  }
}
