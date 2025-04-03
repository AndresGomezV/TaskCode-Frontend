import {Component, inject, Input} from '@angular/core';
import {ReactiveFormsModule, FormBuilder, Validators} from "@angular/forms";
import { Router } from '@angular/router';
import {TaskService} from '../../services/task.service';
import {TaskRequest} from '../../model/task.model';

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
  hasError: boolean = false;
  @Input() selectedDate: string | null = null;

  taskForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(1)]],
    description: ['', [Validators.required, Validators.minLength(1)]],
    duration: ['', [Validators.required, Validators.min(1)]],
  })

  onSubmit(): void {
    if (this.taskForm.invalid) return;

    const taskData: TaskRequest = {
      title: this.taskForm.value.title ?? '',
      description: this.taskForm.value.description ?? '',
      duration: this.taskForm.value.duration? +this.taskForm.value.duration: 0
    }

    this.taskService.createTask(taskData).subscribe({
      next: response => {
        console.log("Task created:", response);
        this.taskForm.reset();
      },
      error: (error) => console.error('Error creating task:', error)
    })




  }

}
