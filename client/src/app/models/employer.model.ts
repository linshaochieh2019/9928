import { User } from "./user.model";

export interface Employer {
  _id?: string;
  user?: User;
  companyName: string;
  companyDescription?: string;
  companyWebsite?: string;
  industry?: string;       // e.g. cram school, kindergarten
  location?: string;       // city/region in Taiwan
  size?: number;           // number of employees
  logoUrl?: string;        // optional company logo
  contactPhone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
