import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';
import { Teacher } from '../../../models/teacher.model';
import { TeacherService } from '../../../services/teacher.service';
import { FormsModule } from '@angular/forms';

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
    dateOfBirth: '',
    location: '',

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
    subjects: [],
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

  // subject groups
  subjectGroups = [
    {
      category: "English / Language",
      options: [
        "General English (ESL/EFL)",
        "Phonics / Early Reading",
        "Grammar / Writing",
        "Conversation / Speaking",
        "Business English",
        "Academic English (University prep, essays, presentations)",
        "Exam Prep: IELTS / TOEFL / TOEIC",
        "Exam Prep: Cambridge (KET, PET, FCE, CAE, CPE)"
      ]
    },
    {
      category: "Other Languages",
      options: [
        "Japanese",
        "Korean",
        "French",
        "German",
        "Spanish",
        "Italian",
        'Russian',
        "Vietnamese",
        "Indonesian",
      ]
    },

    {
      category: "Math",
      options: ["Elementary Math", "Secondary / High School Math"]
    },
    {
      category: "Science",
      options: ["General Science", "Physics", "Chemistry", "Biology"]
    },
    {
      category: "Social Studies / Humanities",
      options: ["History", "Geography", "Civics / Social Studies"]
    },
    {
      category: "Technology",
      options: ["Computer Science / Coding", "STEM / Robotics"]
    },
    {
      category: "Arts",
      options: ["Visual Arts", "Music", "Drama / Performing Arts"]
    },
    {
      category: "Physical Education",
      options: ["General PE", "Sports Coaching (basketball, soccer, etc.)"]
    }
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

  constructor(private teacherService: TeacherService, private authService: AuthService) { }

  ngOnInit(): void {
    this.teacherService.getMyProfile().subscribe({
      next: (data) => {
        this.teacher = { ...this.teacher, ...data }; // preserve defaults
        this.loading = false;
        console.log('Loaded profile', this.teacher);
      },
      error: (err) => {
        console.error('Failed to load my profile', err);
        this.loading = false;
      },
    });
  }

  saveProfile(): void {
    this.teacherService.saveProfile(this.teacher).subscribe({
      next: () => alert('Profile saved!'),
      error: (err) => alert('Error saving profile: ' + err.message)
    });
  }

  addEducation(): void {
    (this.teacher.education ??= []).push({
      degree: '',
      major: '',
      institution: '',
      year: new Date().getFullYear()
    });
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

  addTeachingCert(): void {
    this.teacher.teachingCertifications.push({
      name: '',
      year: new Date().getFullYear(),
    });
  }

  removeTeachingCert(index: number): void {
    this.teacher.teachingCertifications.splice(index, 1);
  }

  addOtherCert(): void {
    this.teacher.otherCertificates.push({
      name: '',
      year: new Date().getFullYear(),
    });
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

  toggleSubject(option: string): void {
    this.teacher.subjects ??= [];
    const index = this.teacher.subjects.indexOf(option);
    if (index >= 0) {
      this.teacher.subjects.splice(index, 1);
    } else {
      this.teacher.subjects.push(option);
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

  async updatePhoto() {
    console.log("Update button clicked"); // ✅ Debug log
    if (!this.selectedFile) {
      console.warn("No file selected");
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      console.error('No userId found — are you logged in?');
      return;
    } else {
      console.log("Uploading photo for userId:", userId); // ✅ see if correct
    }

    this.updating = true;
    try {
      const updated: any = await this.teacherService.uploadProfilePhoto(this.selectedFile, userId);
      console.log("Upload result:", updated); // ✅ Debug log
      this.teacher.profilePhoto = updated.profilePhoto;
      this.selectedFile = null;
      this.previewUrl = null;
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      this.updating = false;
    }
  }


}
