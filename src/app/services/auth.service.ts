import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/users/login';

  constructor(private http: HttpClient) { }

  login(username: string, password:string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.apiUrl, {
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
