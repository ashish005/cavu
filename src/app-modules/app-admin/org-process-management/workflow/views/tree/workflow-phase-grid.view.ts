import {Component, Optional} from "@angular/core";
import {OrgWorkflowView} from "../workflow.view";
import {ASIDE_CLASS, ASIDE_SIZE, OrgWorkflowAPIResolver, SharedService} from "@app-global";
import {OrgWorkflowPhase, OrgWorkflowPhaseStep} from "../../domains/org-workflow-node.serializer";
import {NotificationWizardComponent, PhaseEditorComponent, TransitionEditorComponent} from "../../components";
import {OrgWorkflowPhaseService, WorkflowService} from "../../services/workflow.service";
import {ActivatedRoute, Router} from "@angular/router";
import {of} from "rxjs";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  standalone: false,
  templateUrl: './templates/workflow-phase-grid.html',
  animations: [
    trigger('fade', [
        transition(':enter', [
            style({ opacity: 0 }),
            animate('200ms ease-out', style({ opacity: 1 }))
        ]),
        transition(':leave', [
            animate('200ms ease-out', style({ opacity: 0 }))
        ])
    ])
  ]
})
export class OrgWorkflowPhaseGridView {
  constructor(
      @Optional() public parent: OrgWorkflowView,
      private sharedService: SharedService,
      private service: OrgWorkflowPhaseService,
      private workflowService: WorkflowService,
      private lookup: OrgWorkflowAPIResolver,
      private router: Router,
      private route: ActivatedRoute
  ) {}

    onPhaseCreate(_e: any){
        const input = {
            data: {
                processId: this.parent?.selectedProcess?.id
            }
        };
        this.showPhasePopup(input, { text: 'Create Phase', desc: '' });
    }

    onPhaseEdit(phase: any) {
        const input = {
            id: phase.id,
            data: phase
        };
        if(this.parent && this.parent.selectedProcess) {
            input.data.processId = this.parent.selectedProcess.id;
        }
        this.showPhasePopup(input, { text: phase.name, desc: '' });
    }

    showPhasePopup(data: any, popupHeaderOption: any){
        const popupOptions = { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
        const success = (resp: any) => {
            this.sharedService.destroy();
            if(resp) this.parent?.reloadPhases();
        };
        const failure = (e: any) => { this.sharedService.destroy(); };
        return this.sharedService.showCustomPopup(PhaseEditorComponent, popupOptions, data).then(success, failure);
    }

    onPhaseNotification(phase: OrgWorkflowPhase){
        const input = {
            context: 'phase',
            process: this.parent?.selectedProcess,
            phase: phase,
            userTypes: this.lookup.masterType.userTypes,
            notificationTypes: this.lookup.masterType.notificationTypes,
            userRoles: this.lookup.masterType.userRoles,
            settings: {
                notifications: phase.notifications || [],
                workflowEvents: this.lookup.masterType.workflowEvents
            }
        };
        const popupHeaderOption = {
            text: `Phase Notification Wizard: ${phase.name}`,
            desc: `Configure notifications for ${this.parent?.selectedProcess ? this.parent.selectedProcess.name : ''}`
        };
        const popupOptions = { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_75 };
        const success = (resp: any) => {
            if (resp && resp.notifications && this.parent) {
                const index = this.parent.phases.findIndex(p => p.id === phase.id);
                if (index > -1) {
                    const current: any = this.parent.phases[index];
                    const updatedPhase = {
                        ...current,
                        notifications: resp.notifications
                    };
                    this.parent.phases[index] = updatedPhase as any;
                    this.service.update(phase.id, updatedPhase).subscribe();
                }
            }
            this.sharedService.destroy();
        };
        const failure = () => { this.sharedService.destroy(); };
        return this.sharedService.showCustomPopup(NotificationWizardComponent, popupOptions, input).then(success, failure);
    }

    onStepNotification(step: OrgWorkflowPhaseStep) {
        const input = {
            context: 'step',
            process: this.parent?.selectedProcess,
            step: step,
            userTypes: this.lookup.masterType.userTypes,
            notificationTypes: this.lookup.masterType.notificationTypes,
            userRoles: this.lookup.masterType.userRoles,
            settings: {
                notifications: step.notifications || [],
                workflowEvents: this.lookup.masterType.workflowEvents
            }
        };
        const popupHeaderOption = {
            text: `Phase Step Notification Wizard: ${step.name}`,
            desc: `Configure notifications for ${this.parent?.selectedProcess ? this.parent.selectedProcess.name : ''}`
        };
        const popupOptions = { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_75 };
        const success = (resp: any) => {
            if (resp && resp.notifications && this.parent) {
                // Find phase and step to update
                const phaseIndex = this.parent.phases.findIndex(p => p.id === step.phaseId);
                if (phaseIndex > -1) {
                    const phase = this.parent.phases[phaseIndex];
                    const stepIndex = phase.steps.findIndex(s => s.id === step.id);

                    if (stepIndex > -1) {
                        const updatedStep = {
                            ...phase.steps[stepIndex],
                            notifications: resp.notifications
                        };

                        // Update step in phase
                        const updatedSteps = [...phase.steps];
                        updatedSteps[stepIndex] = updatedStep;

                        this.parent.phases[phaseIndex] = {
                            ...phase,
                            steps: updatedSteps
                        };

                        // Persist changes
                        this.service.update(phase.id, this.parent.phases[phaseIndex] as any).subscribe();
                    }
                }
            }
            this.sharedService.destroy();
        };
        const failure = () => { this.sharedService.destroy(); };
        return this.sharedService.showCustomPopup(NotificationWizardComponent, popupOptions, input).then(success, failure);
    }

    onPhaseTemplates(phase: OrgWorkflowPhase) {
        // Deprecated or legacy? Merging into main notification flow logic if possible.
        // But keeping it working with new structure just in case.
        // const current = this.parent.phases.find(p => p.id === phase.id) as any;

        const input = {
            context: 'phase',
            process: this.parent?.selectedProcess,
            phase: phase,
            activeStep: 'templates',
            userTypes: this.lookup.masterType.userTypes,
            notificationTypes: this.lookup.masterType.notificationTypes,
            userRoles: this.lookup.masterType.userRoles,
            settings: {
                notifications: phase.notifications || [],
                workflowEvents: this.lookup.masterType.workflowEvents
            }
        };
        const popupHeaderOption = {
            text: `Phase Notification Wizard: ${phase.name}`,
            desc: `Configure notifications for ${this.parent?.selectedProcess ? this.parent.selectedProcess.name : ''}`
        };
        const popupOptions = { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_75 };
        const success = (resp: any) => {
            if (resp && resp.notifications && this.parent) {
                const index = this.parent.phases.findIndex(p => p.id === phase.id);
                if (index > -1) {
                    const updated = [...this.parent.phases] as any[];
                    updated[index] = {
                        ...updated[index],
                        notifications: resp.notifications
                    };
                    this.parent.phases = updated as OrgWorkflowPhase[];
                    this.service.update(phase.id, updated[index]).subscribe();
                }
            }
            this.sharedService.destroy();
        };
        const failure = () => { this.sharedService.destroy(); };
        return this.sharedService.showCustomPopup(NotificationWizardComponent, popupOptions, input).then(success, failure);
    }

    onPhaseTransitions(phase: OrgWorkflowPhase) {
        const existingTransitions = (this.parent?.phaseTransitions || []).filter(t => t.fromPhaseId === phase.id);

        const input = {
            process: this.parent?.selectedProcess,
            phases: this.parent?.phases,
            statuses: this.parent?.phaseStatuses,
            transitions: existingTransitions,
            sourcePhaseId: phase.id,
            // sourceStatusId: null // Optional, let user pick status
        };

        const popupOptions = { header: { text: `Manage Transitions: ${phase.name}`, desc: 'Configure transitions exiting this phase' }, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_75 };
        const success = (resp: any) => {
            this.sharedService.destroy();
            if(resp) {
                const saves: any[] = resp.save || [];
                const deletes: number[] = resp.delete || [];

                if (saves.length > 0 || deletes.length > 0) {
                    const workflowId = this.parent?.selectedProcess?.id || 0;
                    this.workflowService.bulkUpdateTransitions(workflowId, { saves, deletes }).subscribe(() => {
                        this.parent?.loadTransitions(workflowId);
                    });
                }
            }
        };
        const failure = (e: any) => { this.sharedService.destroy(); };
        this.sharedService.showCustomPopup(TransitionEditorComponent, popupOptions, input).then(success, failure);
    }

    onPhaseSelected(phase: any) {
      if(!this.parent) return of(true);
        this.parent.selectedPhase = phase;
        const existing = this.parent.phaseTransitions.find(t => t.fromPhaseId === phase.id) || null;
        const input = {
            id: existing ? existing.id : null,
            data: existing || phase,
            process: this.parent.selectedProcess,
            phases: this.parent.phases,
            statuses: this.parent.phaseStatuses,
            transition: existing || {
                id: null,
                processId: this.parent.selectedProcess ? this.parent.selectedProcess.id : null,
                fromPhaseId: phase.id,
                toPhaseId: null,
                description: '',
                rule: ''
            }
        };
        const popupHeaderOption = { text: phase.name, desc: '' };
        const popupOptions= { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_75 };

        const success = (resp: any) => {
            if (resp && this.parent && this.parent.selectedProcess) {
                this.parent.saveTransition(this.parent.selectedProcess.id, resp);
            }
            this.sharedService.destroy();
        };
        const failure = (_e: any) => { this.sharedService.destroy(); };
        return this.sharedService.showCustomPopup(TransitionEditorComponent, popupOptions, input).then(success, failure);
    }

    onShowStepTask(phaseStep: OrgWorkflowPhaseStep){
      if(!this.parent) return;
        this.parent.selectedStepForTasks = phaseStep;
        this.router.navigate(['../tasks'], {relativeTo: this.route});
    }

    onEditStep(phaseStep: OrgWorkflowPhaseStep){
      if(!this.parent) return;
        const phase = this.parent.phases.find(p => p.id === phaseStep.phaseId);
        if (phase) {
            this.onPhaseEdit(phase);
        }
    }
}
