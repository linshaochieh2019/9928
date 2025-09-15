import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PointsService {
  private apiUrl = '/api/points';

  constructor(private http: HttpClient) {}

  getHistory(employerId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/history/${employerId}`);
  }
}
