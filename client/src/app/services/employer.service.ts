import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employer } from '../models/employer.model';
import { UnlockLog } from '../models/unlocklog.model';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


@Injectable({ providedIn: 'root' })
export class EmployerService {
  private apiUrl = '/api/employers';

  constructor(private http: HttpClient) { }

  // ✅ Create or update profile
  createOrUpdate(profile: Employer): Observable<Employer> {
    return this.http.post<Employer>(`${this.apiUrl}/profile`, profile);
  }

  // ✅ Public: get employer by id
  getEmployerById(id: string): Observable<Employer> {
    return this.http.get<Employer>(`${this.apiUrl}/${id}`);
  }

  // ✅ Public: list all employers
  listEmployers(): Observable<Employer[]> {
    return this.http.get<Employer[]>(this.apiUrl);
  }

  // ✅ Directly fetch current logged-in employer profile
  getMyProfile(): Observable<Employer> {
    return this.http.get<Employer>(`${this.apiUrl}/me`);
  }

  // Upload new image
  async uploadImage(file: File, userId: string) {
    const storage = getStorage();
    const path = `employers/${userId}/images/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    return this.http.put('/api/employers/me/images', { imageUrl: downloadURL }).toPromise();
  }

  removeImage(imageUrl: string): Observable<Employer> {
    return this.http.post<Employer>(`${this.apiUrl}/remove-image`, { imageUrl });
  }

  // Set cover image
  setCoverImage(imageUrl: string) {
    return this.http.put('/api/employers/me/cover-image', { imageUrl });
  }

  // Get all unlocked teachers for the logged-in employer
  getMyUnlocks(): Observable<UnlockLog[]> {
    return this.http.get<UnlockLog[]>(`${this.apiUrl}/me/unlocks`);
  }

  // Update publish status
  updatePublishStatus(isPublished: boolean) {
    return this.http.patch<{ success: boolean; isPublished: boolean }>(
      `/api/employers/me/publish`,
      { isPublished }
    );
  }


}
