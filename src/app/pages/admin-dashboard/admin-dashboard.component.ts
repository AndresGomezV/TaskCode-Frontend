import { Component, inject, OnInit } from '@angular/core';
import {TaskService} from '../../services/task.service';
import {DecimalPipe} from '@angular/common';
import {Task} from '../../model/task.model';
import { assignTaskStats} from '../../utils/task-helpers';
import {TaskChartComponent} from '../../components/task-chart/task-chart.component';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    DecimalPipe,
    TaskChartComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit{
  private taskService = inject(TaskService);

  totalTasks = 0
  completedTasks = 0
  rejectedTasks = 0
  pendingTasks = 0

  username = localStorage.getItem('username');
  tasks: Task[] = [];

  getTasks() {
    this.taskService.getTasks().subscribe({
      next: (tasks: Task[]) => {
        assignTaskStats(this, tasks)
      },
      error: () => {
        console.error("Error: couldn't retrieve tasks");
      }
    });
  }

  ngOnInit() {
    this.getTasks()
  }
}
