import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TeacherService } from '../../../services/teacher.service';
import { Teacher } from '../../../models/teacher.model';

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list.html',
  styleUrls: ['./list.scss'],
})
export class TeacherListComponent implements OnInit {
  teachers: Teacher[] = [];
  loading = true;
  page = 1;               // current page
  pageSize = 6;          // teachers per page
  searchTerm = '';

  constructor(private teacherService: TeacherService ) { }

  ngOnInit(): void {

    this.teacherService.getTeachers().subscribe({
      next: (data) => {
        this.teachers = this.shuffleArray(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching teachers:', err);
        this.loading = false;
      },
    });
  }

  // Fisher-Yates shuffle
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Filtering logic
  get filteredTeachers() {
    if (!this.searchTerm.trim()) {
      return this.teachers;
    }
    const term = this.searchTerm.toLowerCase();
    return this.teachers.filter(t =>
      t.displayName?.toLowerCase().includes(term) ||
      t.location?.toLowerCase().includes(term) ||
      t.nationality?.toLowerCase().includes(term) ||
      t.subjects?.toLowerCase().includes(term)
    );
  }

  // Pagination logic
  get paginatedTeachers() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredTeachers.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredTeachers.length / this.pageSize);
  }

  // Generate array [1, 2, ..., totalPages]
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
    }
  }

}
