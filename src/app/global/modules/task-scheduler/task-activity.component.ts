import {Component, OnInit, Input, OnDestroy, ViewChild, TemplateRef, Injector, Injectable} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {pairwise, startWith, Subscription} from "rxjs";
import {CoreEndpointBase} from "../../services/index";
import {CoreQueryOptions} from "../../services/models";
class OrgTaskActivityQueryOptions extends CoreQueryOptions {
    orgTaskId: any;
    scheduleId: any;
    constructor(model: any = {}){ super(model); }

    override toQueryString (){
        const obj = {
            orgTaskId: this.orgTaskId,
            scheduleId: this.scheduleId
        };
        return super.getParamByObject(obj);
    }
}
@Component({
    standalone: false,
    templateUrl: './templates/task-activity.html',
    styles: [`:host { display: contents; } ::ng-deep .month-container{ max-width: 25%; padding: 10px !important; }`]
})
export class TaskActivityComponent extends CoreEndpointBase implements OnInit, OnDestroy {
    @Input() orgTaskId: any;
    @Input() scheduleId: any;

    entities: Array<string>;
    subscriber: Subscription;
    coreState: OrgTaskActivityQueryOptions;
    @ViewChild('calendarYear', { static: true }) public calendarYear;
    @ViewChild('popupOptionsTemplate', { static: true }) public popupOptionsTemplate: TemplateRef<any>;

    constructor(public fb: FormBuilder, public override injector: Injector){
        super(injector);
        this.coreState = new OrgTaskActivityQueryOptions();
    }

    ngOnInit() { this.updateSchedulers(); }

    updateSchedulers(e?)
    {
        this.coreState.orgTaskId = this.orgTaskId;
        this.coreState.scheduleId = this.scheduleId;
        const success = (r)=> {
            this.calendarYear.applySchedular(r);
        };
        const error = (r)=> {};
        this.subscriber = this.getTaskActivities(this.coreState).subscribe(success, error);
    }

    getTaskActivities(coreState){
        return this.httpClient.get(`${this.baseSectorAPIUrl}/taskSchedulerSummary/calendar?${coreState.toQueryString()}`, this.requestHeaders);
    }

    ngOnDestroy(){ this.subscriber?.unsubscribe(); }
}
