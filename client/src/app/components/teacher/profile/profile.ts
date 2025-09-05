import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TeacherService } from '../../../services/teacher.service';
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
    private teacherService: TeacherService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
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
    } else {
      this.loading = false;
    }
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
}
