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

  saveTransition(workflowId: number, payload: any) {
    const dto: OrgWorkflowPhaseTransition = {
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

  onTransitionEdit(transition: OrgWorkflowPhaseTransition) {
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
