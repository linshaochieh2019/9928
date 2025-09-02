// client/src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/api/auth'; // proxy to Firebase function
  private currentUser: any;

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(
      `${this.apiUrl}/login`,
      { email, password }
    ).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);

        // After login, fetch /me immediately
        this.fetchMe().subscribe();
      })
    );
  }

  register(name: string, email: string, password: string, role: string) {
    return this.http.post(`${this.apiUrl}/register`, { name, email, password, role });
  }

  logout() {
    localStorage.clear();
    this.currentUser = null;
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  /** ✅ Call this once on app startup */
  fetchMe() {
    return this.http.get<any>(`${this.apiUrl}/me`).pipe(
      tap(user => {
        this.currentUser = user;
        localStorage.setItem('userId', user.userId);
        localStorage.setItem('teacherId', user.teacherId ?? '');
        localStorage.setItem('employerId', user.employerId ?? '');
        localStorage.setItem('role', user.role);
        localStorage.setItem('name', user.name);
      })
    );
  }

  // Getters for user info
  getUser() {
    return this.currentUser;
  }

  getUserId() {
    return this.currentUser?.userId || localStorage.getItem('userId');
  }

  getTeacherId() {
    return this.currentUser?.teacherId || localStorage.getItem('teacherId');
  }

  getEmployerId() {
    return this.currentUser?.employerId || localStorage.getItem('employerId');
  }

  getRole() {
    return this.currentUser?.role || localStorage.getItem('role');
  }

  getUserName() {
    return this.currentUser?.name || localStorage.getItem('name');
  }

}
