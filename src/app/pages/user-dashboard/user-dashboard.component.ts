import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from "../../model/task.model";
import { assignTaskStats} from '../../utils/task-helpers';
import {TaskChartComponent} from '../../components/task-chart/task-chart.component';
@Component({
  selector: 'app-user-dashboard',
  imports: [DecimalPipe, TaskChartComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {

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

