import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employer } from '../../../models/employer.model';
import { EmployerService } from '../../../services/employer.service';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-employer-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-employer-profile.html',
})
export class MyEmployerProfileComponent implements OnInit {
  // ✅ initialize employer with strong defaults
  employer: Employer = {
    name: '',
    type: 'Cram School',
    website: '',
    images: [],              // 👈 always defined
    coverImage: '',
    location: { mainAddress: '', onlineOnly: false },
    contact: { personName: '', position: '', email: '', phone: '', verified: false },
    about: { description: '', yearEstablished: 0, numberOfStudents: 0, numberOfForeignTeachers: 0 },
    hiringPreferences: { typicalSubjects: [], employmentTypes: [], visaSponsorship: false },
    jobPostings: []
  };

  // loading state
  loading = true;

  // verification status
  email: string | null = null;
  isVerified: boolean | null = null;


  typeOptions = [
    'Kindergarten',
    'Cram School',
    'International School',
    'University',
    'Online Platform',
    'Corporate Training',
  ];

  employmentTypeOptions: ("Full-time" | "Part-time" | "Hourly" | "Online")[] = [
    "Full-time",
    "Part-time",
    "Hourly",
    "Online"
  ];

  constructor(private employerService: EmployerService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.employerService.getMyProfile().subscribe({
      next: (data) => {
        this.employer = {
          ...this.employer,
          ...data,
          location: {
            ...this.employer.location,
            ...data.location
          },
          contact: {
            ...this.employer.contact,
            ...data.contact
          },
          about: {
            ...this.employer.about,
            ...data.about
          },
          hiringPreferences: {
            ...this.employer.hiringPreferences,
            ...data.hiringPreferences
          }
        };

        // Get verification status from AuthService
        const user = this.authService.getUser();
        this.email = user?.email ?? null;
        this.isVerified = user?.isVerified ?? null;

        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load employer profile', err);
        this.loading = false;
      },
    });
  }

  goToMyProfile() {
    const employerId = this.authService.getEmployerId();
    if (employerId) {
      this.router.navigate(['/employers', employerId]);
    } else {
      console.warn('No profile found for this user');
    }
  }

  saveProfile(): void {
    this.employerService.createOrUpdate(this.employer).subscribe({
      next: () => {
        alert('Employer profile saved!');
        this.goToMyProfile(); // ✅ redirect with profile-specific logic
      },
      error: (err) => alert('Error saving profile: ' + err.message),
    });
  }

  cancel(): void {
    this.goToMyProfile(); // ✅ redirect with profile-specific logic
  }

  toggleEmploymentType(option: string): void {
    this.employer.hiringPreferences ??= { typicalSubjects: [], employmentTypes: [], visaSponsorship: false };
    const list = this.employer.hiringPreferences.employmentTypes ?? [];
    const index = list.indexOf(option as "Full-time" | "Part-time" | "Hourly" | "Online");
    if (index >= 0) {
      list.splice(index, 1);
    } else {
      list.push(option as "Full-time" | "Part-time" | "Hourly" | "Online");
    }
  }

  // Image handling
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.selectedFile = input.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewUrl = e.target.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  async uploadImage() {
    if (!this.selectedFile) return;

    // ✅ prevent exceeding 4 images
    if (this.employer.images && this.employer.images.length >= 4) {
      alert('You can only upload up to 4 images.');
      return;
    }

    // Get user ID from AuthService
    const userId = this.authService.getUserId();
    if (!userId) return;

    const updated: any = await this.employerService.uploadImage(this.selectedFile, userId);
    this.employer = updated;
    this.selectedFile = null;
    this.previewUrl = null;
  }

  setCover(imageUrl: string) {
    this.employerService.setCoverImage(imageUrl).subscribe((updated: any) => {
      this.employer = updated;
    });
  }

  removeImage(imgUrl: string) {
    if (!confirm('Are you sure you want to remove this image?')) return;

    this.employerService.removeImage(imgUrl).subscribe({
      next: (updated: any) => {
        this.employer = updated;
      },
      error: (err) => {
        alert('Error removing image: ' + err.message);
      }
    });
  }

  // Resend verification email
  message: string | null = null;
  resendVerification() {
    const email = this.authService.getUser()?.email;
    if (!email) return;

    this.authService.resendVerification(email).subscribe({
      next: () => this.message = '📩 A new verification email has been sent.',
      error: err => this.message = err.error?.message || '❌ Failed to send email.'
    });
  }

}
