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
import {ProjectStagesForm} from "../../forms/project-stages.form";
import {Subscription} from "rxjs";
import {ProjectStagesService} from "../../services/project-stages.service";
import {ProjectStages, ProjectStagesQueryOptions} from "../../domains/project-stages.serializer";
import {WorkflowPluginAPIResolver} from "../../services/workflow.resolver";

@Component({
    templateUrl: './templates/project-stages.html', styles: [`:host{ display: contents; }`]
})
export class ProjectStageManageView extends ProjectStagesForm implements OnInit, OnDestroy{
    isLoading: boolean = false;
    processList: Array<ProjectStages>;

    @Input() isCenterAlign: boolean = false;
    //@Input() type: string; //PROJECT_MANAGEMENT
    @Input() moduleId: any;
    @Input() open_process_id: string;

    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;

    subscriber: Subscription;
    constructor(public fb: FormBuilder,
                public service: ProjectStagesService,
                public apiResolver: WorkflowPluginAPIResolver) { super(fb); }

    ngOnInit(){
        this.refreshProjectProcess(null);
    }

    refreshProjectProcess(e)
    {
        this.isLoading = true;
        const queryOptions = new ProjectStagesQueryOptions();
        //queryOptions.projectId = this.projectId;
        queryOptions.moduleId = this.moduleId;
        this.subscriber = this.service.list(queryOptions).subscribe(r=> {
            this.processList = r.entities;
            this.isLoading = false;
        });
    }

    ngOnDestroy(){ this.subscriber?.unsubscribe(); }

    expandProcess(processId){ this.open_process_id = processId; }

    onStartChange(stage: ProjectStages, dt: string, isStarted: boolean){
        this.isLoading = true;
        const success = (resp)=> {
            this.isLoading = false;
            this.refreshProjectProcess(null);
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
            //orgUserId: this.coreService.currentUser.id,
            isStarted: isStarted
        };
        this.service.updateStatus(data).toPromise().then(success, error);
    }
}
