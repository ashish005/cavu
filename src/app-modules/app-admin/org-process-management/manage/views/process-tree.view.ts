import {Component, Injector, OnDestroy, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ASIDE_CLASS, ASIDE_SIZE, CoreEndpointBase, CoreProcessFactory, SharedService} from "@app-global";
import {OrgProcess, OrgProcessQueryOptions} from "../domains/org-process.serializer";
import {catchError, map, Subscription} from "rxjs";
import {PipelineAPIResolver} from "../resolver/api.resolver";
@Component({
  standalone: false,
  templateUrl: './templates/process-tree.html',
  styles: [`:host {display: contents;}`]
})
export class ProcessTreeView extends CoreEndpointBase implements OnInit {
    @ViewChild('setupWorkflow', { static: true }) public setupWorkflow: any;
    public actionTemplate: TemplateRef<any>;
    public viewNavigations: any = [
        { name: 'Process', sortOrder: 2, route: 'all'},
        { name: 'Tasks', sortOrder: 3, route: 'task'},
        { name: 'Scheduled Tasks', sortOrder: 4, route: 'scheduled'}
    ];
    orgProcessList: Array<OrgProcess>;
    activeOrgProcess: OrgProcess;
    constructor(public router: Router,
                public activatedRoute: ActivatedRoute, private pluginFactory: CoreProcessFactory,
                public override injector: Injector, private apiResolver: PipelineAPIResolver,
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
        this.getOrgRootProcess().toPromise().then(r => {
            this.orgProcessList = (r.entities || []).map(k => new OrgProcess(k));
        }, ()=>{ this.orgProcessList = []; });
    }
    public getOrgRootProcess() {
        const url: string = this.baseSectorAPIUrl + `/processWorkflow/root/${super.apiVersion}`;
        return this.httpClient.get(url, this.requestHeaders)
            .pipe(
                map(data => data),
                catchError(error => this.handleError(error, () => this.getOrgRootProcess()))
            );
    }
    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
    }
    showProcesses = (item) => this.router.navigate([item.id, 'process'], { relativeTo: this.activatedRoute.parent });
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
    onProcessSelect=(item: OrgProcess)=> {
        this.activeOrgProcess = item;
        this.setupWorkflow.call(item.id);
    }
    addProcess(data?: any){
        const inputData: any = { id: null, parentId: data?.id, data: null };
        const popupHeaderOptions = { text: `New Process`, desc: `` };
        this.apiResolver.ceProcessPopup(inputData, popupHeaderOptions, ()=>{
            this.refreshList();
            if(this.activeOrgProcess) {
                this.setupWorkflow.call(this.activeOrgProcess.id);
            }
        });
    }
    addTask(process: any){
        const inputData: any = { id: null, processId: process?.id, processList: this.orgProcessList };
        const popupHeaderOptions = { text: `New Task`, desc: `` };
        this.apiResolver.ceOrgTaskPopup(inputData, popupHeaderOptions, ()=>{});
    }
    showScheduledTasks(){
        //this.pluginFactory.showTaskScheduledListPopup();
    }
}