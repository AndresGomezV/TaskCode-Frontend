import {Component, inject} from '@angular/core';

import {SidebarComponent} from '../../components/sidebar/sidebar.component';
import { DashboardStatsComponent } from '../dashboard-stats/dashboard-stats.component';


@Component({
  selector: 'app-dashboard',
  imports: [
    SidebarComponent,
    DashboardStatsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
