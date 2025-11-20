import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {SchedularDomain} from "./domains/schedular.domain";

@Component({
  standalone: false,
  templateUrl: './templates/frequency-calender.html',
})
export class TestFrequencyCalenderView implements OnInit {
  @ViewChild('calendarYear', { static: true }) public calendarYear;
  @ViewChild('schedulerEl', { static: true }) public schedulerEl;
  @Input() orgSchedulerId: number;
  constructor(){}

  ngOnInit(){ this.schedulerEl.refreshScheduler(this.orgSchedulerId); }

    testScheduler(data: SchedularDomain) {
      const { startDate, endDate } = data;
      const success = (resp)=>{
        this.calendarYear.applySchedular(startDate, endDate, resp.entities);
      };
      const error = (e)=>{ };
      this.schedulerEl.schedulerService.testScheduler(data).subscribe(success, error);
    }
    onOkAction(data){
        //this.onOk.emit(data);
    }

    onCancelAction(data){
        //this.onCancel.emit(data);
    }
}
