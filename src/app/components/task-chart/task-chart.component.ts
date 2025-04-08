import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  DoughnutController,
  CategoryScale, LinearScale, BarElement, PointElement, LineElement
} from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, Title, DoughnutController, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

@Component({
  selector: 'app-task-chart',
  imports: [],
  templateUrl: './task-chart.component.html',
  styleUrl: './task-chart.component.scss'
})
export class TaskChartComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild('taskChart') taskChartRef!: ElementRef;

  @Input()  completedTasks: number = 0
  @Input() pendingTasks: number = 0
  @Input() rejectedTasks: number = 0

  taskChart: any;

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
            hoverBackgroundColor: ['#388e3c', '#f57c00', '#d32f2f'],
            hoverOffset: 10
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
                  return " " + tooltipItem.raw + ' Tasks';
                }
              }
            }
          }
        }
      });
    }
  }

  ngOnInit() {
    this.createTaskChart();

  }

  ngAfterViewInit() {
    this.createTaskChart();
  }

  ngOnChanges() {
    if (this.taskChart) {
      this.taskChart.destroy();
      this.createTaskChart();
    }
  }
}
