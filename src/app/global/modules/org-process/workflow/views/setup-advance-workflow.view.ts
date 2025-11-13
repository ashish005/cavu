import {
    Component,
    Injector,
    Input,
    TemplateRef,
    ViewChild
} from "@angular/core";
import {Subscription, catchError, map} from "rxjs";

import {
    ProcessWorkflowAdvance,
    ProcessWorkflowAdvanceQueryOptions,
    ProcessWorkflowLookup, ProcessWorkflowPhase, WorkflowLookupStages
} from "../domains/process-workflow-advance.serializer";
import {AdvancedWorkflowService} from "../services/process-workflow.service";
import {FormBuilder} from "@angular/forms";

@Component({
    standalone: false,
    selector: 'setup-advance-workflow',
    templateUrl: './templates/advance-workflow.html',
    providers: [AdvancedWorkflowService]
})
export class SetupAdvanceWorkflowView {
    @ViewChild('popupOptionsTemplate', { static: true }) public popupOptionsTemplate: TemplateRef<any>;
    //@ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    isLoading: boolean = false;
    processList: Array<ProcessWorkflowAdvance>;
    tasks: Array<any>;
    context: any;
    @Input() isCenterAlign: boolean = true;
    @Input() open_process_id: string;

    constructor(public fb: FormBuilder, public service: AdvancedWorkflowService) { }


    subscriber: Subscription;
    lookup: ProcessWorkflowLookup;
    processId: number;
    orgProjectFilter = (listItem: ProcessWorkflowAdvance, compareItem: WorkflowLookupStages)=> {
        return (listItem.startPhaseId == compareItem.id);
    };
    //public get orgUserId(){ return this.coreService.currentUser.id; }

    call=(processId: number)=>{
        this.processId = this.processId;
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