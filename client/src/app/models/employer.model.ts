import { User } from "./user.model";

export interface Employer {
  _id?: string;
  user?: User;

  // Unlock logic
  points?: number;
  unlockedTeachers?: string[]; // optional convenience

  // 1. Basic Identity
  name: string;
  // logoUrl?: string;
  type: "Kindergarten" | "Cram School" | "International School" | "University" | "Online Platform" | "Corporate Training";
  website?: string;

  // ✅ Add new fields
  images: string[];
  coverImage?: string;

  // 2. Location
  location: {
    mainAddress: string;
    // branches: string[];
    onlineOnly: boolean;
  };

  // 3. Contact
  contact: {
    personName: string;
    position: string;
    email: string;
    phone: string;
    verified: boolean;
  };

  // 4. About the Organization
  about: {
    description: string;
    yearEstablished: number;
    numberOfStudents: number;
    numberOfForeignTeachers: number;
  };

  // 5. Hiring Preferences
  hiringPreferences: {
    typicalSubjects: string[];
    employmentTypes: ("Full-time" | "Part-time" | "Hourly" | "Online")[];
    visaSponsorship: boolean;
  };

  // 6. Job Postings (future)
  jobPostings: string[];

  createdAt?: string;
  updatedAt?: string;
}
