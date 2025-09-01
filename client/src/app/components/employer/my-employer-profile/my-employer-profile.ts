import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employer } from '../../../models/employer.model';
import { EmployerService } from '../../../services/employer.service';

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
    logoUrl: '',
    type: 'Cram School',
    website: '',
    location: { mainAddress: '', branches: [], onlineOnly: false },
    contact: { personName: '', position: '', email: '', phone: '', verified: false },
    about: { description: '', yearEstablished: 0, numberOfStudents: 0, numberOfForeignTeachers: 0 },
    hiringPreferences: { typicalSubjects: [], employmentTypes: [], visaSponsorship: false },
    jobPostings: []
  };

  loading = true;

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

  constructor(private employerService: EmployerService) { }

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
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load employer profile', err);
        this.loading = false;
      },
    });
  }

  saveProfile(): void {
    this.employerService.createOrUpdate(this.employer).subscribe({
      next: () => alert('Employer profile saved!'),
      error: (err) => alert('Error saving profile: ' + err.message),
    });
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

  addBranch(): void {
    this.employer.location.branches.push('');
  }

  removeBranch(index: number): void {
    this.employer.location.branches.splice(index, 1);
  }
}
