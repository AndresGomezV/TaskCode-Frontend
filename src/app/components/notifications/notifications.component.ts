import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {NotificationService} from '../../services/notification.service';
import {Notification} from '../../model/notification.model';
import {DatePipe, NgClass, NgStyle} from '@angular/common';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-notifications',
  imports: [
    DatePipe,
    NgStyle,
    NgClass
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {

  private authService: AuthService = inject(AuthService);
  private notificationsService: NotificationService = inject(NotificationService);
  userRole = this.authService.getUserRole();
  @Input() modalPosition: { top: number, left: number } = { top: 0, left: 0 };
  @Output() close = new EventEmitter();
  @Output() updateUnreadCount = new EventEmitter<number>();
  notifications: Notification[] = []

  updateUnreadNotifications() {
    const unreadCount = this.notifications.filter(n => !n.isRead).length;
    this.updateUnreadCount.emit(unreadCount);
  }

  closeModal() {
    this.updateUnreadNotifications()
    this.close.emit();

  }

  markAsRead(notification: Notification) {
    if (notification.isRead) return;
    this.notificationsService.markAsRead(notification.id!!).subscribe({
      next: () => {
        notification.isRead = true;
        this.updateUnreadNotifications()
      },
      error: (err) => console.error(err)
    });
  }


  ngOnInit() {
    this.notificationsService.getNotificationsByUserId().subscribe({
      next: notifications => {
        this.notifications = notifications;
      },
      error: (err) => console.error('Error fetching notifications:', err)
    })
  }
}
