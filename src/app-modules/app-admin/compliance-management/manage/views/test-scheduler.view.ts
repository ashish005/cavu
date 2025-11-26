import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ComplianceService} from "../services";

@Component({
  standalone: false,
  templateUrl: './templates/compliance-scheduler.html',
  styles: [`:host {display: contents;}`]
})
export class TestComplianceSchedulerView implements OnInit {
    @ViewChild('calendarYear', { static: true }) public calendarYear;
    @ViewChild('schedulerEl', { static: true }) public schedulerEl;
  constructor(public activatedRoute: ActivatedRoute, public service: ComplianceService){}
  ngOnInit() {}
    onFrequencyChange(data) {
        const success = (resp)=>{
            debugger
            const { startDate, endDate } = resp.data;
            this.calendarYear.applySchedular(startDate, endDate, resp.entities);
        };
        const error = (e)=>{ };
        this.service.testScheduler(data).subscribe(success, error);
    }
}
