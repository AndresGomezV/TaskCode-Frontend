import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {ReactiveFormsModule, FormBuilder, Validators} from "@angular/forms";
import { Router } from '@angular/router';
import {TaskService} from '../../services/task.service';
import {TaskRequest} from '../../model/task-request.model';
import { Task } from '../../model/task.model';

@Component({
  selector: 'app-task-form',
  imports: [ ReactiveFormsModule ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent {
  private router: Router = inject(Router)
  formBuilder: FormBuilder = inject(FormBuilder);
  private taskService: TaskService = inject(TaskService);
  errorMessage: string | null = null;
  @Input() existingTasks: Task[] = [];
  @Input() selectedDate!: string | null;
  @Output() taskCreated = new EventEmitter<TaskRequest>();

  taskForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(1)]],
    description: ['', [Validators.required, Validators.minLength(1)]],
    duration: ['', [Validators.required, Validators.min(1), Validators.max(8)]],
  })

  onSubmit(): void {
    if (this.taskForm.invalid || !this.selectedDate) return;

    const newDuration = Number(this.taskForm.value.duration);
    const selectedDate = this.selectedDate;

    const tasksForDate = this.existingTasks.filter(task => {
      const taskDate = new Date(task.date).toISOString().split('T')[0];
      return taskDate === selectedDate;
    });

    const totalHours = tasksForDate.reduce((sum, task) => sum + task.duration, 0);

    const hourLabel = totalHours === 1 ? 'hour' : 'hours';
    const remainingHours = 8 - totalHours;

    if (totalHours + newDuration > 8) {
      this.errorMessage = `You’ve already logged ${totalHours} ${hourLabel} for this date. You can only add  ${8 - totalHours} more`


      setTimeout(() => {
        this.errorMessage = '';
      }, 3000)

      return;
    }

    const taskData: TaskRequest = {
      title: this.taskForm.value.title ?? '',
      description: this.taskForm.value.description ?? '',
      duration: this.taskForm.value.duration ? +this.taskForm.value.duration : 0,
      date: this.selectedDate!
    };

    this.taskService.createTask(taskData).subscribe({
      next: response => {
        this.taskCreated.emit(taskData)
        this.taskForm.reset();

        },
      error: (error) => console.error('Error creating task:', error)
    })
  }
}
