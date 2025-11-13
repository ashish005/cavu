import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { catchError, map } from "rxjs";
import {ASIDE_CLASS, ASIDE_SIZE, CoreEndpointBase, SharedService} from "@app-global";
import {ProcessPhase} from "../components/process-phase";

class OrgProcess {
    id: number;
    name: string;
    parentId: number;
    description: string;

    processStatus: string;
    processStatusOn: string;
    manualStatus: string;
    manualStatusOn: string;

    constructor(model: any = <any>{}) {
        const { id, parentId, name, description, processStatus, processStatusOn, manualStatus, manualStatusOn } = model;
        this.id = id;
        this.parentId = parentId;
        this.name = name;
        this.description = description;
        this.processStatus = processStatus;
        this.processStatusOn = processStatusOn;
        this.manualStatus = manualStatus;
        this.manualStatusOn = manualStatusOn;
    }
}

@Component({
  standalone: false,
  templateUrl: './layout.html'
})
export class Layout extends CoreEndpointBase implements OnInit {
    public actionTemplate: TemplateRef<any>;
    public viewNavigations: any = [
        { name: 'Process', sortOrder: 2, route: 'all'},
        { name: 'Tasks', sortOrder: 3, route: 'task'},
        { name: 'Scheduled Tasks', sortOrder: 4, route: 'scheduled'}
    ];
    orgProcessList: Array<OrgProcess>;
    activeOrgProcess: OrgProcess;
    constructor(public router: Router,
                public activatedRoute: ActivatedRoute,
                public override injector: Injector,
                public sharedService: SharedService){
        super(injector);
    }
    ngOnInit(){
        // this.service.syncProcess$.subscribe(p => {
        //     this.activeOrgProcess = (this.orgProcessList || []).find(r => r.id == p);
        // });
        this.refreshList();
    }

    refreshList=()=>{
        this.getOrgRootProcesses().toPromise().then(r => {
            this.orgProcessList = (r.entities || []).map(k => new OrgProcess(k));
        }, ()=>{ this.orgProcessList = []; });
    }

    public getOrgRootProcesses() {
        const url: string = this.baseSectorAPIUrl + `/processWorkflow/root/${super.apiVersion}`;
        return this.httpClient.get(url, this.requestHeaders)
            .pipe(
                map(data => data),
                catchError(error => this.handleError(error, () => this.getOrgRootProcesses()))
            );
    }

    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
    }

    routeToUrl=(item)=> this.router.navigate([item.id], { relativeTo: this.activatedRoute.parent });
    showProcesses = (item) => this.router.navigate([item.id, 'processes'], { relativeTo: this.activatedRoute.parent });
    showProcessTasks = (item) => this.router.navigate([item.id, 'tasks'], { relativeTo: this.activatedRoute.parent });
    showTaskSchedules = (item) => this.router.navigate([item.id, 'schedules'], { relativeTo: this.activatedRoute.parent });

    showOrgProcessWorkflow(row: OrgProcess) {
        /*const { id, name } = row;
        const data = {
            id: id
        };
        var popupHeaderOption = {text: `${name}`, desc: `Services for ${name}`};
        this.pluginFactory.showOrgWorkflowPopup(data, popupHeaderOption, ()=>{});*/
    }

    showProcessPhases() {
        const inputData = {
            id: null,
            isCenterAlign: true,
        };
        const popup = { header: {text: `Process Phases`, desc: ``}, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };

        const success = (resp: any)=>{ this.sharedService.destroy(); };
        const failure = ()=>{ this.sharedService.destroy(); };
        this.sharedService.showCustomPopup(ProcessPhase, popup, inputData).then(success, failure);
    }

    createOrgProcess(){
        const inputData: any = {
            id: null,
            parentId: null,
            data: null
        };
        /*const popupHeaderOptions = { text: `New Process`, desc: `` };
        this.pluginFactory.showProessCEPopup(inputData, popupHeaderOptions, ()=>{
            this.refreshList();
        });*/
    }

    showScheduledTasks(){
        //this.pluginFactory.showTaskScheduledListPopup();
    }
}

@Component({
  standalone: false,
  templateUrl: './sublayout.html'
})
export class SubLayout implements OnInit {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    isLoading: boolean = false;
    processId: number;
    constructor(public router: Router, public activatedRoute: ActivatedRoute){}

    ngOnInit(){
        this.activatedRoute.params.subscribe(params => {
            this.processId = params['processId'];
            this.call(this.processId);
        });
    }

    call=(processId: number)=>{
        //this.service.syncProcess$.emit(processId);
    }

    addProcess(){
        const inputData: any = {
            id: null,
            parentId: this.processId,
            data: null
        };
        const popupHeaderOptions = { text: `Process`, desc: `` };
        /*this.pluginFactory.showProessCEPopup(inputData, popupHeaderOptions, ()=>{
            this.call(this.activatedRoute.snapshot.params.processId);
        });*/
    }
    addTask(){
        const inputData: any = {
            id: null,
            processId: this.processId,
            data: { processId: this.processId }
        };
        const popupHeaderOptions = { text: `Add Task`, desc: `` };
        /*this.pluginFactory.showTaskCEPopup(inputData, popupHeaderOptions, ()=>{
            this.call(this.processId);
        });*/
    }
}
