import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TaskRequest} from "../model/task-request.model";
import {Task, TaskStatus} from "../model/task.model";
import {TaskUpdate} from '../model/task-update.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'http://localhost:8080/tasks';

  constructor(private http: HttpClient) {
  }

  createTask(task: TaskRequest): Observable<TaskRequest> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post<TaskRequest>(this.apiUrl, task, {headers});
  }

  getTasks(filters?: { userId: string | number | undefined; status: string | undefined }): Observable<Task[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    let params = new HttpParams();

    if (filters?.userId !== undefined && filters.userId !== '') {
      params = params.set('userId', filters.userId.toString());
    }

    if (filters?.status !== undefined && filters.status !== '') {
      params = params.set('status', filters.status);
    }

    return this.http.get<Task[]>(`${this.apiUrl}`, { params, headers });
  }

  updateTaskStatus(taskId: number, newStatus: TaskStatus): Observable<Task> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.put<Task>(`${this.apiUrl}/${taskId}/status`, { status: newStatus}, {headers});
  }

  deleteTaskById(taskId:number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete(`${this.apiUrl}/${taskId}`, { headers });
  }

  updateTask(taskId: number, newTask: TaskUpdate ): Observable<TaskUpdate> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.put<TaskUpdate>(`${this.apiUrl}/${taskId}`, newTask, { headers });
  }
}

