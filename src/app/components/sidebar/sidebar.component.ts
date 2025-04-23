import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from "../../services/auth.service";
import {NotificationService} from '../../services/notification.service';
import {Notification} from '../../model/notification.model';
import {NotificationsComponent} from '../notifications/notifications.component';
import {WebsocketService} from '../../services/websocket.service';
declare const M: any;

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive,
    NotificationsComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

  private websocketService: WebsocketService = inject(WebsocketService);
  private notificationsService: NotificationService = inject(NotificationService);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router)
  userRole = this.authService.getUserRole();
  unreadCount = 0;
  notifications: Notification[] = [];
  showModal: boolean = false;
  @ViewChild('bellRef') bellRef!: ElementRef;
  modalPosition = {top: 0, left: 0};

  openModal(ref: HTMLElement) {
    const rect = ref.getBoundingClientRect();
    this.modalPosition = {
      top: rect.bottom,
      left: rect.left + rect.width
    };
    this.showModal = true;
  }

  closeModal() {

    this.showModal = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.websocketService.connect(userId);
    }
    this.websocketService.notifications$.subscribe((notification: Notification) => {
      const exists = this.notifications.some(n => n.id === notification.id);

      if (!exists) {
        this.notifications.unshift(notification);
      }

      let message = '';
      let toastClass = '';
      switch (notification.notificationType) {
        case "TASK_PENDING":
          message = `🔔 ${notification.senderUsername} created task "${notification.taskTitle}"`;
          toastClass = 'deep-purple darken-1 white-text rounded';
          break;
        case "TASK_ACCEPTED":
          message = `🔔 Your task "${notification.taskTitle}" was ACCEPTED by ${notification.senderUsername}`;
          toastClass = 'green darken-1 white-text rounded';
          break;
        case "TASK_REJECTED":
          message = `🔔 Your task "${notification.taskTitle}" was REJECTED by ${notification.senderUsername}`;
          toastClass = 'red darken-1 white-text rounded';
      }

      M.toast({
        html: message,
        displayLength: 5000,
        classes: toastClass
      });


      this.unreadCount = this.notifications.filter(n => !n.isRead).length;
    });

    this.notificationsService.getNotificationsByUserId().subscribe({
      next: notification => {
        this.notifications = notification;

        this.unreadCount = this.notifications.filter(notification => !notification.isRead).length;
      }
    })
  }

  updateUnreadCount(newCount: number) {
    this.unreadCount = newCount;
  }

  protected readonly event = event;
}
