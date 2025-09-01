import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { Employer } from '../models/employer.model';


@Injectable({ providedIn: 'root' })
export class EmployerService {
  private apiUrl = '/api/employers';

  constructor(private http: HttpClient) {}

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

  // ✅ New helper: get current logged-in employer profile
  getMyProfile(): Observable<Employer> {
    return this.http.get<{ employerId: string }>('/api/auth/me').pipe(
      switchMap((me) => this.getEmployerById(me.employerId))
    );
  }
}
