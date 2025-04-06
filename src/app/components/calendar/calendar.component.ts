import {
  Component,
  Output,
  EventEmitter,
  inject,
  TemplateRef,
  ViewChild,
  ChangeDetectorRef,
  OnInit, AfterViewInit
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

@Component({
  selector: 'app-calendar',
  imports: [
    FullCalendarModule,
    TaskFormComponent,
    SidebarComponent
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit,AfterViewInit {

  constructor(private modalService: BsModalService, private cdRef: ChangeDetectorRef) {}

  modalRef?: BsModalRef;
  private taskService: TaskService = inject(TaskService);

  @Output() dateSelected = new EventEmitter<string>();

  @ViewChild('taskModal') taskModal!:  TemplateRef<any>;

  @ViewChild('fullcalendar') calendarComponent!: FullCalendarComponent;
events: any[] = []

  selectedDate: string | null = null;
  allTasks : Task[] = []
  calendarOptions: CalendarOptions = {} as CalendarOptions;


  handleDateClick(arg: any) {
    if (this.modalRef) {
      this.modalRef.hide();
      this.modalRef = undefined;
    }
    this.selectedDate = arg.dateStr;
    this.dateSelected.emit(this.selectedDate!);
    this.modalRef = this.modalService.show(this.taskModal);
    this.cdRef.detectChanges();
  }

  addTaskToCalendar(task: TaskRequest) {
    const calendarApi = this.calendarComponent.getApi();

    calendarApi.addEvent({
      title: task.title,
      start: task.date,
      extendedProps: {
        description: task.description,
        duration: task.duration
      }
    });
  }

  loadTasks(): void {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.removeAllEvents();

    this.taskService.getTasks().subscribe({
      next: (tasks: Task[]) => {
        this.allTasks = tasks;
        tasks.forEach(task => {
          calendarApi.addEvent({
            title: task.title,
            start: task.date,
            extendedProps: {
              description: task.description,
              duration: task.duration
            }
          });
        });
      },
      error: err => console.error('Error al cargar tareas', err)
    });
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
    };
  }

}
