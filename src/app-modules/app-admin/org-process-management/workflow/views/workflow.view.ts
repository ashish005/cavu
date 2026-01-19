import {Component} from "@angular/core";
import {ASIDE_CLASS, ASIDE_SIZE, OrgWorkflowAPIResolver, SharedService, WorkflowPhaseStatusLookup} from "@app-global";
import { Phase, PhaseQueryOptions, PhaseStep, PhaseTransition, WorkflowNode } from "../domains/org-workflow-node.serializer";
import {OrgProcessPhaseService, WorkflowService} from "../services/workflow.service";
import {
  PhaseEditorComponent,
  TransitionEditorComponent,
  NotificationWizardComponent
} from "../components";
import {of} from "rxjs";


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
              private workflowService: WorkflowService,
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

    this.service.list(this.coreState).subscribe((p: any) => {
      this.phases = p.entities;
      this.loadTransitions(process.id);
    });
  }

  onPhaseCreate(_e: any){
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
      context: 'phase',
      process: this.selectedProcess,
      phase: phase,
      settings: {
        triggers: {
          onEnter: phase.notification?.notifyOnEnter,
          onExit: phase.notification?.notifyOnExit
        },
        templates: phase.notificationTemplates || []
      }
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
              notifyOnEnter: !!resp.triggers?.onEnter,
              notifyOnExit: !!resp.triggers?.onExit,
              channels: [],
              message: ''
            },
            notificationTemplates: resp.templates
          } as any;
        }
      }
      this.sharedService.destroy();
    };
    const failure = () => { this.sharedService.destroy(); };
    return this.sharedService.showCustomPopup(NotificationWizardComponent, popupOptions, input).then(success, failure);
  }

  onPhaseTemplates(phase: Phase) {
    const current = this.phases.find(p => p.id === phase.id) as any;
    const templates = current && current.notificationTemplates ? current.notificationTemplates : [];
    
    const input = {
      context: 'phase',
      process: this.selectedProcess,
      phase: phase,
      activeStep: 'templates',
      settings: {
        triggers: {
          onEnter: phase.notification?.notifyOnEnter,
          onExit: phase.notification?.notifyOnExit
        },
        templates: templates
      }
    };
    const popupHeaderOption = {
      text: `${phase.name} Templates`,
      desc: this.selectedProcess ? this.selectedProcess.name : ''
    };
    const popupOptions = { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
    const success = (resp: any) => {
      if (resp) {
        const index = this.phases.findIndex(p => p.id === phase.id);
        if (index > -1) {
          const updated = [...this.phases] as any[];
          // Update templates and potentially triggers if changed
          updated[index] = { 
              ...updated[index], 
              notificationTemplates: resp.templates,
              notification: {
                  ...updated[index].notification,
                  notifyOnEnter: !!resp.triggers?.onEnter,
                  notifyOnExit: !!resp.triggers?.onExit,
              }
          };
          this.phases = updated as Phase[];
        }
      }
      this.sharedService.destroy();
    };
    const failure = () => { this.sharedService.destroy(); };
    return this.sharedService.showCustomPopup(NotificationWizardComponent, popupOptions, input).then(success, failure);
  }

  onProcessNotification() {
    if (!this.selectedProcess) return of(true);
    const process: any = this.selectedProcess;
    const input = {
      context: 'process',
      process: this.selectedProcess,
      settings: {
        triggers: {
            onStart: process.notification?.notifyOnEnter,
            onComplete: process.notification?.notifyOnExit
        }, 
        templates: process.notificationTemplates || []
      }
    };
    const popupHeaderOption = {
      text: `${this.selectedProcess.name} Notifications`,
      desc: 'Process Level'
    };
    const popupOptions = { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
    const success = (resp: any) => {
        if (resp && this.selectedProcess) {
            const updatedProcess = {
                ...this.selectedProcess,
                notification: {
                    ...process.notification,
                    notifyOnEnter: !!resp.triggers?.onStart,
                    notifyOnExit: !!resp.triggers?.onComplete,
                },
                notificationTemplates: resp.templates
            };
            this.workflowService.update(this.selectedProcess.id, updatedProcess as any).subscribe();
            Object.assign(this.selectedProcess, updatedProcess);
        }
      this.sharedService.destroy();
    };
    const failure = () => { this.sharedService.destroy(); };
    return this.sharedService.showCustomPopup(NotificationWizardComponent, popupOptions, input).then(success, failure);
  }

  onPhaseSelected(phase: any) {
    this.selectedPhase = phase;
    const existing = this.phaseTransitions.find(t => t.fromPhaseId === phase.id) || null;
    const input = {
      id: existing ? existing.id : null,
      data: existing || phase,
      process: this.selectedProcess,
      phases: this.phases,
      statuses: this.phaseStatuses,
      transition: existing || {
        id: null,
        processId: this.selectedProcess ? this.selectedProcess.id : null,
        fromPhaseId: phase.id,
        toPhaseId: null,
        description: '',
        rule: ''
      }
    };
    const popupHeaderOption = { text: phase.name, desc: '' };
    const popupOptions= { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };

    const success = (resp: any) => {
      if (resp && this.selectedProcess) {
        this.saveTransition(this.selectedProcess.id, resp);
      }
      this.sharedService.destroy();
    };
    const failure = (_e: any) => { this.sharedService.destroy(); };
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

  loadTransitions(workflowId: number) {
    this.workflowService.getTransitions(workflowId).subscribe(t => {
      this.phaseTransitions = t || [];
    });
  }

  saveTransition(workflowId: number, payload: any) {
    const dto: PhaseTransition = {
      id: payload.id,
      processId: workflowId,
      fromPhaseId: payload.fromPhaseId,
      toPhaseId: payload.toPhaseId,
      description: payload.description,
      rule: payload.rule
    };
    const isUpdate = !!dto.id;
    const req$ = isUpdate
      ? this.workflowService.updateTransition(dto.id, dto)
      : this.workflowService.createTransition(workflowId, dto);
    req$.subscribe(() => {
      this.loadTransitions(workflowId);
    });
  }

  onTransitionEdit(transition: PhaseTransition) {
    if (!this.selectedProcess) {
      return;
    }
    const existing = this.phaseTransitions.find(t => t.id === transition.id) || transition;
    const input = {
      id: existing.id,
      data: existing,
      process: this.selectedProcess,
      phases: this.phases,
      statuses: this.phaseStatuses,
      transition: existing
    };
    const popupHeaderOption = {
      text: 'Transition',
      desc: this.getPhaseName(existing.fromPhaseId) + ' \u2192 ' + this.getPhaseName(existing.toPhaseId)
    };
    const popupOptions = { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
    const success = (resp: any) => {
      if (resp && this.selectedProcess) {
        this.saveTransition(this.selectedProcess.id, resp);
      }
      this.sharedService.destroy();
    };
    const failure = (e: any) => { this.sharedService.destroy(); };
    this.sharedService.showCustomPopup(TransitionEditorComponent, popupOptions, input).then(success, failure);
  }

  private getPhaseName(id: number | null | undefined): string {
    if (!id) {
      return '';
    }
    const p = this.phases.find(x => x.id === id);
    return p ? p.name : '';
  }
}
