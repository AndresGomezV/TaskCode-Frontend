import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Notification} from '../model/notification.model';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:8082/notifications';

  constructor(private http: HttpClient) { }

  getNotificationsByUserId(): Observable<Notification[]> {
    const userId = this.authService.getUserId();

    return this.http.get<Notification[]>(`${this.apiUrl}/${userId}`);
  }

}
