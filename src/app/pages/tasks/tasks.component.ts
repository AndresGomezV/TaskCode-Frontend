import {Component, inject} from '@angular/core';
import {TaskService} from '../../services/task.service';
import {Task} from "../../model/task.model";
import {RouterOutlet} from '@angular/router';
import {SidebarComponent} from '../../components/sidebar/sidebar.component';
import {User} from '../../model/user.model';

@Component({
  selector: 'app-tasks',
  imports: [
    RouterOutlet,
    SidebarComponent
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent {
 private taskService = inject(TaskService)

  tasks: Task[] = []
  users: User[] = [];
  selectedUserId: number | undefined;
  selectedStatus: string | undefined;
  statuses = ['PENDING', 'ACCEPTED', 'REJECTED'];


  getTasks(userId?: number, status?: string) {
   this.taskService.getTasks({userId, status}).subscribe({
     next: tasks => {
       this.tasks = tasks
     },

     error: () => {
       console.error("Error: couldn't retrieve tasks")
     }
   })
  }

  getUsers()


}
