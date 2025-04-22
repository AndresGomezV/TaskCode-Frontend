import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {NotificationService} from '../../services/notification.service';
import {Notification} from '../../model/notification.model';
import {DatePipe, NgStyle} from '@angular/common';

@Component({
  selector: 'app-notifications',
  imports: [
    DatePipe,
    NgStyle
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {
  private notificationsService: NotificationService = inject(NotificationService);
  @Input() modalPosition: { top: number, left: number } = { top: 0, left: 0 };
  @Output() close = new EventEmitter();

  notifications: Notification[] = []

  closeModal() {

    this.close.emit();
  }

  ngOnInit() {
    this.notificationsService.getNotificationsByUserId().subscribe({
      next: notification => {
        this.notifications = notification;
      }
    })
  }
}
