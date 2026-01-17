import {Component, OnInit} from "@angular/core";
import {ASIDE_CLASS, ASIDE_SIZE, OrgWorkflowAPIResolver, SharedService, WorkflowPhaseStatusLookup} from "@app-global";
import { Phase, PhaseQueryOptions, PhaseStep, PhaseTransition, WorkflowNode } from "../domains/org-workflow-node.serializer";
import {OrgProcessPhaseService} from "../services/workflow.service";
import {
  PhaseEditorComponent,
  PhaseNotificationComponent,
  TransitionEditorComponent,
  WorkflowNotificationTemplateComponent
} from "../components";


@Component({
  standalone: false,
  templateUrl: './templates/workflow.html'
})
export class OrgWorkflowView {
  coreState: PhaseQueryOptions = new PhaseQueryOptions();
  processTree: WorkflowNode[] = [];
  phases: Phase[] = [];
  phaseStatuses: WorkflowPhaseStatusLookup[] = [];

  selectedProcess?: WorkflowNode;
  selectedPhase: Phase | null = null;
  phaseTransitions: PhaseTransition[] = [];
  tabs: any = {
    phases: 'phases',
    tasks: 'tasks'
  };
  activeTab: string = this.tabs.phases;
  selectedStepForTasks: PhaseStep | null = null;
  constructor(private lookup: OrgWorkflowAPIResolver,
              private service: OrgProcessPhaseService,
              private sharedService: SharedService) {
    this.phaseStatuses = this.lookup.masterType.phaseStatus;
  }

  ngOnInit() {
    this.service.getAllProcess().subscribe(r => this.processTree = r.entities);
  }

  onProcessSelected(process: any) {
    this.selectedProcess = process;
    this.selectedPhase = null;

    this.coreState.workflowId = process.id;

    this.service.list(this.coreState).subscribe(p => {
      this.phases = p.entities;
      //this.loadTransitions(process.id);
    });
  }

  onPhaseCreate(e: any){
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
    const input = {
      process: this.selectedProcess,
      phase: phase
    };
    const popupHeaderOption = {
      text: `${phase.name} Notifications`,
      desc: this.selectedProcess ? this.selectedProcess.name : ''
    };
    const popupOptions = { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
    const success = (resp: any) => {
      if (resp) {
        const index = this.phases.findIndex(p => p.id === phase.id);
        if (index > -1) {
          const current: any = this.phases[index];
          this.phases[index] = {
            ...current,
            notification: {
              notifyOnEnter: !!resp.notifyOnEnter,
              notifyOnExit: !!resp.notifyOnExit,
              channels: resp.channels || [],
              message: resp.message || ''
            }
          } as any;
        }
      }
      this.sharedService.destroy();
    };
    const failure = () => { this.sharedService.destroy(); };
    return this.sharedService.showCustomPopup(PhaseNotificationComponent, popupOptions, input).then(success, failure);
  }

  onPhaseTemplates(phase: Phase) {
    const current = this.phases.find(p => p.id === phase.id) as any;
    const templates = current && current.notificationTemplates ? current.notificationTemplates : [];
    const input = {
      process: this.selectedProcess,
      phase: phase,
      templates: templates
    };
    const popupHeaderOption = {
      text: `${phase.name} Templates`,
      desc: this.selectedProcess ? this.selectedProcess.name : ''
    };
    const popupOptions = { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
    const success = (resp: any) => {
      if (resp && resp.templates) {
        const index = this.phases.findIndex(p => p.id === phase.id);
        if (index > -1) {
          const updated = [...this.phases] as any[];
          updated[index] = { ...updated[index], notificationTemplates: resp.templates };
          this.phases = updated as Phase[];
        }
      }
      this.sharedService.destroy();
    };
    const failure = () => { this.sharedService.destroy(); };
    return this.sharedService.showCustomPopup(WorkflowNotificationTemplateComponent, popupOptions, input).then(success, failure);
  }

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

    const success = (resp: any) => {
      if (resp && this.selectedProcess) {
        //this.saveTransition(this.selectedProcess.id, resp);
      }
      this.sharedService.destroy();
    };
    const failure = (e: any) => { this.sharedService.destroy(); };
    return this.sharedService.showCustomPopup(TransitionEditorComponent, popupOptions, input).then(success, failure);
  }
  openTab(tab: string) {
    this.activeTab = tab;
  }

  onShowStepTask(phaseStep: PhaseStep){
    this.selectedStepForTasks = phaseStep;
    this.activeTab = this.tabs.tasks;
  }

  onEditStep(phaseStep: PhaseStep){
    const phase = this.phases.find(p => p.id === phaseStep.phaseId);
    if (phase) {
      this.onPhaseEdit(phase);
    }
  }

  /*loadTransitions(processId: number) {
    this.service.getTransitions(processId).subscribe(t => {
      if (t && t.length) {
        this.phaseTransitions = t;
      } else {
        this.seedTransitions(processId);
      }
    });
  }

  seedTransitions(processId: number) {
    const ordered = [...this.phases].sort((a, b) => a.sortOrder - b.sortOrder);
    const candidates: PhaseTransition[] = [];
    for (let i = 0; i < ordered.length - 1; i++) {
      const from = ordered[i];
      const to = ordered[i + 1];
      candidates.push({
        id: 0,
        processId: processId,
        fromPhaseId: from.id,
        toPhaseId: to.id,
        description: `${from.name} → ${to.name}`
      });
    }
    if (!candidates.length) {
      this.phaseTransitions = [];
      return;
    }
    const requests = candidates.map(c => this.service.createTransition(c));
    forkJoin(requests).subscribe(() => {
      this.service.getTransitions(processId).subscribe(t => {
        this.phaseTransitions = t;
      });
    });
  }

  saveTransition(processId: number, payload: any) {
    const dto: PhaseTransition = {
      id: payload.id,
      processId: processId,
      fromPhaseId: payload.fromPhaseId,
      toPhaseId: payload.toPhaseId,
      description: payload.description,
      rule: payload.rule
    };
    const isUpdate = !!dto.id;
    const req$ = isUpdate ? this.service.updateTransition(dto.id, dto) : this.service.createTransition(dto);
    req$.subscribe(() => {
      this.loadTransitions(processId);
    });
  }*/
}


