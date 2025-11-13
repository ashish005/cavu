import {Component, Injector, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription, catchError, map} from "rxjs";
import {ProcessWorkflowQueryOptions, WorkflowOrgProcess, WorkflowOrgTask} from "../domains/process-workflow.serializer";
import {CoreEndpointBase} from "../../../../services/endpoint-base.service";

@Component({
    standalone: false,
    selector: 'setup-workflow',
    templateUrl: './templates/setup-workflow.html'
})
export class SetupWorkflowView extends CoreEndpointBase implements OnDestroy {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    gridData: Array<WorkflowOrgProcess>;
    isLoading: boolean = false;
    processId: number;// Process id
    /*public get tasks (){
        return (this.gridData || []).reduce((r, c) => {
            let t = c.getAllTasks();
            if(t?.length)
            {
                r.push(t);
            }
            return r;
        }, []);
    }*/
    subscriber: Subscription;
    constructor(public router: Router, public override injector: Injector){ super(injector); }

    ngOnDestroy(){ this.subscriber?.unsubscribe(); }

    call=(processId: number)=>{
        this.processId = processId;
        //this.service.syncProcess$.emit(processId);
        const query = new ProcessWorkflowQueryOptions();
        query.parentId = processId;
        this.isLoading = true;
        this.getWorkflow(query).toPromise().then(r => {
            this.gridData = (r.entities || []).map(k => new WorkflowOrgProcess(k));
            this.isLoading = false;
        }, ()=>{this.isLoading = false;});
    }

    private getWorkflow(queryOptions: ProcessWorkflowQueryOptions) {
        return this.httpClient
            .get(`${this.baseSectorAPIUrl}/processWorkflow/all?${queryOptions.toQueryString()}`, this.requestHeaders)
            .pipe(
                map(data => data),
                catchError(error => this.handleError(error, () => this.getWorkflow(queryOptions)))
            );
    }

    addProcess(row: WorkflowOrgProcess){
        /*const inputData: any = {
            id: null,
            parentId: row.id,
            data: null
        };
        const popupHeaderOptions = { text: `Process`, desc: `` };
        this.pluginFactory.showProessCEPopup(inputData, popupHeaderOptions, ()=>{
            this.call(this.processId);
        });*/
    }

    editProcess(row: WorkflowOrgProcess){
        /*const inputData: any = {
            id: row.id,
            parentId: row.parentId,
            data: row
        };
        const popupHeaderOptions = { text: `Edit: ${row.name}`, desc: `` };
        this.pluginFactory.showProessCEPopup(inputData, popupHeaderOptions, ()=>{
            this.call(this.processId);
        });*/
    }

    addTask(row: WorkflowOrgTask){
        /*const inputData: any = {
            id: null,
            processId: row.id,
            data: {
                processId: row.id
            }
        };
        const popupHeaderOptions = { text: `Add Task`, desc: `` };
        this.pluginFactory.showTaskCEPopup(inputData, popupHeaderOptions, ()=>{
            this.call(this.processId);
        });*/
    }

    editTask(row: WorkflowOrgTask){
        /*const inputData: any = {
            id: row.id,
            processId: row.orgProcessId,
            data: row
        };
        const popupHeaderOptions = { text: `Edit Task`, desc: `` };
        this.pluginFactory.showTaskCEPopup(inputData, popupHeaderOptions, ()=>{
            this.call(this.processId);
        });*/
    }
}