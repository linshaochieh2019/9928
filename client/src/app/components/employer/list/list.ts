import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployerService } from '../../../services/employer.service';
import { Employer } from '../../../models/employer.model';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employer-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list.html',
  styleUrls: ['./list.scss']
})
export class EmployerListComponent implements OnInit {
  employers: Employer[] = [];
  loading = true;
  error: string | null = null;
  searchTerm: string = '';


  constructor(private employerService: EmployerService) { }

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

  get filteredEmployers() {
    if (!this.searchTerm.trim()) {
      return this.employers;
    }
    const term = this.searchTerm.toLowerCase();
    return this.employers.filter(e =>
      e.name?.toLowerCase().includes(term) ||
      e.type?.toLowerCase().includes(term) ||
      e.location?.mainAddress?.toLowerCase().includes(term)
    );
  }
}
