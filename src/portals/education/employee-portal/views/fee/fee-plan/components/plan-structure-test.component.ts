import {
    Component,
    OnInit,
    AfterViewInit, Input, OnDestroy, ViewChild, TemplateRef, EventEmitter, Output
} from '@angular/core';
import {pairwise, startWith, Subscription} from "rxjs";
import {FeePlanService} from "../services/fee-plan.service";

@Component({
    standalone: false,
    selector: 'plan-structure-test',
    templateUrl: './templates/plan-structure-test.html',
})
export class PlanStructureTestComponent implements OnDestroy {
    entities: Array<any>;
    subscriber: Subscription;
    submitted: boolean;
    constructor(public service: FeePlanService){}
    updateSchedulers(feeStructures)
    {
        this.submitted = true;
        const success = (r)=> {
            this.submitted = false;
            this.entities = r.entities;
        };
        const error = (r)=> {this.submitted = false;};
        this.subscriber = this.service.testPlanScheduler(feeStructures).subscribe(success, error);
    }

    ngOnDestroy(){ this.subscriber?.unsubscribe(); }
}