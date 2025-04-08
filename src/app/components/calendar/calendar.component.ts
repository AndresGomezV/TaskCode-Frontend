import {
  Component,
  Output,
  EventEmitter,
  inject,
  TemplateRef,
  ViewChild,
  ChangeDetectorRef,
  OnInit, AfterViewInit,
  HostListener
} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';
import {FullCalendarComponent, FullCalendarModule} from '@fullcalendar/angular';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {TaskFormComponent} from '../task-form/task-form.component';
import {SidebarComponent} from '../sidebar/sidebar.component';
import {TaskRequest} from '../../model/task-request.model';
import { renderCustomEvent } from '../../utils/event-render.utils';
import {TaskService} from '../../services/task.service';
import { Task } from '../../model/task.model';
import {NgStyle} from '@angular/common';
import {TaskUpdate} from '../../model/task-update.model';

@Component({
  selector: 'app-calendar',
  imports: [
    FullCalendarModule,
    TaskFormComponent,
    SidebarComponent,
    NgStyle
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit,AfterViewInit {

  constructor(private modalService: BsModalService, private cdRef: ChangeDetectorRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    const clickedOnEvent = target.closest('.calendar-task-event');
    const clickedOnActions = target.closest('.task-action-buttons');

    if (!clickedOnEvent && !clickedOnActions) {
      this.showTaskModal = false;
    }
  }

  modalRef?: BsModalRef;
  private taskService: TaskService = inject(TaskService);

  @Output() dateSelected = new EventEmitter<string>();

  @ViewChild('taskModal') taskModal!:  TemplateRef<any>;

  @ViewChild('fullcalendar') calendarComponent!: FullCalendarComponent;

  events: any[] = []
  selectedDate: string | null = null;
  allTasks : Task[] = []
  calendarOptions: CalendarOptions = {} as CalendarOptions;
  selectedTask: any;
  actionBtnPosition = { x: 0, y: 0 };
  showTaskModal = false;
  isEditing = false;

  handleEventClick(info:any):void {
    const { id, title, start } = info.event
    const { description, duration } = info.event.extendedProps;
    this.selectedTask = {
      id,
      title,
      description,
      duration,
      start,
    }

   this.showTaskModal = true;
    const eventElement = info.el as HTMLElement;
    const rect = eventElement.getBoundingClientRect();

    this.actionBtnPosition = {
      x: window.scrollX + rect.right + 10,
      y: window.scrollY + rect.top
      }
    }

  handleDateClick(arg: any) {
    if (this.modalRef) {
      this.modalRef.hide();
      this.modalRef = undefined;
    }
    this.selectedDate = arg.dateStr;

    this.selectedTask = undefined;
    this.isEditing = false;

    this.dateSelected.emit(this.selectedDate!);
    this.modalRef = this.modalService.show(this.taskModal);
    this.cdRef.detectChanges();
  }

  onTaskCreated(newTask: TaskRequest) {
    this.taskService.createTask(newTask).subscribe({
      next: task => {
        this.calendarComponent.getApi().addEvent({
          title: task.title,
          start: task.date,
          extendedProps: {
            description: task.description,
            duration: task.duration
          }
        })
        this.modalRef?.hide();
        this.loadTasks();
      },
      error: (error) => console.error('Error creating task:', error)
    })
  }

  deleteTask() {
    this.taskService.deleteTaskById(this.selectedTask.id).subscribe(() => {
      const event = this.calendarComponent.getApi().getEventById(this.selectedTask.id);
      if (event) event.remove();
      this.selectedTask = null;
      this.showTaskModal = false;
      this.loadTasks()
    },
      err => { console.error('Error deleting task', err); })
  }

  updateTask(taskId: number, newTask: TaskUpdate) {
    this.taskService.updateTask(taskId, newTask).subscribe({
      next: updatedTask => {
       const event = this.calendarComponent.getApi().getEventById(this.selectedTask.id);

       if (event) {
         event.setProp('title', updatedTask.title)
         event.setExtendedProp('description', updatedTask.description)
         event.setExtendedProp('duration', updatedTask.duration)
       }
        this.modalRef?.hide();
        this.showTaskModal = false;
        this.loadTasks();
      },
      error: err => {
        console.error('Error updating task', err)
      }
    })
  }

  onTaskEdited(event: { id: number, updatedTask: TaskUpdate }) {
    this.updateTask(event.id, event.updatedTask);
  }

  loadTasks(): void {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.removeAllEvents();

    this.taskService.getTasks().subscribe({
      next: (tasks: Task[]) => {
        this.allTasks = tasks;
        tasks.forEach(task => {
          calendarApi.addEvent({
            id: task.id.toString(),
            title: task.title,
            start: task.date,
            extendedProps: {
              description: task.description,
              duration: task.duration
            },
            classNames: ['calendar-task-event']
          });
        });
      },
      error: err => console.error('Error loading tasks', err)
    });
  }

  openEditModal() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
    this.selectedTask = { ...this.selectedTask };
    this.isEditing = true;
    this.modalRef = this.modalService.show(this.taskModal);
    this.cdRef.detectChanges();
  }

  ngAfterViewInit(): void {
    this.loadTasks();
  }

  ngOnInit() {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      dateClick: this.handleDateClick.bind(this),
      eventContent: renderCustomEvent,
      events: [],
      height: 'auto',
      contentHeight: 'auto',
      eventClick: this.handleEventClick.bind(this)
    };
  }

}
