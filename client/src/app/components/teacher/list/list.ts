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
})
export class TeacherListComponent implements OnInit {
  teachers: Teacher[] = [];
  loading = true;

  constructor(private teacherService: TeacherService) {}

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
}
