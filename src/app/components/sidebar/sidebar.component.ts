import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import { AuthService } from "../../services/auth.service";
import {NotificationService} from '../../services/notification.service';
import {Notification} from '../../model/notification.model';
import {NotificationsComponent} from '../notifications/notifications.component';

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

  private notificationsService: NotificationService = inject(NotificationService);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router)
  userRole = this.authService.getUserRole();
  unreadCount = 0;
  notifications: Notification[] = [];
  showModal: boolean = false;
  @ViewChild('bellRef') bellRef!: ElementRef;
  modalPosition = { top: 0, left: 0 };

  openModal(ref: HTMLElement) {
    const rect = ref.getBoundingClientRect();
    this.modalPosition = {
      top: rect.bottom ,
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
    this.notificationsService.getNotificationsByUserId().subscribe({
      next: notification => {
        this.notifications = notification;

        this.unreadCount = this.notifications.filter(notification => !notification.isRead).length;

      }
    })

  }
}
