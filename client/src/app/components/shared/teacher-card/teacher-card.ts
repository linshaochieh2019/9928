import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-teacher-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './teacher-card.html',
  styleUrls: ['./teacher-card.scss']
})
export class TeacherCardComponent {
  @Input() teacher: any;
  @Input() showExperience: boolean = true; // toggle if needed
  @Input() photoHeight: number = 250;      // customizable image height
}
