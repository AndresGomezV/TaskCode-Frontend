import {Component, inject, OnInit} from '@angular/core';
import {NotificationService} from '../../services/notification.service';
import {Notification} from '../../model/notification.model';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-notifications',
  imports: [
    DatePipe
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {
  private notificationsService: NotificationService = inject(NotificationService);

  notifications: Notification[] = []

  ngOnInit() {
    this.notificationsService.getNotificationsByUserId().subscribe({
      next: notification => {
        this.notifications = notification;
      }
    })
  }
}
