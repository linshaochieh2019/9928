import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TeacherService } from '../../../services/teacher.service';
import { Teacher } from '../../../models/teacher.model';

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list.html',
  styleUrls: ['./list.scss'],
})
export class TeacherListComponent implements OnInit {
  teachers: Teacher[] = [];
  loading = true;
  page = 1;               // current page
  pageSize = 12;          // teachers per page

  constructor(private teacherService: TeacherService) { }

  ngOnInit(): void {
    this.teacherService.getTeachers().subscribe({
      next: (data) => {
        this.teachers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching teachers:', err);
        this.loading = false;
      },
    });
  }

  contactTeacher(teacher: any) {
    console.log('Contact teacher clicked:', teacher);
    // TODO: open modal / redirect to login / trigger contact flow
  }

  get paginatedTeachers() {
    const start = (this.page - 1) * this.pageSize;
    return this.teachers.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.teachers.length / this.pageSize);
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
