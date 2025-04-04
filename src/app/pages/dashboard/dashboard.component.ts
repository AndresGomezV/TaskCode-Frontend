import {Component, inject} from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Router } from '@angular/router';
import {CalendarComponent} from '../../components/calendar/calendar.component';
import {AdminDashboardComponent} from '../admin-dashboard/admin-dashboard.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CalendarComponent,
    AdminDashboardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  authService = inject(AuthService);
  private router = inject(Router);
  userRole = this.authService.getUserRole();

  selectedDate: string | null = null;

  onDateSelected(date: string) {
    this.selectedDate = date;
  }

}
