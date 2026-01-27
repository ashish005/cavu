import {Component, Optional, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";
import {OrgWorkflowView} from "../workflow.view";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService} from "@app-global";
import {OrgWorkflowPhaseTransition} from "../../domains/org-workflow-node.serializer";
import {TransitionEditorComponent} from "../../components";
import {WorkflowService} from "../../services/workflow.service";
import {animate, style, transition, trigger} from "@angular/animations";
import { Node, Edge } from '@swimlane/ngx-graph';

@Component({
  standalone: false,
  templateUrl: './templates/workflow-transition-grid.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class OrgWorkflowPhaseTransitionGridView {
  nodes: Node[] = [];
  links: Edge[] = [];
  private _lastPhases: any[] = [];
  private _lastTransitions: any[] = [];

  constructor(
      @Optional() public parent: OrgWorkflowView,
      private sharedService: SharedService,
      private service: WorkflowService,
      private cdr: ChangeDetectorRef
  ) {}

  ngDoCheck() {
      if (!this.parent) return;

      // Check for phases changes
      if (this.parent.phases !== this._lastPhases) {
          this._lastPhases = this.parent.phases;
          this.updateNodes();
      }

      // Check for transition changes
      if (this.parent.phaseTransitions !== this._lastTransitions) {
          this._lastTransitions = this.parent.phaseTransitions;
          this.updateLinks();
      }
  }

  updateNodes() {
      if (!this.parent || !this.parent.phases) {
          this.nodes = [];
          this.cdr.markForCheck();
          return;
      }
      this.nodes = this.parent.phases.map(p => ({
          id: 'phase-' + p.id.toString(),
          label: p.name,
          dimension: { width: 150, height: 50 },
          data: { 
              color: p.color || '#a8385d',
              phase: p 
          }
      }));
      this.cdr.markForCheck();
  }

  updateLinks() {
      if (!this.parent || !this.parent.phaseTransitions) {
          this.links = [];
          this.cdr.markForCheck();
          return;
      }
      this.links = this.parent.phaseTransitions.map(t => ({
          id: 'edge-' + t.id.toString(),
          source: 'phase-' + t.fromPhaseId.toString(),
          target: 'phase-' + t.toPhaseId.toString(),
          label: t.rule ? 'Has Rule' : '',
          data: { transition: t }
      }));
      this.cdr.markForCheck();
  }

    onTransitionCreate(_e: any){
        const input = {
            process: this.parent?.selectedProcess,
            phases: this.parent?.phases,
            statuses: this.parent?.phaseStatuses,
            transition: null
        };
        this.showTransitionPopup(input, { text: 'Create Transition', desc: '' });
    }

    onNodeClick(event: any) {
        const phase = event && event.data && event.data.phase;
        if (!phase) {
            this.onTransitionCreate(null);
            return;
        }
        const transition: OrgWorkflowPhaseTransition = {
            id: 0,
            processId: this.parent?.selectedProcess?.id || 0,
            fromPhaseId: phase.id,
            toPhaseId: 0,
            description: '',
            rule: ''
        };
        const input = {
            process: this.parent?.selectedProcess,
            phases: this.parent?.phases,
            statuses: this.parent?.phaseStatuses,
            transition
        };
        this.showTransitionPopup(input, { text: 'Create Transition', desc: '' });
    }

    onTransitionLinkClick(event: any) {
        if (event && event.data && event.data.transition) {
            this.onTransitionEdit(event.data.transition);
        }
    }

    onTransitionEdit(transition: OrgWorkflowPhaseTransition) {
        const input = {
            process: this.parent?.selectedProcess,
            phases: this.parent?.phases,
            statuses: this.parent?.phaseStatuses,
            transition: transition
        };
        this.showTransitionPopup(input, { text: 'Edit Transition', desc: '' });
    }

    showTransitionPopup(data: any, popupHeaderOption: any){
        const popupOptions = { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
        const success = (resp: any) => {
            this.sharedService.destroy();
            if(resp) {
                if (resp.id) {
                    this.service.updateTransition(resp.id, resp).subscribe(() => {
                        this.parent?.loadTransitions(this.parent?.selectedProcess?.id || 0);
                    });
                } else {
                    this.service.createTransition(this.parent?.selectedProcess?.id || 0, resp).subscribe(() => {
                        this.parent?.loadTransitions(this.parent?.selectedProcess?.id || 0);
                    });
                }
            }
        };
        const failure = (e: any) => { this.sharedService.destroy(); };
        return this.sharedService.showCustomPopup(TransitionEditorComponent, popupOptions, data).then(success, failure);
    }
    
    onTransitionDelete(id: number) {
        if (confirm('Are you sure you want to delete this transition?')) {
            this.service.deleteTransition(id).subscribe(() => {
                 this.parent?.loadTransitions(this.parent?.selectedProcess?.id || 0);
            });
        }
    }
}
