// client/src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/api/auth'; // proxy to Firebase function

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post<{ token: string; role: string; name: string }>(
      `${this.apiUrl}/login`,
      { email, password }
    ).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('name', res.name);
      })
    );
  }

  register(name: string, email: string, password: string, role: string) {
    return this.http.post(`${this.apiUrl}/register`, { name, email, password, role });
  }

  logout() {
    localStorage.clear();
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  getRole() {
    return localStorage.getItem('role');
  }

  getUserName() {
    return localStorage.getItem('name');
  }
}
