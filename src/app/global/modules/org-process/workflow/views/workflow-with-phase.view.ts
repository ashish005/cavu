import {
    Component,
    Injector,
    Input, OnInit,
    TemplateRef,
    ViewChild
} from "@angular/core";
import {Subscription} from "rxjs";
import {
    ProcessWorkflowAdvance,
    ProcessWorkflowAdvanceQueryOptions,
    ProcessWorkflowLookup, ProcessWorkflowPhase, WorkflowLookupStages
} from "../domains/process-workflow-advance.serializer";
import {AdvancedWorkflowService} from "../services/process-workflow.service";
import {FormBuilder} from "@angular/forms";
@Component({
    standalone: false,
    selector: 'workflow-with-phase',
    templateUrl: './templates/workflow-with-phase.html',
    providers: [AdvancedWorkflowService]
})
export class WorkflowWithPhaseView implements OnInit {
    @ViewChild('popupOptionsTemplate', { static: true }) public popupOptionsTemplate: TemplateRef<any>;
    //@ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    isLoading: boolean = false;
    processList: Array<ProcessWorkflowAdvance>;
    @Input() id: number;
    @Input() isCenterAlign: boolean = false;
    constructor(public fb: FormBuilder, public service: AdvancedWorkflowService) { }
    subscriber: Subscription;
    lookup: ProcessWorkflowLookup;

    orgProjectFilter = (listItem: ProcessWorkflowAdvance, compareItem: WorkflowLookupStages)=> {
        return (listItem.startPhaseId == compareItem.id);
    };

    ngOnInit() { this.call(this.id); }

    //public get orgUserId(){ return this.coreService.currentUser.id; }
    call=(processId: number)=>{
        this.id = processId;
        const query = new ProcessWorkflowAdvanceQueryOptions();
        query.parentId = processId;
        this.isLoading = true;
        this.subscriber = this.service.list(query).subscribe(r=> {
            this.processList = r.entities;
            this.lookup = r.data;
            this.isLoading = false;
        }, ()=>{ this.isLoading = false; });
    }
    onProcessEndPhasesChange(process: ProcessWorkflowAdvance, phase: any){
        const { id, name } = phase;
        process.endPhaseId = id;
        process.endPhaseName = name;
    }
    onProcessStartPhasesChange(process: ProcessWorkflowAdvance, phase: any){
        const { id, name } = phase;
        process.startPhaseId = id;
        process.startPhaseName = name;
    }

    handlePhaseClick(phase: ProcessWorkflowPhase) {
        alert(`Phase clicked: ${phase.name}`);
    }

    editProcess(row: ProcessWorkflowAdvance){
        const inputData: any = {
            id: row.id,
            parentId: row.parentId,
            data: row
        };
        const popupHeaderOptions = { text: `Edit: ${row.name}`, desc: `` };
        // this.pluginFactory.showProessCEPopup(inputData, popupHeaderOptions, ()=>{
        //     this.call(this.processId);
        // });
    }

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