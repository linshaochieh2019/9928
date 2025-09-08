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
    // this.currentUser = null;
    this.currentUserSubject.next(null);
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  // /** ✅ Call this once on app startup */
  // fetchMe() {
  //   return this.http.get<any>(`${this.apiUrl}/me`).pipe(
  //     tap(user => {
  //       this.currentUser = user;
  //       localStorage.setItem('userId', user.userId);
  //       localStorage.setItem('teacherId', user.teacherId ?? '');
  //       localStorage.setItem('employerId', user.employerId ?? '');
  //       localStorage.setItem('role', user.role);
  //       localStorage.setItem('name', user.name);
  //     })
  //   );
  // }

  fetchMe() {
    return this.http.get<any>(`${this.apiUrl}/me`).pipe(
      tap(user => {
        this.currentUserSubject.next(user); // 👈 notify all subscribers
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

  // // Getters for user info
  // getUser() {
  //   if (!this.currentUser) {
  //     this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  //   }
  //   return this.currentUser;
  // }

  // getUserId() {
  //   return this.currentUser?.userId || localStorage.getItem('userId');
  // }

  // getTeacherId() {
  //   return this.currentUser?.teacherId || localStorage.getItem('teacherId');
  // }

  // getEmployerId() {
  //   return this.currentUser?.employerId || localStorage.getItem('employerId');
  // }

  // getRole() {
  //   return this.currentUser?.role || localStorage.getItem('role');
  // }

  // getUserName() {
  //   return this.currentUser?.name || localStorage.getItem('name');
  // }

  // Still keep sync accessors for convenience
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
