import { Component, inject, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from "../../model/task.model";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  DoughnutController,
  PieController,
  BarController,
  CategoryScale, LinearScale, BarElement, LineController, PointElement, LineElement
} from 'chart.js';
import {SidebarComponent} from '../../components/sidebar/sidebar.component';


Chart.register(ArcElement, Tooltip, Legend, Title, DoughnutController, PieController, BarController, CategoryScale, LinearScale, BarElement, LineController, PointElement, LineElement);

@Component({
  selector: 'app-user-dashboard',
  imports: [DecimalPipe, SidebarComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {

  @ViewChild('taskChart') taskChartRef: ElementRef | undefined;

  username = localStorage.getItem('username');
  taskService = inject(TaskService);
  tasks: Task[] = [];
  totalTasks = 0;
  completedTasks = 0;
  pendingTasks = 0;
  rejectedTasks = 0;
  taskChart: any;

  // Método para obtener tareas
  getTasks() {
    this.taskService.getTasks().subscribe({
      next: (tasks: Task[]) => {
        this.tasks = tasks;
        this.calculateTaskStats();
        this.createTaskChart()
      },
      error: () => {
        console.error("Error: couldn't retrieve tasks");
      }
    });
  }

  // Método para calcular estadísticas de tareas
  calculateTaskStats() {
    this.totalTasks = this.tasks.length;
    this.completedTasks = this.tasks.filter(task => task.status === 'ACCEPTED').length;
    this.pendingTasks = this.tasks.filter(task => task.status === 'PENDING').length;
    this.rejectedTasks = this.tasks.filter(task => task.status === 'REJECTED').length;
  }

  // Método para crear el gráfico
  createTaskChart() {
    if (this.taskChart) {

      this.taskChart.destroy();
    }

    if (this.taskChartRef?.nativeElement) {

      this.taskChart = new Chart(this.taskChartRef.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['ACCEPTED', 'PENDING', 'REJECTED'],
          datasets: [{
            data: [this.completedTasks, this.pendingTasks, this.rejectedTasks],
            backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
            hoverBackgroundColor: ['#388e3c', '#f57c00', '#d32f2f']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return tooltipItem.label + ': ' + tooltipItem.raw + ' tasks';
                }
              }
            }
          }
        }
      });
    }
  }

  ngOnInit() {
    this.getTasks();
    if (this.taskChartRef && !this.taskChart) {
      this.createTaskChart();
    }
  }
}

