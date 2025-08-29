import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TeacherService } from '../../../services/teacher.service';
import { Teacher } from '../../../models/teacher.model';

@Component({
  selector: 'app-teacher-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
})
export class TeacherProfileComponent implements OnInit {
  teacher?: Teacher;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private teacherService: TeacherService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.teacherService.getTeacherById(id).subscribe({
        next: (data) => {
          this.teacher = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load teacher profile', err);
          this.loading = false;
        },
      });
    } else {
      this.loading = false;
    }
  }
}
