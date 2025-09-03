import { User } from "./user.model";

export interface Teacher {
  _id?: string;
  user?: User;

  // 1. Basic Identity
  displayName?: string;
  profilePhoto?: string;
  nationality?: string;
  dateOfBirth?: string;
  location?: string;

  // 2. Professional Summary
  bio?: string;
  introVideo?: string;

  // 3. Qualifications
  education?: { degree: string; major: string; institution: string; year: number }[];
  teachingCertifications: { name: string; year: number }[];
  otherCertificates: { name: string; year: number }[];

  // 4. Experience
  yearsExperience?: number;
  workHistory?: { school: string; role: string; country: string; startDate: string; endDate: string }[];

  // 5. Skills & Specializations
  ageGroups: string[];
  subjects: string[];
  languageSkills: { language: string; level: "Basic" | "Conversational" | "Fluent" | "Native" }[];

  // 6. Availability & Preferences
  employmentType: string[];
  preferredLocations: string[];
  preferredLocationOther?: string;
  workVisaStatus?: string;
  availableFrom?: string;

  // 7. Compensation
  expectedRate?: string;

  // 8. Documents & Verification
  resumeUrl?: string;
  degreeCertificates?: string[];
  arcPassport?: string;

  // 9. Trust & Reviews
  references?: string[];
  ratings?: { employer: string; rating: number; comment: string }[];

  createdAt?: string;
}
