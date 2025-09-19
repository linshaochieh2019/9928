import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { TeacherService } from '../../services/teacher.service';
import { Teacher } from '../../models/teacher.model';
import { EmployerService } from '../../services/employer.service';
import { Employer } from '../../models/employer.model';


@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.html',
  styleUrls: ['./landing.scss']
})
export class LandingComponent {

  teachers: Teacher[] = [];
  employers: Employer[] = [];

  constructor(public authService: AuthService, private router: Router, private teacherService: TeacherService, private employerService: EmployerService) { }

  ngOnInit(): void {
    this.teacherService.getTeachers().subscribe({
      next: (data) => {
        this.teachers = data
        // this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching teachers:', err);
        // this.loading = false;
      },
    });

    this.employerService.listEmployers().subscribe({
      next: (data) => {
        this.employers = data;
      },
      error: () => {
        console.error('Error fetching employers');
      }
    });

  }

  goToMyProfile() {

    // Check user logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Check user role
    const user = this.authService.getUser();
    if (!user?.role) {
      this.router.navigate(['/choose-role']);
      return;
    }

    // Navigate to profile based on role
    const teacherId = this.authService.getTeacherId();
    const employerId = this.authService.getEmployerId();
    if (teacherId) {
      this.router.navigate(['/teachers', teacherId]);
    } else if (employerId) {
      this.router.navigate(['/employers', employerId]);
    } else {
      console.warn('No profile found for this user');
    }
  }

}
