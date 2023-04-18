import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class AccessTokenService {
  private apiUrl = '/api/spotify/auth';

  constructor(private http: HttpClient) {}

  getAccessToken(): Observable<String> {
    return this.http.get<String>(this.apiUrl);
  }
}
