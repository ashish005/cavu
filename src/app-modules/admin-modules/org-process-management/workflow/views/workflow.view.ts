import {Component} from "@angular/core";
import {ASIDE_CLASS, ASIDE_SIZE, OrgWorkflowAPIResolver, SharedService, WorkflowPhaseStatusLookup} from "@app-global";
import {OrgWorkflowPhase, OrgWorkflowPhaseQueryOptions, OrgWorkflowPhaseStep, OrgWorkflowPhaseTransition, WorkflowNode} from "../domains/org-workflow-node.serializer";
import {OrgWorkflowPhaseService, WorkflowService} from "../services/workflow.service";
import {TransitionEditorComponent} from "../components";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {BehaviorSubject} from "rxjs";
import {filter} from "rxjs/operators";

@Component({
  standalone: false,
  templateUrl: './templates/workflow.html'
})
export class OrgWorkflowView {
  coreState: OrgWorkflowPhaseQueryOptions = new OrgWorkflowPhaseQueryOptions();
  processTree: WorkflowNode[] = [];
  processCache = new Map<number, WorkflowNode>();
  phases: OrgWorkflowPhase[] = [];
  phaseStatuses: WorkflowPhaseStatusLookup[] = [];

  selectedProcess?: WorkflowNode;
  selectedProcess$ = new BehaviorSubject<WorkflowNode | undefined>(undefined);
  selectedPhase: OrgWorkflowPhase | null = null;
  phaseTransitions: OrgWorkflowPhaseTransition[] = [];
  selectedStepForTasks: OrgWorkflowPhaseStep | null = null;
  constructor(private lookup: OrgWorkflowAPIResolver,
              private service: OrgWorkflowPhaseService,
              private workflowService: WorkflowService,
              private sharedService: SharedService,
              private router: Router,
              private route: ActivatedRoute) {
    this.phaseStatuses = this.lookup.masterType.phaseStatus;
  }

  ngOnInit() {
    this.service.getAllProcess().subscribe(r => {
        this.processTree = r.entities;
        this.buildCache(this.processTree);
        this.handleRouteParams();
    });
    this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
        this.handleRouteParams();
    });
  }

  buildCache(nodes: WorkflowNode[]) {
      nodes.forEach(n => {
          this.processCache.set(n.id, n);
          if (n.children && n.children.length) {
              this.buildCache(n.children);
          }
      });
  }

  handleRouteParams() {
      // Logic:
      // 1. If we are in OrgWorkflowView, this is the 'tree' route component.
      // 2. The ID is in the child route ':id'.
      // 3. We can inspect the entire router state or just check the first child.
      
      const child = this.route.firstChild;
      if (child) {
          // If the child is indeed the ':id' route, it should have the param.
          const id = child.snapshot.paramMap.get('id');
          if (id) {
              if (!this.selectedProcess || this.selectedProcess.id !== +id) {
                  this.loadProcess(+id);
              }
          }
      }
  }

  loadProcess(id: number) {
      const process = this.processCache.get(id);
      if (process) {
          this.selectedProcess = process;
          this.selectedProcess$.next(process);
          this.selectedPhase = null;
          this.coreState.workflowId = process.id;
          this.reloadPhases();
          this.loadTransitions(process.id);
      }
  }

  reloadPhases() {
      this.service.list(this.coreState).subscribe((p: any) => {
          this.phases = p.entities;
      });
  }

  onProcessSelected(process: any) {
    this.router.navigate([process.id], {relativeTo: this.route});
  }

  loadTransitions(workflowId: number) {
    this.workflowService.getTransitions(workflowId).subscribe(t => {
      this.phaseTransitions = t || [];
    });
  }

  onTransitionEdit(transition: OrgWorkflowPhaseTransition) {
    if (!this.selectedProcess) {
      return;
    }
    const existing = this.phaseTransitions.find(t => t.id === transition.id) || transition;
    
    // Pass ALL transitions for this phase to allow switching statuses in editor
    const existingTransitions = this.phaseTransitions.filter(t => t.fromPhaseId === transition.fromPhaseId);

    const input = {
      process: this.selectedProcess,
      phases: this.phases,
      statuses: this.phaseStatuses,
      transitions: existingTransitions,
      sourcePhaseId: transition.fromPhaseId,
      sourceStatusId: transition.fromStatusId
    };
    const popupHeaderOption = {
      text: 'Manage Transitions',
      desc: this.getPhaseName(transition.fromPhaseId) + ' \u2192 ' + this.getPhaseName(transition.toPhaseId)
    };
    const popupOptions = { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_75 };
    const success = (resp: any) => {
      this.sharedService.destroy();
      if (resp && this.selectedProcess) {
        const saves: any[] = resp.save || [];
              const deletes: number[] = resp.delete || [];

              if (saves.length > 0 || deletes.length > 0) {
                  const workflowId = this.selectedProcess.id;
                  this.workflowService.bulkUpdateTransitions(workflowId, { saves, deletes }).subscribe(() => {
                      this.loadTransitions(workflowId);
                  });
              }
      }
    };
    const failure = () => { this.sharedService.destroy(); };
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
