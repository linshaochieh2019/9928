import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../../services/teacher.service';
import { Teacher } from '../../../models/teacher.model';

@Component({
  selector: 'app-teacher-preview',
  templateUrl: './preview.html',
})
export class TeacherPreviewComponent implements OnInit {
  teacher!: Teacher;
  loading = true;

  constructor(private teacherService: TeacherService) {}

  ngOnInit(): void {
    this.teacherService.getMyTeacherProfile().subscribe({
      next: (data) => {
        this.teacher = { ...data }; // pull my profile only
        this.loading = false;
        console.log('Loaded my profile for preview', this.teacher._id);
      },
      error: (err) => {
        console.error('Failed to load my profile', err);
        this.loading = false;
      },
    });
  }
}
