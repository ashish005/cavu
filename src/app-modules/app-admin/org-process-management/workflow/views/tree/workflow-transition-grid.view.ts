import {Component, Optional, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService} from "@app-global";
import {OrgWorkflowPhaseTransition} from "../../domains/org-workflow-node.serializer";
import {TransitionEditorComponent} from "../../components";
import {WorkflowService} from "../../services/workflow.service";
import {animate, style, transition, trigger} from "@angular/animations";
import { Node, Edge, ClusterNode } from '@swimlane/ngx-graph';
import { forkJoin, of, Observable } from 'rxjs';
// @ts-ignore
import * as shape from 'd3-shape';
import {OrgWorkflowView} from "../workflow.view";

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
  clusters: ClusterNode[] = [];
  curve: any = shape.curveBundle.beta(1);
  private _lastPhases: any[] = [];
  private _lastTransitions: any[] = [];
  viewMode: 'phase' | 'state' = 'phase';

  selectedSourceNodeId: string | null = null;

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

  setViewMode(mode: 'phase' | 'state') {
      this.viewMode = mode;
      this.selectedSourceNodeId = null; // Reset selection on mode change
      this.updateNodes();
      this.updateLinks();
      this.cdr.markForCheck();
  }

  updateNodes() {
      if (!this.parent || !this.parent.phases) {
          this.nodes = [];
          this.clusters = [];
          this.cdr.markForCheck();
          return;
      }
      const nodes: Node[] = [];
      const clusters: ClusterNode[] = [];
      const phases = this.parent.phases || [];

      if (this.viewMode === 'phase') {
          phases.forEach(p => {
              if (p && p.id) {
                  const nodeId = 'phase-' + p.id;
                  nodes.push({
                      id: nodeId,
                      label: p.name,
                      dimension: { width: 160, height: 54 },
                      data: { 
                          color: p.color || '#a8385d', 
                          phase: p,
                          isSelected: this.selectedSourceNodeId === nodeId 
                      }
                  });
              }
          });
      } else {
          phases.forEach(p => {
              if (p && p.id) {
                  const statusNodeIds: string[] = [];
                  // Add Status Nodes
                  (p.statuses || []).forEach(s => {
                      if (s && s.id) {
                          const nodeId = 'phase-' + p.id + '-status-' + s.id;
                          statusNodeIds.push(nodeId);
                          nodes.push({
                              id: nodeId,
                              label: s.name, // Simplified label (context provided by cluster)
                              dimension: { width: 140, height: 40 },
                              data: { 
                                  color: s.color || p.color || '#a8385d', 
                                  phase: p, 
                                  status: s,
                                  isSelected: this.selectedSourceNodeId === nodeId 
                              }
                          });
                      }
                  });

                  // Add Cluster
                  clusters.push({
                      id: 'cluster-' + p.id,
                      label: p.name,
                      childNodeIds: statusNodeIds,
                      data: { color: p.color || '#a8385d' }
                  });

                  // Fallback: If no statuses, add Phase Node inside cluster
                  if (statusNodeIds.length === 0) {
                       const nodeId = 'phase-' + p.id;
                       nodes.push({
                          id: nodeId,
                          label: p.name,
                          dimension: { width: 160, height: 54 },
                          data: { 
                              color: p.color || '#a8385d', 
                              phase: p,
                              isSelected: this.selectedSourceNodeId === nodeId 
                          }
                       });
                       clusters[clusters.length - 1].childNodeIds!.push(nodeId);
                  }
              }
          });
      }
      this.nodes = nodes;
      this.clusters = clusters;
      this.cdr.markForCheck();
  }

  updateLinks() {
      if (!this.parent || !this.parent.phaseTransitions) {
          this.links = [];
          this.cdr.markForCheck();
          return;
      }

      // Create a Set of valid node IDs for fast lookup to prevent dangling edges
      const validNodeIds = new Set(this.nodes.map(n => n.id));

      const edges: Edge[] = [];
      (this.parent.phaseTransitions || []).forEach(t => {
          if (!t || !t.id) return;

          let source = 'phase-' + t.fromPhaseId;
          let target = 'phase-' + t.toPhaseId;
          
          if (this.viewMode === 'state') {
              // Determine Source Node
              if (t.fromStatusId) {
                  source = 'phase-' + t.fromPhaseId + '-status-' + t.fromStatusId;
              } else {
                  // Fallback: Use last status of fromPhase
                  const fromPhase = this.parent.phases.find(p => p.id === t.fromPhaseId);
                  if (fromPhase && fromPhase.statuses && fromPhase.statuses.length > 0) {
                      const lastStatus = fromPhase.statuses[fromPhase.statuses.length - 1];
                      source = 'phase-' + t.fromPhaseId + '-status-' + lastStatus.id;
                  }
              }

              // Determine Target Node
              if (t.toStatusId) {
                  target = 'phase-' + t.toPhaseId + '-status-' + t.toStatusId;
              } else {
                  // Fallback: Use first status of toPhase
                  const toPhase = this.parent.phases.find(p => p.id === t.toPhaseId);
                  if (toPhase && toPhase.statuses && toPhase.statuses.length > 0) {
                      const firstStatus = toPhase.statuses[0];
                      target = 'phase-' + t.toPhaseId + '-status-' + firstStatus.id;
                  }
              }
          }

          // Only add edge if both source and target nodes exist
          if (validNodeIds.has(source) && validNodeIds.has(target)) {
              edges.push({
                  id: 'edge-' + t.id,
                  source,
                  target,
                  label: t.rule ? t.rule : '',
                  data: { transition: t }
              });
          }
      });
      this.links = edges;
      this.cdr.markForCheck();
  }

  getLinkLabelX(link: any) {
      const pts = (link && link.points) || [];
      if (!pts.length) return 0;
      const i = Math.floor(pts.length / 2);
      return pts[i].x;
  }

  getLinkLabelY(link: any) {
      const pts = (link && link.points) || [];
      if (!pts.length) return 0;
      const i = Math.floor(pts.length / 2);
      return pts[i].y - 6;
  }

    onNodeClick(event: any) {
        if (!event || !event.id) return;
        
        // If clicking the same node, deselect
        if (this.selectedSourceNodeId === event.id) {
            this.selectedSourceNodeId = null;
            this.updateNodes();
            return;
        }

        // If no source selected, select this one
        if (!this.selectedSourceNodeId) {
            this.selectedSourceNodeId = event.id;
            this.updateNodes();
            return;
        }

        // If source selected and clicking different node -> Create Transition
        const sourceId = this.selectedSourceNodeId;
        const targetId = event.id;
        
        this.selectedSourceNodeId = null;
        this.updateNodes(); // Clear selection immediately
        
        this.openCreateTransitionFromNodes(sourceId, targetId);
    }

    parseNodeId(id: string): { phaseId: number, statusId: number | undefined } {
        const parts = id.split('-');
        // phase-{id} -> ['phase', '1']
        // phase-{id}-status-{sid} -> ['phase', '1', 'status', '2']
        if (parts.length === 2) {
            return { phaseId: +parts[1], statusId: undefined };
        }
        if (parts.length === 4) {
            return { phaseId: +parts[1], statusId: +parts[3] };
        }
        return { phaseId: 0, statusId: undefined };
    }

    openCreateTransitionFromNodes(sourceNodeId: string, targetNodeId: string) {
        const source = this.parseNodeId(sourceNodeId);
        const target = this.parseNodeId(targetNodeId);

        const newTransition: OrgWorkflowPhaseTransition = {
            id: 0,
            processId: this.parent?.selectedProcess?.id || 0,
            fromPhaseId: source.phaseId,
            fromStatusId: source.statusId,
            toPhaseId: target.phaseId,
            toStatusId: target.statusId,
            description: '',
            rule: ''
        };

        // Pass ALL transitions for this phase to allow switching statuses in editor
        const existingTransitions = (this.parent?.phaseTransitions || []).filter(t => t.fromPhaseId === source.phaseId);

        const input = {
            process: this.parent?.selectedProcess,
            phases: this.parent?.phases,
            statuses: this.parent?.phaseStatuses,
            transitions: existingTransitions,
            newTransition: newTransition,
            sourcePhaseId: source.phaseId,
            sourceStatusId: source.statusId
        };
        this.showTransitionPopup(input, { text: 'Manage Transitions', desc: '' });
    }

    onTransitionCreate(_e: any){
        // Generic create button - maybe select first phase? Or just empty?
        // For now, let's just open empty.
        const input = {
            process: this.parent?.selectedProcess,
            phases: this.parent?.phases,
            statuses: this.parent?.phaseStatuses,
            transitions: []
        };
        this.showTransitionPopup(input, { text: 'Create Transition', desc: '' });
    }

    onTransitionLinkClick(event: any) {
        if (event && event.data && event.data.transition) {
            this.onTransitionEdit(event.data.transition);
        }
    }

    onTransitionEdit(transition: OrgWorkflowPhaseTransition) {
        // Pass ALL transitions for this phase
        const existingTransitions = (this.parent?.phaseTransitions || []).filter(t => t.fromPhaseId === transition.fromPhaseId);
        
        const input = {
            process: this.parent?.selectedProcess,
            phases: this.parent?.phases,
            statuses: this.parent?.phaseStatuses,
            transitions: existingTransitions,
            sourcePhaseId: transition.fromPhaseId,
            sourceStatusId: transition.fromStatusId
        };
        this.showTransitionPopup(input, { text: 'Manage Transitions', desc: '' });
    }

    getTransitionsFrom(phaseId: number, statusId: number | undefined): OrgWorkflowPhaseTransition[] {
        return (this.parent?.phaseTransitions || []).filter(t => 
            t.fromPhaseId === phaseId && 
            t.fromStatusId === (statusId || null)
        );
    }

    showTransitionPopup(data: any, popupHeaderOption: any){
        const popupOptions = { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_75 };
        const success = (resp: any) => {
            this.sharedService.destroy();
            if(resp) {
                const saveList: any[] = resp.save || [];
                const deleteList: number[] = resp.delete || [];
                
                const obs: Observable<any>[] = [];

                if (saveList.length > 0) {
                    saveList.forEach(s => {
                        if (s.id) {
                            obs.push(this.service.updateTransition(s.id, s));
                        } else {
                            obs.push(this.service.createTransition(this.parent?.selectedProcess?.id || 0, s));
                        }
                    });
                }

                if (deleteList.length > 0) {
                    deleteList.forEach(id => {
                        obs.push(this.service.deleteTransition(id));
                    });
                }

                if (obs.length > 0) {
                    forkJoin(obs).subscribe(() => {
                        this.parent?.loadTransitions(this.parent?.selectedProcess?.id || 0);
                    });
                }
            }
        };
        const failure = (_e: any) => { this.sharedService.destroy(); };
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
