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
import {ProjectProcess, ProjectProcessQueryOptions, ProjectTask} from "../../domains/project-process.serializer";
import {ProjectWorkflowService} from "../../services/project-workflow.service";
import {Subscription} from "rxjs";
import {ORG_PROCESS_TYPE } from "@app-base/public";
import {WorkflowPluginAPIResolver} from "../../services/workflow.resolver";
import {OrgWorkflowPhaseLookup} from "../../domains/lookup";

@Component({
    selector: 'project-workflow-manage',
    templateUrl: './templates/project-workflow.html', styles: [`:host{ display: contents; }`]
})
export class ProjectWorkflowManageView extends ProjectStagesForm implements OnInit, OnDestroy{
    orgProjectFilter = (listItem: ProjectProcess, compareItem: OrgWorkflowPhaseLookup)=> {
        return (listItem.startPhaseId == compareItem.id);
    };
    isLoading: boolean = false;
    processList: Array<ProjectProcess>;

    @Input() isCenterAlign: boolean = false;
    @Input() projectId: any;
    @Input() moduleId: any;
    @Input() open_process_id: string;

    tabs: any = {
        'workflow': 'workflow',
        'process': 'process',
        'task': 'task'
    };
    activeTab: string = this.tabs.workflow;

    @ViewChild('projectTask', { static: true }) public projectTask;
    @ViewChild('popupOptionsTemplate', { static: true }) public popupOptionsTemplate: TemplateRef<any>;

    openTab(tab: string){ this.activeTab = tab; }

    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;

    processType = ORG_PROCESS_TYPE;
    subscriber: Subscription;
    activeProjectTask: ProjectTask;
    constructor(public fb: FormBuilder,
                public service: ProjectWorkflowService,
                public apiResolver: WorkflowPluginAPIResolver) { super(fb); }

    ngOnInit(){
        this.refreshProjectProcess(null);
    }

    refreshProjectProcess(e)
    {
        this.isLoading = true;
        const queryOptions = new ProjectProcessQueryOptions();
        queryOptions.projectId = this.projectId;
        queryOptions.moduleId = this.moduleId;
        this.subscriber = this.service.list(queryOptions).subscribe(r=> {
            this.processList = r.entities;
            this.isLoading = false;
        });
    }

    ngOnDestroy(){ this.subscriber?.unsubscribe(); }

    expandProcess(processId){ this.open_process_id = processId; }

    onStartStatusChange(process, status: OrgWorkflowPhaseLookup){
        const { id, name } = status;
        process.startPhaseId = id;
        process.startPhaseName = name;
    }

    onEndStatusChange(process, status: OrgWorkflowPhaseLookup){
        const { id, name } = status;
        process.endPhaseId = id;
        process.endPhaseName = name;
    }

    onStartChange(process: any, dt: string, isStarted: boolean){
        const data = {
            processId: process.id,
            moduleId: this.moduleId,
            dt: dt,
            orgUserId: this.service.orgUserId,
            isStarted: isStarted
        };
        this.updateProcessWorkflow(process, data);
    }

    startProcessNow(process: any){
        const data = {
            processId: process.id,
            moduleId: this.moduleId,
            dt: new Date().toISOString().split('T')[0],
            orgUserId: this.service.orgUserId,
            isStarted: true
        };
        this.updateProcessWorkflow(process, data)
    }

    completeProcessNow(process: any){
        const data = {
            processId: process.id,
            moduleId: this.moduleId,
            dt: new Date().toISOString().split('T')[0],
            orgUserId: this.service.orgUserId,
            isStarted: false
        };
        this.updateProcessWorkflow(process, data)
    }

    updateProcessWorkflow(process, data){
        const success = (resp)=> {
            this.isLoading = false;
            this.refreshProjectProcess(null);
            //this.onOk.emit({ refresh: true });
        };

        const error = (resp)=> {
            this.isLoading = false;
        };
        this.service.updateWorkflow(data).toPromise().then(success, error);
    }


    /*newService(){
        super.populateProjectService(<ProjectModule>{});
    }

    applyService(row: ProjectModule){
        this.id = row.id;
        super.populateProjectService(row);
    }*/

    onSubmit(form) {
        // stop here if form is invalid
        if (form.invalid) {
            return;
        }
        const success = (resp)=> {
            this.isLoading = false;
            this.onOk.emit({ refresh: true });
        };
        const error = (resp)=> {
            this.isLoading = false;
        };

        this.isLoading = true;
        /*if(this.id) {
            this.service.update(this.id, form.value).subscribe(success, error);
        } else {
            this.service.create(form.value).subscribe(success, error);
        }*/
    }

    addProjectTask(process: ProjectProcess)
    {
        this.activeProjectTask = null;
        const { id, name } = process;

        this.projectTask.populateOrgTask({
            name: name,
            //taskTypeId: '',
            processId: id,

            defaultFrequencyTypeId: null,

            isManual: true,
            isPrimary: false,

            isVerificationRequired: false,
            isStatusOnMailRequired: true,
            isStatusOnMailDaily: false,
            isStatusOnMailWeekly: true,
            isStatusOnMailMonthly: false,

            defaultDay: 1,
            defaultMonth: 1,
            remark: null
        });
        this.activeTab = this.tabs.task;
    }

    updateOrgTask(task: ProjectTask){
        this.activeProjectTask = task;
        this.projectTask.populateOrgTask(task);
        this.activeTab = this.tabs.task;
    }
}