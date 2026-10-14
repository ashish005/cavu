import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize} from "rxjs";
import {PRIORITIES, ProcessLookups, STAGE_COLORS, Workflow, WorkflowStage, newWorkflow, newWorkflowTask} from "../domains/process.models";
import {ProcessApiService, errorMessageOf} from "../services/process-api.service";

/** Edits a workflow as one document: stages in order, each with its SLA, approval rule and task templates. */
@Component({standalone: false, templateUrl: './templates/workflow-editor.html'})
export class WorkflowEditorView implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate: TemplateRef<any>;

    private readonly destroyRef = inject(DestroyRef);
    readonly priorities = PRIORITIES;
    readonly colors = STAGE_COLORS;

    lookups: ProcessLookups | null = null;
    workflow: Workflow = newWorkflow();
    loading = false;
    saving = false;
    error: string | null = null;
    saved = false;

    constructor(private api: ProcessApiService, private route: ActivatedRoute, private router: Router) {}

    get isNew() { return !this.workflow.id; }

    ngOnInit() {
        this.api.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(l => this.lookups = l);
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loading = true;
            this.api.workflow(id).pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
                next: w => this.workflow = w,
                error: e => this.error = errorMessageOf(e, 'Could not load the workflow.')
            });
        }
    }

    /** A readable code from the name for new workflows, e.g. "Vendor onboarding" → VENDOR_ONBOARDING. */
    nameChanged() {
        if (this.isNew) {
            this.workflow.code = this.workflow.name.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 60);
        }
    }

    addStage() {
        const color = this.colors[this.workflow.stages.length % this.colors.length];
        this.workflow.stages.push({name: '', color, advanceMode: 'Automatic', slaHours: null, tasks: [newWorkflowTask()]});
    }

    moveStage(index: number, delta: number) {
        const stages = this.workflow.stages;
        const target = index + delta;
        if (target < 0 || target >= stages.length) { return; }
        [stages[index], stages[target]] = [stages[target], stages[index]];
    }

    removeStage(index: number) {
        if (this.workflow.stages.length > 1) { this.workflow.stages.splice(index, 1); }
    }

    addTask(stage: WorkflowStage) { stage.tasks.push(newWorkflowTask()); }
    removeTask(stage: WorkflowStage, index: number) { stage.tasks.splice(index, 1); }

    save() {
        this.error = null;
        const w = this.workflow;
        if (!w.name.trim() || !w.code.trim()) { this.error = 'Give the workflow a name.'; return; }
        const emptyStage = w.stages.find(s => !s.name.trim());
        if (emptyStage) { this.error = 'Every stage needs a name.'; return; }
        const emptyTask = w.stages.flatMap(s => s.tasks).find(t => !t.name.trim());
        if (emptyTask) { this.error = 'Every task needs a name (or remove it).'; return; }

        this.saving = true;
        this.api.saveWorkflow(w).pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: savedWorkflow => {
                this.saved = true;
                if (this.isNew) {
                    this.router.navigate(['../', savedWorkflow.id], {relativeTo: this.route, replaceUrl: true});
                }
                this.workflow = savedWorkflow;
                setTimeout(() => this.saved = false, 2500);
            },
            error: e => this.error = errorMessageOf(e, 'The workflow could not be saved.')
        });
    }

    trackByIndex(index: number) { return index; }
}
