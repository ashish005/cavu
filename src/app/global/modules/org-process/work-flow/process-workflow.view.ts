import { Component } from '@angular/core';
import {Phase, PhaseStep, PhaseTransition, ProcessNode} from './models';
import {WorkflowService} from "./services/workflow.service";
import {ASIDE_CLASS, ASIDE_SIZE} from "../../../popup-module/app-popup.enum";
import {SharedService} from "../../../shared.service";
import {PhaseEditorComponent} from "./components/phase-editor/phase-editor.component";
import {OrgWorkflowAPIResolver} from "../../../services";
import {WorkflowPhaseStatusLookup} from "../../../services/orgwise/process.resolver";
import {TransitionEditorComponent} from "./components/transition-editor/transition-editor.component";

@Component({
    standalone: false,
    selector: 'process-workflow',
    templateUrl: './process-workflow.html',
    styleUrls: [`./process-workflow.scss`]
})
export class ProcessWorkflowView {
    processTree: ProcessNode[] = [];
    phases: Phase[] = [];
    phaseStatuses: WorkflowPhaseStatusLookup[] = [];

    selectedProcess?: ProcessNode;
    selectedPhase: Phase | null = null;
    phaseTransitions: PhaseTransition[] = [];
    tabs: any = {
        phases: 'phases',
        tasks: 'tasks'
    };
    activeTab: string = this.tabs.phases;
    constructor(private lookup: OrgWorkflowAPIResolver, private api: WorkflowService, private sharedService: SharedService) {
        this.phaseStatuses = this.lookup.masterType.phaseStatus;
    }

    ngOnInit() {
        this.api.getAllProcess().subscribe(r => this.processTree = r.entities);
    }

    onProcessSelected(process: any) {
        this.selectedProcess = process;
        this.selectedPhase = null;
        this.api.getPhases(process.id).subscribe(p => this.phases = p.entities);
    }

    onPhaseCreate(e: any){
        debugger
        const input = {
            data: {
                processId: this.selectedProcess?.id
            }
        };
        this.showPhasePopup(input, { text: 'Create Phase', desc: '' });
    }

    onPhaseEdit(phase: any) {
        const input = {
            id: phase.id,
            data: phase
        };
        input.data.processId = this.selectedProcess?.id;
        this.showPhasePopup(input, { text: phase.name, desc: '' });
    }

    showPhasePopup(data: any, popupHeaderOption: any){
        const popupOptions = { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
        const success = (resp: any) => { this.sharedService.destroy(); };
        const failure = (e: any) => { this.sharedService.destroy(); };
        return this.sharedService.showCustomPopup(PhaseEditorComponent, popupOptions, data).then(success, failure);
    }

    onPhaseNotification(phase: Phase){

    }

    onPhaseTemplates(phase: Phase) {}

    onPhaseSelected(phase: any) {
        this.selectedPhase = phase;
        const input = {
            id: phase.id,
            data: phase,
            process: this.selectedProcess,
            phases: this.phases,
            statuses: this.phaseStatuses
        };
        const popupHeaderOption = { text: phase.name, desc: '' };
        const popupOptions= { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };

        const success = (resp: any) => { this.sharedService.destroy(); };
        const failure = (e: any) => { this.sharedService.destroy(); };
        return this.sharedService.showCustomPopup(TransitionEditorComponent, popupOptions, input).then(success, failure);
    }
    openTab(tab: string) {
        this.activeTab = tab;
    }

    onShowStepTask(phaseStep: PhaseStep){}
    onEditStep(phaseStep: PhaseStep){}
}
