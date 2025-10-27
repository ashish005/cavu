import {
    Component,
    OnInit,
    AfterViewInit, Input, OnDestroy, ViewChild, TemplateRef
} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {ProjectWorkflowService} from "../services/project-workflow.service";

@Component({
    templateUrl: './templates/project-workflow.html',
    styles: [`:host { display: contents; }`]
})
export class ProjectWorkflowLayout implements OnInit, OnDestroy {
    @ViewChild('popupOptionsTemplate', { static: true }) public popupOptionsTemplate: TemplateRef<any>;
    @Input() projectId: any;
    @Input() moduleId: any;
    isLoading: boolean;
    subscriber: Subscription;
    constructor(public fb: FormBuilder, public activatedRoute: ActivatedRoute, public service: ProjectWorkflowService){ }

    ngOnInit() {}

    ngOnDestroy(){ this.subscriber?.unsubscribe(); }

    onOkAction(data){
        //this.onOk.emit(data);
    }

    onCancelAction(data){
        //this.onCancel.emit(data);
    }
}
