import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import { AuthService } from "../../services/auth.service";
import {NotificationService} from '../../services/notification.service';
import {Notification} from '../../model/notification.model';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

  private notificationsService: NotificationService = inject(NotificationService);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router)
  userRole = this.authService.getUserRole();
  unreadCount = 0;
  notifications: Notification[] = [];
  showModal: boolean = false;

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.notificationsService.getNotificationsByUserId().subscribe({
      next: notification => {
        this.notifications = notification;

        this.unreadCount = this.notifications.filter(notification => !notification.isRead).length;

      }
    })

  }
}
