import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Teacher } from '../models/teacher.model';

@Injectable({ providedIn: 'root' })
export class TeacherService {
  private apiUrl = '/api/teachers';

  constructor(private http: HttpClient) {}

  // Public
  getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.apiUrl);
  }

  getTeacherById(id: string): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.apiUrl}/${id}`);
  }

  // Protected
  saveProfile(profile: Teacher): Observable<Teacher> {
    return this.http.post<Teacher>(`${this.apiUrl}/profile`, profile);
  }

  // New helper: get current logged-in teacher profile
  getMyProfile(): Observable<Teacher> {
    return this.http.get<{ teacherId: string }>('/api/auth/me').pipe(
      switchMap((me) => this.getTeacherById(me.teacherId))
    );
  }

}
