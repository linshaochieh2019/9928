// client/src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/api/auth'; // proxy to Firebase function

  // private currentUser: any;
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable(); // 👈 expose observable

  // Call this once on app startup
  constructor(private http: HttpClient) {
    const token = this.getToken();
    if (token) {
      this.fetchMe().subscribe({
        error: () => {
          // If token is invalid, clear it
          this.logout();
        }
      });
    }
  }

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

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  register(name: string, email: string, password: string, role: string) {
    return this.http.post(`${this.apiUrl}/register`, { name, email, password, role });
  }

  logout() {
    localStorage.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  // Password reset
  forgotPassword(email: string) {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, password: string) {
    return this.http.post(`${this.apiUrl}/reset-password/${token}`, { password });
  }

  // Fetch current user profile
  fetchMe() {
    return this.http.get<any>(`${this.apiUrl}/me`).pipe(
      tap(user => {
        this.currentUserSubject.next(user); // 👈 notify all subscribers
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

  // Getters
  getUser() {
    return this.currentUserSubject.value || JSON.parse(localStorage.getItem('user') || '{}');
  }

  getUserId(): string | null {
    return this.getUser()?.userId || localStorage.getItem('userId');
  }

  getTeacherId(): string | null {
    return this.getUser()?.teacherId || localStorage.getItem('teacherId');
  }

  getEmployerId(): string | null {
    return this.getUser()?.employerId || localStorage.getItem('employerId');
  }

  getRole(): string | null {
    return this.getUser()?.role || localStorage.getItem('role');
  }

  getUserName(): string | null {
    return this.getUser()?.name || localStorage.getItem('name');
  }



}
