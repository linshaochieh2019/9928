import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';
import { Teacher } from '../../../models/teacher.model';
import { TeacherService } from '../../../services/teacher.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-profile.html',
  styleUrls: ['./my-profile.scss']
})
export class MyProfileComponent implements OnInit {
  // initialize teacher so it's never undefined
  teacher: Teacher = {
    // 1. Basic Identity
    displayName: '',
    profilePhoto: '',
    nationality: '',
    age: 0,
    location: '',
    headline: '',

    // 2. Professional Summary
    bio: '',
    introVideo: '',

    // 3. Qualifications
    education: [],
    teachingCertifications: [],
    otherCertificates: [],

    // 4. Experience
    yearsExperience: 0,
    workHistory: [],

    // 5. Skills & Specializations
    ageGroups: [],
    subjects: '',
    languageSkills: [],

    // 6. Availability & Preferences
    employmentType: [],
    preferredLocations: [],
    workVisaStatus: '',
    availableFrom: '',

    // 7. Compensation
    expectedRate: '',
  };

  // local form helpers for comma-separated fields
  certs = '';
  otherCerts = '';
  specialPrograms = '';
  ageGroups = '';
  subjects = '';
  languages = '';
  employmentType = '';
  preferredLocations = '';
  availableFromChoice: string = ''; // 'immediately' | 'date'


  // loading state
  loading = true;

  // age group options
  ageGroupOptions = [
    "Preschool / Kindergarten (3–6 yrs)",
    "Elementary (6–12 yrs)",
    "Junior High (12–15 yrs)",
    "Senior High (15–18 yrs)",
    "University / College",
    "Adults (General English)",
    "Adults (Business / Professional English)",
    "Special Needs Education",
    "Test Prep Students (IELTS, TOEFL, TOEIC, SAT, etc.)"
  ];

  // Common languages & levels
  commonLanguages = [
    "English", "Mandarin Chinese", "Japanese", "Korean",
    "French", "German", "Spanish", "Italian", "Vietnamese", "Thai",
    "Indonesian", "Filipino (Tagalog)", "Other"
  ];
  levels = ["Basic", "Conversational", "Fluent", "Native"];

  // Employment Type Options
  employmentTypeOptions = [
    "Full-time",
    "Part-time",
    "Hourly / Tutoring",
    "Online / Remote"
  ];

  // Locations
  locationOptions = [
    "Taipei City",
    "New Taipei City",
    "Taoyuan",
    "Hsinchu",
    "Taichung",
    "Tainan",
    "Kaohsiung",
    "Online (remote teaching)",
    "Other"
  ];

  constructor(private teacherService: TeacherService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.teacherService.getMyTeacherProfile().subscribe({
      next: (data) => {
        this.teacher = { ...this.teacher, ...data }; // preserve defaults

        if (this.teacher.availableFrom === 'immediately') {
          this.availableFromChoice = 'immediately';
        } else if (this.teacher.availableFrom) {
          this.availableFromChoice = 'date';
        }

        this.loading = false;
        console.log('Loaded profile', this.teacher._id);
      },
      error: (err) => {
        console.error('Failed to load my profile', err);
        this.loading = false;
      },
    });
  }

  // Full Update (no longer used)
  saveProfile(): void {
    this.teacherService.saveProfile(this.teacher).subscribe({
      next: () => alert('Profile saved!'),
      error: (err) => alert('Error saving profile: ' + err.message)
    });
  }

  // Router for preview
  goToPreview() {
    const teacherId = this.authService.getTeacherId();
    if (teacherId) {
      this.router.navigate(['/teachers', teacherId]);
    } else {
      console.warn('No teacherId found for current user');
    }
  }

  addEducation(): void {
    (this.teacher.education ??= []).push({
      degree: '',
      major: '',
      institution: '',
      year: new Date().getFullYear()
    });
  }

  removeEducation(index: number): void {
    this.teacher.education.splice(index, 1);
  }


  addWorkHistory(): void {
    (this.teacher.workHistory ??= []).push({
      school: '',
      role: '',
      country: '',
      startDate: '',
      endDate: ''
    });
  }

  removeWorkHistory(index: number): void {
    this.teacher.workHistory.splice(index, 1);
  }


  addTeachingCert(): void {
    (this.teacher.teachingCertifications ??= []).push({
      name: '',
      year: new Date().getFullYear(),
    });
  }

  removeTeachingCert(index: number): void {
    this.teacher.teachingCertifications.splice(index, 1);
  }

  addOtherCert(): void {
    (this.teacher.otherCertificates ??= []).push({ name: '', year: new Date().getFullYear() });
  }

  removeOtherCert(index: number): void {
    this.teacher.otherCertificates.splice(index, 1);
  }

  toggleAgeGroup(option: string): void {
    const index = this.teacher.ageGroups.indexOf(option);
    if (index >= 0) {
      this.teacher.ageGroups.splice(index, 1); // remove if already selected
    } else {
      this.teacher.ageGroups.push(option); // add if not selected
    }
  }

  addLanguageSkill(): void {
    this.teacher.languageSkills.push({ language: "English", level: "Fluent" });
  }

  removeLanguageSkill(index: number): void {
    this.teacher.languageSkills.splice(index, 1);
  }

  toggleEmploymentType(option: string): void {
    this.teacher.employmentType ??= [];
    const index = this.teacher.employmentType.indexOf(option);
    if (index >= 0) {
      this.teacher.employmentType.splice(index, 1); // uncheck
    } else {
      this.teacher.employmentType.push(option); // check
    }
  }

  toggleLocation(option: string): void {
    this.teacher.preferredLocations ??= [];
    const index = this.teacher.preferredLocations.indexOf(option);
    if (index >= 0) {
      this.teacher.preferredLocations.splice(index, 1);
      if (option === "Other") this.teacher.preferredLocationOther = "";
    } else {
      this.teacher.preferredLocations.push(option);
    }
  }

  // Image 
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  updating = false;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.selectedFile = input.files[0];

    // ✅ create a temporary preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewUrl = e.target.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  // Save individual section 
  async saveSection(section: string) {
    let data: any = {};

    switch (section) {
      case 'basic':
        // First upload photo if a new one was selected
        if (this.selectedFile) {
          try {
            const uploaded: any = await this.teacherService.uploadProfilePhoto(
              this.selectedFile,
              this.authService.getUserId()!
            );
            this.teacher.profilePhoto = uploaded.profilePhoto;
            this.selectedFile = null;
            this.previewUrl = null;
          } catch (err) {
            console.error("Photo upload failed", err);
            return; // stop saving if photo failed
          }
        }

        data = {
          displayName: this.teacher.displayName,
          nationality: this.teacher.nationality,
          age: this.teacher.age,
          location: this.teacher.location,
          profilePhoto: this.teacher.profilePhoto,
          headline: this.teacher.headline
        };
        break;

      case 'contact':
        data = {
          phone: this.teacher.phone,
          contactEmail: this.teacher.contactEmail
        };
        break;

      case 'professional':
        data = {
          bio: this.teacher.bio,
          introVideo: this.teacher.introVideo
        };
        break;

      case 'qualifications':
        data = {
          education: this.teacher.education,
          teachingCertifications: this.teacher.teachingCertifications,
          otherCertificates: this.teacher.otherCertificates
        };
        break;

      case 'experience':
        data = {
          yearsExperience: this.teacher.yearsExperience,
          workHistory: this.teacher.workHistory
        };
        break;

      case 'skills':
        data = {
          ageGroups: this.teacher.ageGroups,
          subjects: this.teacher.subjects,
          languageSkills: this.teacher.languageSkills
        };
        break;

      case 'preferences':
        data = {
          employmentType: this.teacher.employmentType,
          preferredLocations: this.teacher.preferredLocations,
          preferredLocationOther: this.teacher.preferredLocationOther,
          workVisaStatus: this.teacher.workVisaStatus,
          availableFrom:
            this.availableFromChoice === 'date'
              ? this.teacher.availableFrom // ISO date string
              : 'immediately'
        };
        break;

      case 'compensation':
        data = { expectedRate: this.teacher.expectedRate };
        break;
    }

    this.teacherService.updateSection(section, data).subscribe({
      next: () => alert(`${section} saved!`),
      error: (err) => alert(`Error saving ${section}: ${err.message}`)
    });
  }

}
