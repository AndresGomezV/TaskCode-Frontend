import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {SidebarComponent} from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-users',
  imports: [
    RouterOutlet,
    SidebarComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

}
