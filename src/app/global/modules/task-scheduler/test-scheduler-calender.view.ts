import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
@Component({
  standalone: false,
  selector: 'scheduler-calender',
  templateUrl: './templates/scheduler-calender.html'
})
export class TestSchedulerCalenderView  {
  @ViewChild('calendarYear', { static: true }) public calendarYear;
  @ViewChild('schedulerEl', { static: true }) public schedulerEl;
  entities: Array<any>;
  startDate: string;
  endDate: string;
  constructor(private router: Router, public activatedRoute: ActivatedRoute){
  }

    getTest() {
      const data = this.schedulerEl.getSchedulerPostValues();
      const success = (resp)=>{
        this.entities = resp.entities;
        this.calendarYear.applySchedular(this.startDate, this.endDate, this.entities);
      };
      const error = (e)=>{ };
      //const { masterType } =  this.schedulerEl.activeFrequency;
      const { startDate, endDate } = data;
      this.startDate = startDate;
      this.endDate = endDate;
      this.schedulerEl.schedulerService.testScheduler(data).subscribe(success, error);
    }
    onOkAction(data){
        //this.onOk.emit(data);
    }

    onCancelAction(data){
        //this.onCancel.emit(data);
    }
}
