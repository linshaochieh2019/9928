export interface UnlockLog {
  _id: string;
  teacher: {
    _id: string;
    displayName: string;
    headline: string;
    profilePhoto?: string;
    nationality?: string;
    location?: string;
    yearsExperience?: number;
  };
  createdAt: string;
}
