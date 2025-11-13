import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from "@angular/core";
import { pairwise, startWith, Subscription } from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  standalone: false,
  template: ``//<setup-workflow #setupWorkflow></setup-workflow>`
})
export class ProcessWorkflowView implements OnInit, OnDestroy {
    @ViewChild('setupWorkflow', { static: true }) public setupWorkflow: any;
    isLoading: boolean = false;
    processId: number;
    subscriber: Subscription;
    constructor(public router: Router, public activatedRoute: ActivatedRoute){
        this.processId = this.activatedRoute.params['processId'];
    }

    ngOnInit(){
        this.subscriber = this.activatedRoute.params.subscribe(params => {
            this.processId = params['processId'];
            this.setupWorkflow.call(this.processId);
        });
    }

    ngOnDestroy(){ this.subscriber?.unsubscribe(); }
}
