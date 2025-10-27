import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectWorkflow, ProjectWorkflowQueryOptions} from "../domains/project-workflow.serializer";
import {Subscription} from "rxjs";
import { ProjectAPIResolver, ProjectWorkflowService } from "../services";
import {LookupProcessPhase} from "../domains/project.lookup";

@Component({
  standalone: false,
    templateUrl: './templates/workflow.html'
})
export class WorkflowView implements OnInit {
    orgProjectFilter = (listItem: ProjectWorkflow, compareItem: LookupProcessPhase)=> {
        return (listItem.startPhaseId == compareItem.id);
    };
    pageTitle: string;
    pageIcon: string;
    desc: string;

    isCenterAlign: boolean = true;
    isLoading: boolean;
    subscriber: Subscription;
    processList: Array<ProjectWorkflow>;

    projectId: string;
    customerId: string;
    moduleId: string;
    coreState: ProjectWorkflowQueryOptions = new ProjectWorkflowQueryOptions();
    constructor(public activatedRoute: ActivatedRoute, public apiResolver: ProjectAPIResolver, public service: ProjectWorkflowService) {
        const { data, parent} = this.activatedRoute.snapshot;
        // this.pageTitle = data.title || parent?.data?.title;
        // this.pageIcon = data.icon || parent?.data?.icon;
        // this.desc = data.title || parent?.data?.desc;
    }

    ngOnInit() {
        this.coreState.customerId = this.customerId;
        this.coreState.projectId = this.projectId;
        this.coreState.moduleId = this.moduleId;
        this.refreshProjectProcess();
    }

    refreshProjectProcess(){
        this.isLoading = true;
        this.subscriber = this.service.list(this.coreState).subscribe(r=> {
            this.processList = r.entities;
            this.isLoading = false;
        });
    }

    onStartStatusChange(process, status: LookupProcessPhase){
        const { id, name } = status;
        process.startPhaseId = id;
        process.startPhaseName = name;
    }

    onEndStatusChange(process, status: LookupProcessPhase){
        const { id, name } = status;
        process.endPhaseId = id;
        process.endPhaseName = name;
    }

    onStartChange(process: any, dt: string, isStarted: boolean){
        const data = {
            processId: process.id,
            moduleId: this.moduleId,
            dt: dt,
            //orgUserId: this.service.orgUserId,
            isStarted: isStarted
        };
        this.updateProcessWorkflow(process, data);
    }

    startProcessNow(process: any){
        const data = {
            processId: process.id,
            moduleId: this.moduleId,
            dt: new Date().toISOString().split('T')[0],
            //orgUserId: this.service.orgUserId,
            isStarted: true
        };
        this.updateProcessWorkflow(process, data)
    }

    completeProcessNow(process: any){
        const data = {
            processId: process.id,
            moduleId: this.moduleId,
            dt: new Date().toISOString().split('T')[0],
            //orgUserId: this.service.orgUserId,
            isStarted: false
        };
        this.updateProcessWorkflow(process, data)
    }

    updateProcessWorkflow(process, data){
        const success = (resp)=> {
            this.isLoading = false;
            this.refreshProjectProcess();
        };

        const error = (resp)=> {  this.isLoading = false; };
        this.service.updateWorkflow(data).toPromise().then(success, error);
    }
}
