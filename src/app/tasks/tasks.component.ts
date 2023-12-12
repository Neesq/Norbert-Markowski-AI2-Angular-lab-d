import { Component, OnInit } from '@angular/core';
import { TasksService } from '../task.service';
import { Task } from '../task';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  public tasks: Task[] = [];
  public newTask: Task = {};
  public isProcessing = false;

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.tasksService.index().subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    });
    this.isProcessing = false;
  }

  addTask(): void {
    if (this.newTask.title === undefined) return;
    this.isProcessing = true;
    this.newTask.completed = false;
    this.newTask.archived = false;

    this.tasks.unshift(this.newTask);

    this.tasksService.post(this.newTask).subscribe((task: Task) => {
      this.newTask = {};
      this.ngOnInit();
    });
  }

  handleChange(task: Task) {
    this.tasksService.put(task).subscribe({
      error: (err) => {
        alert(err);
        this.ngOnInit();
      },
    });
  }

  archiveCompleted() {
    const observables: Observable<any>[] = [];
    for (const task of this.tasks) {
      if (!task.completed) {
        continue;
      }

      task.archived = true;
      observables.push(this.tasksService.put(task));
    }
    forkJoin(observables).subscribe(() => {
      this.ngOnInit();
    });
  }
}
