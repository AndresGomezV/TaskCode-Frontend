import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) { }

  userExists(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-username?username=${username}`);
  }

  register(username: string, password: string, role?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      username, password, role
    })
  }

  login(username: string, password:string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, {
      username,
      password
    });
  }

  logout():void {
    localStorage.removeItem('token');
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken(); //Devuelve true si hay un token
  }
}
