import {Component, Output, EventEmitter, inject, TemplateRef, ViewChild, ChangeDetectorRef} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';
import {FullCalendarModule} from '@fullcalendar/angular';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {TaskFormComponent} from '../task-form/task-form.component';

@Component({
  selector: 'app-calendar',
  imports: [
    FullCalendarModule,
    TaskFormComponent
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  constructor(private modalService: BsModalService, private cdRef: ChangeDetectorRef) {}
  modalRef?: BsModalRef;

  @Output() dateSelected = new EventEmitter<string>();

  @ViewChild('taskModal') taskModal!:  TemplateRef<any>;

  selectedDate: string | null = null;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: this.handleDateClick.bind(this),
    events: [{ title: 'Event example', date: '2024-04-10' }]
  };

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



}
