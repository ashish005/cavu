import {
    Component,
    Injector,
    Input,
    TemplateRef,
    ViewChild
} from "@angular/core";
import {Subscription} from "rxjs";
import {CoreQueryOptions, CoreResource, OrgResourceService} from "@app-global";
import {ProjectAPIResolver} from "../services";

class WorkflowOrgProcessProjectMapperQueryOptions extends CoreQueryOptions{
    processId: string;
    processMasterType: string;
    constructor(model: any = {}){ super(model); }

    override toQueryString (){
        const obj = {
            processId: this.processId,
            processMasterType: this.processMasterType
        };
        return super.getParamByObject(obj);
    }
}

export class WorkflowOrgProcessProjectMapper extends CoreResource {
    name: string;
    description: string;
    parentId: number;
    sortOrder: string;

    isLocked: boolean;

    orgProcessId: number;
    nextOrgProcessId: number;
    startPhaseId: number;
    endPhaseId: number;

    nextOrgProcessName: string;
    startPhaseName: string;
    endPhaseName: string;
    childItems: Array<WorkflowOrgProcessProjectMapper>;
    constructor(model: any = <any>{}){
        super();
        const {
            id, name, description, parentId, sortOrder,
            orgProcessId, nextOrgProcessId, startPhaseId, endPhaseId,
            isLocked,
            nextOrgProcessName, startPhaseName, endPhaseName,
            childItems
        } = model;

        this.id = id;// process phase mapper id
        this.name = name;
        this.description = description;

        this.parentId = parentId;
        this.sortOrder = sortOrder;

        this.orgProcessId = orgProcessId;
        this.nextOrgProcessId = nextOrgProcessId;

        this.startPhaseId = startPhaseId;
        this.endPhaseId = endPhaseId;

        this.isLocked = isLocked;

        this.nextOrgProcessName = nextOrgProcessName;
        this.startPhaseName = startPhaseName;
        this.endPhaseName = endPhaseName;
        this.childItems = (childItems || []).map(r => new WorkflowOrgProcessProjectMapper(r));
    }
}

export class WorkflowOrgProcessProjectMapperSerializer {
    fromJson(json: any): WorkflowOrgProcessProjectMapper { return new WorkflowOrgProcessProjectMapper(json); }
    toJson(model: any): any {return model;}
}

@Component({
  standalone: false,
    templateUrl: './templates/org-project-process-workflow.html',
    styles: [`:host{ display: contents; }`]
})
export class OrgWiseProjectProcessWorkflowView extends OrgResourceService<WorkflowOrgProcessProjectMapper> {
    @ViewChild('popupOptionsTemplate', { static: true }) public popupOptionsTemplate: TemplateRef<any>;
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    isLoading: boolean = false;
    processList: Array<WorkflowOrgProcessProjectMapper>;
    tasks: Array<any>;
    context: any;
    @Input() id: any;// Parent Process Id;
    @Input() masterType: string;// Parent Master Type

    @Input() isCenterAlign: boolean = true;
    @Input() open_process_id: string;

    subscriber: Subscription;
    // processType = ORG_PROCESS_TYPE;
    // public get orgUserId(){ return this.coreService.currentUser.id; }
    constructor(public override injector: Injector, public apiResolver: ProjectAPIResolver) {
        super(injector, 'projectWorkflow/org-wide-project', new WorkflowOrgProcessProjectMapperSerializer());
    }

    ngOnInit() {
        this.isLoading = true;
        const queryOptions = new WorkflowOrgProcessProjectMapperQueryOptions();
        queryOptions.processId = this.id;
        queryOptions.processMasterType = this.masterType;
        this.subscriber = this.list(queryOptions).subscribe(r=> {
            this.processList = r.entities;
            this.isLoading = false;
        });
    }

    onProcessEndPhasesChange(process: WorkflowOrgProcessProjectMapper, phase: any){
        const { id, name } = phase;
        process.endPhaseId = id;
        process.endPhaseName = name;
    }

    onProcessStartPhasesChange(process: WorkflowOrgProcessProjectMapper, phase: any){
        const { id, name } = phase;
        process.startPhaseId = id;
        process.startPhaseName = name;
    }

  updateOrgProcess(e){}

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
}
