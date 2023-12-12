import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from './task';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  apiUrl = 'http://localhost:41786/todos';

  constructor(private http: HttpClient) {}

  public index(archived = false): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl, {
      params: { archived, _sort: 'id', _order: 'asc' },
    });
  }

  public post(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  public put(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task);
  }

  public delete(task: Task): Observable<any> {
    return this.http.delete<Task>(`${this.apiUrl}/${task.id}`);
  }
}
