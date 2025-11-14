import {Component, Input, TemplateRef, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {Subscription} from "rxjs";
import {WorkflowOrgProcess, ProcessWorkflowQueryOptions, WorkflowOrgTask} from "../domains/process-workflow.serializer";
import {CoreProcessWorkflowService} from "../services/process-workflow.service";

@Component({
    standalone: false,
    selector: 'workflow',
    templateUrl: './templates/workflow-with-task.html',
    styles: [`:host{ display: contents; }`],
    providers: [CoreProcessWorkflowService]
})
export class WorkflowWithTaskView {
    //@ViewChild('popupOptionsTemplate', { static: true }) public popupOptionsTemplate: TemplateRef<any>;
    isLoading: boolean = false;
    processList: Array<WorkflowOrgProcess>;
    tasks: Array<any>;
    context: any;
    @Input() id: number;// Process id
    @Input() isCenterAlign: boolean = false;
    @Input() open_process_id: string;

    subscriber: Subscription;
    //@ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;

    constructor(public fb: FormBuilder, public service: CoreProcessWorkflowService) { }

    ngOnInit(){
        this.isLoading = true;
        const queryOptions = new ProcessWorkflowQueryOptions();
        queryOptions.parentId = this.id;
        this.subscriber = this.service.getAll(queryOptions).subscribe(r => {
            this.processList = r.entities;
            this.isLoading = false;
        });
    }

    onProcessPhasesChange(process: WorkflowOrgProcess, phase: any){
        const { name } = phase;
        process.processPhase = name;
    }

    onProcessStatusChange(process: WorkflowOrgProcess, status: any){
        const { name } = status;
        process.manualStatus = name;
    }

    onProcessPhaseDateChange(process: WorkflowOrgProcess, dt: string){
        const data = {
            processId: process.id,
            dt: dt,
            //orgUserId: this.service.orgUserId
        };
        //this.updateProcessWorkflow(process, data);
    }

    onManualStatusOnDateChange(process: WorkflowOrgProcess, dt: string){
        const data = {
            processId: process.id,
            dt: dt,
            //orgUserId: this.service.orgUserId
        };
        //this.updateProcessWorkflow(process, data);
    }

    onTaskPriorityChange(task: WorkflowOrgTask, priority: any){
        const { id, name } = priority;
        task.taskPriorityId = id;
        task.taskPriorityName = name;
    }


    /*newService(){
        super.populateProjectService(<ProjectModule>{});
    }

    applyService(row: ProjectModule){
        this.id = row.id;
        super.populateProjectService(row);
    }*/

    // onSubmit(form) {
    //     // stop here if form is invalid
    //     if (form.invalid) {
    //         return;
    //     }
    //     const success = (resp)=> {
    //         this.submitted = false;
    //         this.onOk.emit({ refresh: true });
    //     };
    //     const error = (resp)=> {
    //         this.submitted = false;
    //     };
    //
    //     this.submitted = true;
    //     /*if(this.id) {
    //         this.service.update(this.id, form.value).subscribe(success, error);
    //     } else {
    //         this.service.create(form.value).subscribe(success, error);
    //     }*/
    // }

    addTask(e){}
}