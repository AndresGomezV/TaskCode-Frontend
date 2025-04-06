import { Component, inject, OnInit} from '@angular/core';
import {TaskService} from '../../services/task.service';
import {Task, TaskStatus} from "../../model/task.model";
import {RouterOutlet} from '@angular/router';
import {SidebarComponent} from '../../components/sidebar/sidebar.component';
import {User} from '../../model/user.model';
import {UserService} from '../../services/user.service';
import {ReactiveFormsModule, FormBuilder} from "@angular/forms";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tasks',
  imports: [
    CommonModule,
    // RouterOutlet,
    SidebarComponent,
    ReactiveFormsModule,

  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements  OnInit {
 private taskService = inject(TaskService)
  private userService = inject(UserService)
  formBuilder = inject(FormBuilder)

  tasks: Task[] = [];
  users: User[]  = [];
  filtersApplied = false;
  statuses :TaskStatus[] = ['PENDING', 'ACCEPTED', 'REJECTED'];

  filtersForm = this.formBuilder.group({
    selectedUserId: [''],
    selectedStatus: ['']
  })


  getTasks(userId?: string | number, status?: string) {
   this.taskService.getTasks({userId, status}).subscribe({
     next: tasks => {
       this.tasks = tasks;
     },

     error: () => {
       console.error("Error: couldn't retrieve tasks")
     }
   })
  }

  getUsers() {
    this.userService.getUsers().subscribe({
      next: users => {
        this.users = users;
      },
      error: () => {
        console.error("Error: couldn't retrieve users")
      }
    })
  }

  getUsernameById(userId: number | null | undefined): string {
    const user = this.users.find(user => user.id === userId);
    return user ? user.username : 'Unknown';
  }
  applyFilters() {
    const { selectedUserId, selectedStatus } = this.filtersForm.value;

    const filters: {
      userId?: string | number;
      status?: string;
    } = {};


    if (selectedUserId !== '' && selectedUserId !== null) {
      filters.userId = selectedUserId;
    }

    if (selectedStatus !== '' && selectedStatus !== null) {
      filters.status = selectedStatus;
    }

    this.getTasks(filters.userId, filters.status);
    this.filtersApplied = true;
  }

  updateTaskStatus(taskId: number, newStatus: TaskStatus) {
  this.taskService.updateTaskStatus(taskId, newStatus).subscribe({
    next:  updatedTask => {
      const i = this.tasks.findIndex(t => t.id === taskId);
      if (i !== -1) {
        this.tasks[i].status = updatedTask.status;
      }
    },
    error: () => {
      console.error("Error updating task status");
    }
  })
  }

  clearFilters() {
    this.filtersForm.setValue({
      selectedUserId: null,
      selectedStatus: null
    });
    this.filtersApplied = false;
    this.getTasks()
  }

  ngOnInit() {
    this.getUsers();
    this.getTasks();

  }
  protected readonly Number = Number;
}
