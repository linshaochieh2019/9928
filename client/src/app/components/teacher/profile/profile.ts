import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TeacherService } from '../../../services/teacher.service';
import { AuthService } from '../../../services/auth';
import { EmployerService } from '../../../services/employer.service';
import { Teacher } from '../../../models/teacher.model';

@Component({
  selector: 'app-teacher-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
})
export class TeacherProfileComponent implements OnInit {
  // ❌ Removed default object (was overwriting API values)
  // ✅ Use optional Teacher so we can bind with ? operator in template
  teacher?: Teacher;

  loading = true;
  errorMsg = '';
  isEmployer = false;
  employerPoints = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teacherService: TeacherService,
    private employerService: EmployerService,
    private authService: AuthService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.isEmployer = this.authService.getRole() === 'employer';

    if (this.isEmployer) {
      this.employerService.getMyProfile().subscribe({
        next: (profile) => {
          this.employerPoints = profile.points ?? 0;
        },
        error: (err) => console.error('Failed to load employer profile', err),
      });
    }

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) {
        this.loading = false;
        return;
      }
      this.fetchTeacher(id);
    });
  }

  private fetchTeacher(id: string) {
    this.loading = true;
    this.teacherService.getTeacherById(id).subscribe({
      next: (data) => {
        // ✅ Assign API response directly, no merging with defaults
        this.teacher = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load teacher profile', err);
        this.loading = false;
      },
    });
  }

  confirmUnlock() {
    this.unlockContact();
  }

  unlockContact() {
    if (!this.teacher?._id) return;
    this.teacherService.unlockTeacher(this.teacher._id).subscribe({
      next: () => {
        // ✅ Refetch teacher so contact is unmasked
        this.fetchTeacher(this.teacher!._id as string);
      },
      error: (err) => {
        this.errorMsg = err.error?.error || 'Failed to unlock contact';
      },
    });
  }

  getYoutubeEmbedUrl(url?: string | null): SafeResourceUrl {
    if (!url) {
      return '';
    }
    const videoId = this.extractVideoId(url);
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`
    );
  }


  private extractVideoId(url: string): string {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  }

  isOwner(): boolean {
    const teacherUserId =
      typeof this.teacher?.user === 'string'
        ? this.teacher.user
        : this.teacher?.user?._id;

    const authUserId = this.authService.getUserId();
    return teacherUserId === authUserId;
  }

  goEdit() {
    this.router.navigate(['teacher/my-profile']);
  }

  get hasEnoughPoints(): boolean {
    return this.employerPoints >= 1;
  }

  buyPoints() {
    // TODO: implement later (redirect to payment / open modal)
    console.log("Redirecting to buy points...");
  }
}
