import {
    Component,
    Directive,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
    templateUrl: './templates/process-phase.html', styles: [`:host{ display: contents; }`]
})
export class ProcessPhase implements OnInit, OnDestroy{
    isLoading: boolean = false;

    @Input() isCenterAlign: boolean = false;
    @Input() open_process_id: string;

    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;

    subscriber: Subscription;
    process: any;
    constructor(public fb: FormBuilder) { }

    ngOnInit(){}

    ngOnDestroy(){ this.subscriber?.unsubscribe(); }

    expandProcess(processId){ this.open_process_id = processId; }

    /*onStartChange(stage: PipelineProcessPhaseLookup, dt: string, isStarted: boolean){
        this.isLoading = true;
        const success = (resp)=> {
            this.isLoading = false;
            //this.onOk.emit({ refresh: true });
        };

        const error = (resp)=> {
            this.isLoading = false;
        };
        const data = {
            processId: null,
            statusId: stage.id,
            moduleId: this.moduleId,
            dt: dt,
            orgUserId: this.coreService.currentUser.id,
            isStarted: isStarted
        };
        this.service.updateStatus(data).toPromise().then(success, error);
    }*/
}