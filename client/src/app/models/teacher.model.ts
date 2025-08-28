import { User } from "./user.model";

export interface Teacher {
  _id?: string;
  user?: User;
  bio?: string;
  subjects?: string[];
  experience?: number;
  hourlyRate?: number;
  availability?: string;
}
