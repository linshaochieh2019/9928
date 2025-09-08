import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Teacher } from '../models/teacher.model';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

@Injectable({ providedIn: 'root' })
export class TeacherService {
  private apiUrl = '/api/teachers';

  constructor(private http: HttpClient) { }

  // Public
  getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.apiUrl);
  }

  // ✅ Get current logged-in teacher profile
  getMyTeacherProfile(): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.apiUrl}/me`);
  }

  // ✅ Get teacher by ID
  getTeacherById(id: string): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.apiUrl}/${id}`);
  }

  // Protected
  saveProfile(profile: Teacher): Observable<Teacher> {
    return this.http.post<Teacher>(`${this.apiUrl}/profile`, profile);
  }

  // Upload profile photo
  async uploadProfilePhoto(file: File, userId: string) {
    const storage = getStorage();
    const path = `teachers/${userId}/profile-photo.jpg`;
    const storageRef = ref(storage, path);

    // Upload to Firebase
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Save URL to backend
    return this.http.put('/api/teachers/me/profile-photo', { profilePhoto: downloadURL }).toPromise();
  }

  // Update specific section of the profile
  updateSection(section: string, data: any) {
    return this.http.patch(`/api/teachers/me/${section}`, data);
  }

}
