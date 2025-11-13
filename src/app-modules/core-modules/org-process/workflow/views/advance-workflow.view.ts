import {
    Component,
    Injector,
    Input, OnDestroy, OnInit,
    TemplateRef,
    ViewChild
} from "@angular/core";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    standalone: false,
    template: `<setup-advance-workflow #setupWorkflow></setup-advance-workflow>`
})
export class AdvanceWorkflowView implements OnInit, OnDestroy {
    @ViewChild('setupWorkflow', { static: true }) public setupWorkflow: any;
    //gridData: Array<WorkflowOrgProcess>;
    isLoading: boolean = false;
    processId: number;
    subscriber: Subscription;
    constructor(public router: Router, public activatedRoute: ActivatedRoute){

    }

    ngOnInit(){
        this.subscriber = this.activatedRoute.parent.params.subscribe(params => {
            this.processId = params['processId'];
            this.setupWorkflow.call(this.processId);
        });
    }

    ngOnDestroy(){ this.subscriber?.unsubscribe(); }
 }
