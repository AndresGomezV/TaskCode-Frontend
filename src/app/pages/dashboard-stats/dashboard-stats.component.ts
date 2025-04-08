import {Component, inject, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TaskChartComponent} from '../../components/task-chart/task-chart.component';
import {TaskService} from '../../services/task.service';
import {Task} from '../../model/task.model';
import {assignTaskStats} from '../../utils/task-helpers';

@Component({
  selector: 'app-dashboard-stats',
  imports: [CommonModule, TaskChartComponent],
  templateUrl: './dashboard-stats.component.html',
  styleUrl: './dashboard-stats.component.scss'
})
export class DashboardStatsComponent implements OnInit{

  username = localStorage.getItem('username');

  taskService = inject(TaskService);

  tasks: Task[] = [];
  totalTasks = 0;
  completedTasks = 0;
  pendingTasks = 0;
  rejectedTasks = 0;

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
    this.getTasks();
  }
}
