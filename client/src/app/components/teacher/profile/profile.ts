import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TeacherService } from '../../../services/teacher.service'; 
import { Teacher } from '../../../models/teacher.model'


@Component({
  selector: 'app-teacher-profile',
  templateUrl: './profile.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProfileComponent implements OnInit {
  teacher: Teacher = {};

  constructor(private teacherService: TeacherService) {}

  ngOnInit(): void {
    this.teacherService.getProfile().subscribe({
      next: (data) => (this.teacher = data),
      error: () => {
        this.teacher = {}; // if no profile yet
      },
    });
  }

  saveProfile() {
    this.teacherService.saveProfile(this.teacher).subscribe({
      next: (data) => {
        this.teacher = data;
        alert('Profile saved!');
      },
      error: (err) => {
        console.error(err);
        alert('Error saving profile');
      },
    });
  }
}
