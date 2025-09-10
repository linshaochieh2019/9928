import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmployerService } from '../../../services/employer.service';

@Component({
  selector: 'app-unlocked-teachers',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './unlocked-teachers.html',
  styleUrls: ['./unlocked-teachers.scss']
})
export class UnlockedTeachersComponent implements OnInit {
  unlocked: any[] = [];
  loading = true;
  error: string | null = null;

  // pagination
  page = 1;
  pageSize = 3; // show 6 teachers per page
  pages: number[] = [];
  totalPages = 1;

  constructor(private employerService: EmployerService) {}

  ngOnInit() {
    this.loadUnlocked();  // 👈 fetch data when component initializes
  }

  loadUnlocked() {
    this.loading = true;
    this.employerService.getMyUnlocks().subscribe({
      next: (data) => {
        this.unlocked = data;
        this.updatePagination();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load unlocked teachers';
        this.loading = false;
      }
    });
  }

  // computed getter for paginated data
  get paginatedUnlocks() {
    const start = (this.page - 1) * this.pageSize;
    return this.unlocked.slice(start, start + this.pageSize);
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
    }
  }

  private updatePagination() {
    this.totalPages = Math.ceil(this.unlocked.length / this.pageSize) || 1;
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    if (this.page > this.totalPages) this.page = this.totalPages;
  }
}
