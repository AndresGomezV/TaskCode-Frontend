import { Component, inject } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router)


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
