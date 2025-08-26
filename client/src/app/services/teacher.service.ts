import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Teacher {
  _id?: string;
  name: string;
  subject?: string;
}

@Injectable({ providedIn: 'root' })
export class TeacherService {
  private baseUrl = '/api/teachers'; // thanks to firebase.json rewrite

  constructor(private http: HttpClient) {}

  getAll(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.baseUrl);
  }

  getOne(id: string): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.baseUrl}/${id}`);
  }

  create(teacher: Teacher): Observable<Teacher> {
    return this.http.post<Teacher>(this.baseUrl, teacher);
  }

  update(id: string, teacher: Teacher): Observable<Teacher> {
    return this.http.put<Teacher>(`${this.baseUrl}/${id}`, teacher);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
