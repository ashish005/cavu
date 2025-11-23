import {
    Component,
    Injector,
    Input, OnDestroy, OnInit,
    TemplateRef,
    ViewChild
} from "@angular/core";
import {Subscription} from "rxjs";
import {FormBuilder} from "@angular/forms";
import {OrgProcess, OrgProcessQueryOptions, OrgProcessSerializer} from "../domains/org-process.serializer";
import {OrgResourceService} from "@app-global";
import {PipelineAPIResolver} from "../resolver/api.resolver";
class ProcessWorkflow extends OrgProcess {
    childItems: Array<ProcessWorkflow>;
    constructor(model: any = <any>{}){
        super(model);
        const { childItems } = model;
        this.childItems = (childItems || []).map(r => new ProcessWorkflow(r));
    }
}
class ProcessWorkflowSerializer {
    //fromDataJson(json: any) { return new ProcessWorkflowLookup(json); }
    fromJson(json: any): ProcessWorkflow { return new ProcessWorkflow(json); }
    toJson(model: any): any {return model;}
}
@Component({
    standalone: false,
    selector: 'phase-workflow',
    templateUrl: './templates/workflow-with-phase.html'
})
export class WorkflowWithPhaseView extends OrgResourceService<ProcessWorkflow> implements OnInit, OnDestroy {
    @ViewChild('popupOptionsTemplate', { static: true }) public popupOptionsTemplate: TemplateRef<any>;
    //@ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    isLoading: boolean = false;
    processList: Array<ProcessWorkflow>;
    @Input() id: number;
    @Input() isCenterAlign: boolean = false;
    subscriber: Subscription;
    constructor(public fb: FormBuilder, public override injector: Injector, private apiResolver: PipelineAPIResolver) { super(injector, `processWorkflow/advanced`, new ProcessWorkflowSerializer()); }
    ngOnInit() { this.call(this.id); }
    ngOnDestroy() { this.subscriber.unsubscribe(); }
    //public get orgUserId(){ return this.coreService.currentUser.id; }
    call=(processId: number)=>{
        this.id = processId;
        const query = new OrgProcessQueryOptions();
        query.parentId = processId;
        this.isLoading = true;
        this.subscriber = super.list(query).subscribe(r=> {
            this.processList = r.entities;
            this.isLoading = false;
        }, ()=>{ this.isLoading = false; });
    }
    editProcess(row: OrgProcess){
        const inputData: any = { id: row.id, parentId: row.parentId, data: null };
        const popupHeaderOptions = { text: `Edit: ${row.name}`, desc: `` };
        this.apiResolver.ceProcessPopup(inputData, popupHeaderOptions, ()=>{
            this.call(this.id);
        });
    }

    addProcess(row: OrgProcess){
        const inputData: any = { id: null, parentId: row.id, data: null };
        const popupHeaderOptions = { text: `New Process`, desc: `` };
        this.apiResolver.ceProcessPopup(inputData, popupHeaderOptions, ()=>{
            this.call(this.id);
        });
    }
    addTask(process: any){
        const list = (this.processList || [])[0].childItems || [];
        const inputData: any = { id: null, processId: process?.id, processList: list };
        const popupHeaderOptions = { text: `New Task`, desc: `` };
        this.apiResolver.ceOrgTaskPopup(inputData, popupHeaderOptions, ()=>{});
    }
}