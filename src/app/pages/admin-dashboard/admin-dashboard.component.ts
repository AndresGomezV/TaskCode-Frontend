import { Component, inject, OnInit } from '@angular/core';
import {SidebarComponent} from '../../components/sidebar/sidebar.component';
import {RouterOutlet} from '@angular/router';
import {TaskService} from '../../services/task.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    SidebarComponent,
    RouterOutlet
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit{
  private taskService = inject(TaskService);

  totalTasks = 0
  acceptedTasks = 0
  rejectedTasks = 0
  pendingTasks = 0
  username = localStorage.getItem('username');

  getTasks(userId? : number, status?: string) {
    this.taskService.getTasks({userId, status}).subscribe({
      next: tasks => {
        this.totalTasks = tasks.length;
        this.acceptedTasks = tasks.filter(task => task.status === 'ACCEPTED').length
        this.rejectedTasks = tasks.filter(task => task.status === 'REJECTED').length
        this.pendingTasks = tasks.filter(task => task.status === 'PENDING').length
      },
      error: error => {
        console.error("Error fetching tasks", error);
      }

    })
  }

  ngOnInit() {
    this.getTasks()
  }
}
