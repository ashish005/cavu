import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
@Component({
  standalone: false,
  selector: 'scheduler-calender',
  templateUrl: './templates/scheduler-calender.html'
})
export class TestSchedulerCalenderView implements OnInit {
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('calendarYear', { static: true }) public calendarYear;
  @ViewChild('schedulerEl', { static: true }) public schedulerEl;
  @Input() orgSchedulerId: number;
  entities: Array<any>;

  startDate: string;
  endDate: string;
  constructor(){}
  ngOnInit(){ this.schedulerEl.refreshScheduler(this.orgSchedulerId); }
    getTest() {
      const data = this.schedulerEl.getSchedulerPostValues();
      const success = (resp)=>{
        this.entities = resp.entities;
        this.calendarYear.applySchedular(this.startDate, this.endDate, this.entities);
      };
      const error = (e)=>{ };
      const { startDate, endDate } = data;
      this.startDate = startDate;
      this.endDate = endDate;
      this.schedulerEl.schedulerService.testScheduler(data).subscribe(success, error);
    }
    onOkAction(data){
     this.onOk.emit(data);
    }

    onCancelAction(data){
       this.onCancel.emit(data);
    }
}
