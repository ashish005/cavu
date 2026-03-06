import {
    Component,
    OnInit,
    AfterViewInit, Input, OnDestroy, ViewChild, TemplateRef
} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {pairwise, startWith, Subscription} from "rxjs";
import {FeePlanSchedulerActivityService} from "../services/fee-plan-scheduler-activity.service";
import {
    FeePlanSchedulerActivity,
    FeePlanSchedulerActivityQueryOptions
} from "../domains/fee-plan-scheduler-activity.serializer";

@Component({
    standalone: false,
    selector: 'fee-plan-scheduled-activity',
    templateUrl: './templates/fee-plan-scheduled-activity.html',
    styles: [`:host { display: contents; } ::ng-deep .month-container{ max-width: 25%; padding: 10px !important; }`],
    providers: [FeePlanSchedulerActivityService]
})
export class FeePlanSchedulerActivityComponent implements OnInit, OnDestroy {
    @Input() feePlanId: any;
    @Input() scheduleId: any;

    entities: Array<FeePlanSchedulerActivity>;
    subscriber: Subscription;
    coreState: FeePlanSchedulerActivityQueryOptions;
    @ViewChild('calendarYear', { static: true }) public calendarYear;
    @ViewChild('popupOptionsTemplate', { static: true }) public popupOptionsTemplate: TemplateRef<any>;

    constructor(public fb: FormBuilder, public activatedRoute: ActivatedRoute, public service: FeePlanSchedulerActivityService){
        this.coreState = new FeePlanSchedulerActivityQueryOptions();
    }

    ngOnInit()
    {
        this.updateSchedulers();
    }

    updateSchedulers(e?)
    {
        this.coreState.feePlanId = this.feePlanId;
        this.coreState.scheduleId = this.scheduleId;
        const success = (r)=> {
            const { startDate, endDate, todayDate } = r.data;
            //const entities = (r.entities || []).map(r => new OrgTaskActivity(r));
            this.calendarYear.applySchedular(startDate, endDate, r.entities, todayDate);
        };
        const error = (r)=> {};
        this.subscriber = this.service.list(this.coreState).subscribe(success, error);
    }

    ngOnDestroy(){ this.subscriber?.unsubscribe(); }
}
