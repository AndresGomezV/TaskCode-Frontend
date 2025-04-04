import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TaskRequest} from "../model/task-request.model";
import {Task} from "../model/task.model";

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

    return this.http.post<any>(this.apiUrl, task, {headers});
  }

  getTasks(filters?: { userId?: number; status?: string }): Observable<Task[]> {
    let params = new HttpParams();

    if (filters?.userId !== undefined) {
      params = params.set('userId', filters.userId.toString());
    }

    if (filters?.status !== undefined) {
      params = params.set('status', filters.status);
    }

    return this.http.get<Task[]>(`${this.apiUrl}/`, { params });
  }
}

