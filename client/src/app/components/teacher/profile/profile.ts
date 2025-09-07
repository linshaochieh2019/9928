import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TeacherService } from '../../../services/teacher.service';
import { AuthService } from '../../../services/auth';
import { Teacher } from '../../../models/teacher.model';

@Component({
  selector: 'app-teacher-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
})
export class TeacherProfileComponent implements OnInit {
  teacher: Teacher = {
    // minimal safe defaults so template never breaks
    displayName: '',
    phone: '',
    contactEmail: '',
    locked: true,
    profilePhoto: '',
    nationality: '',
    location: '',
    age: 0,
    headline: '',
    bio: '',
    introVideo: '',
    education: [],
    teachingCertifications: [],
    otherCertificates: [],
    yearsExperience: 0,
    workHistory: [],
    subjects: '',
    ageGroups: [],
    languageSkills: [],
    employmentType: [],
    preferredLocations: [],
    preferredLocationOther: '',
    workVisaStatus: '',
    availableFrom: '',
    expectedRate: ''
  };

  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teacherService: TeacherService,
    private authService: AuthService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    // Subscribe to route params to get teacher ID
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (!id) {
        this.loading = false;
        return;
      }

      this.loading = true;

      // Fetch teacher profile by ID 
      this.teacherService.getTeacherById(id).subscribe({
        next: (data) => {
          console.log('Loaded teacher profile:', data); // 👈 Debug log
          this.teacher = {
            ...this.teacher, // keep defaults
            ...data          // overwrite with API values
          };
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load teacher profile', err);
          this.loading = false;
        },
      });
    });
  }


  getYoutubeEmbedUrl(url: string): SafeResourceUrl {
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

    console.log('Comparing teacher user ID', teacherUserId, 'with auth user ID', authUserId);

    return teacherUserId === authUserId;
  }

  goEdit() {
    this.router.navigate(['teacher/my-profile']);
  }

}
