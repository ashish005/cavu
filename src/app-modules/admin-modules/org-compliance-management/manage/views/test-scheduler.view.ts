import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ComplianceService} from "../services";

@Component({
  standalone: false,
  templateUrl: './templates/compliance-scheduler.html',
  styles: [`:host {display: contents;}`]
})
export class TestComplianceSchedulerView implements OnInit {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;
    @ViewChild('calendarYear', { static: true }) public calendarYear;
    @ViewChild('schedulerEl', { static: true }) public schedulerEl;
  constructor(public activatedRoute: ActivatedRoute, public service: ComplianceService){}
  ngOnInit() {}
    onFrequencyChange(data) {
        const success = (resp)=>{
            this.calendarYear.applySchedular(resp);
        };
        const error = (e)=>{ };
        this.service.testScheduler(data).subscribe(success, error);
    }
}
