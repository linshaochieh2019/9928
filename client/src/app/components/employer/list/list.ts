import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployerService } from '../../../services/employer';
import { Employer } from '../../../models/employer.model';

@Component({
  selector: 'app-employer-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.html',
  styleUrls: ['./list.scss']
})
export class EmployerListComponent implements OnInit {
  employers: Employer[] = [];
  loading = true;
  error = '';

  constructor(private employerService: EmployerService) {}

  ngOnInit(): void {
    this.employerService.getEmployers().subscribe({
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
