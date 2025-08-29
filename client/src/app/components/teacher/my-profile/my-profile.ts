import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Teacher } from '../../../models/teacher.model';
import { TeacherService } from '../../../services/teacher.service';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-profile.html',
})
export class MyProfileComponent implements OnInit {
  teacher?: Teacher;
  loading = true;

  constructor(private teacherService: TeacherService) {}

  ngOnInit(): void {
    this.teacherService.getMyProfile().subscribe({
      next: (data) => {
        this.teacher = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load my profile', err);
        this.loading = false;
      },
    });
  }
}
