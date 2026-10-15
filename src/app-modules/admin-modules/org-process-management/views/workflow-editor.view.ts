import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize} from "rxjs";
import {
    PRIORITIES, ProcessLookups, STAGE_COLORS, STAGE_RULE_TARGET_LABEL, StageRule, StageRuleKind, StageRuleTarget, Workflow, WorkflowStage,
    TEAM_STRATEGIES, newWorkflow, newWorkflowTask, toCode
} from "../domains/process.models";
import {ProcessApiService, errorMessageOf} from "../services/process-api.service";
import {cleanCondition} from "../components/condition-builder.component";

/**
 * Edits a workflow as one document: stages in order, each with its SLA, approval rule, task templates and automatic
 * switches ("when the record is approved, move on"; "after 48 hours here, escalate").
 */
@Component({standalone: false, templateUrl: './templates/workflow-editor.html'})
export class WorkflowEditorView implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate: TemplateRef<any>;

    private readonly destroyRef = inject(DestroyRef);
    readonly priorities = PRIORITIES;
    readonly colors = STAGE_COLORS;
    readonly targetLabel = STAGE_RULE_TARGET_LABEL;
    readonly targets = Object.keys(STAGE_RULE_TARGET_LABEL) as StageRuleTarget[];

    /** Every event name known for any record type, suggested for "when … happens" rules. */
    eventNames: string[] = [];

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
        this.api.entityTypes().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: types => this.eventNames = [...new Set(types.flatMap(t => t.events))].sort(),
            error: () => this.eventNames = []
        });
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loading = true;
            this.api.workflow(id).pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
                next: w => this.workflow = this.prepare(w),
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
        // Rules point at stages by position: keep them pointing at the same stage.
        this.allRules().forEach(r => {
            if (r.targetStageIndex === index) { r.targetStageIndex = target; }
            else if (r.targetStageIndex === target) { r.targetStageIndex = index; }
        });
    }

    removeStage(index: number) {
        if (this.workflow.stages.length <= 1) { return; }
        this.workflow.stages.splice(index, 1);
        this.allRules().forEach(r => {
            if (r.targetStageIndex === index) { r.target = 'NextStage'; r.targetStageIndex = null; }
            else if (r.targetStageIndex != null && r.targetStageIndex > index) { r.targetStageIndex--; }
        });
    }

    addRule(stage: WorkflowStage, kind: StageRuleKind) {
        (stage.rules ??= []).push(kind === 'OnEvent'
            ? {kind, eventName: '', condition: {match: 'all', rules: []}, target: 'NextStage'}
            : {kind, afterHours: 48, condition: {match: 'all', rules: []}, target: 'NextStage'});
    }

    removeRule(stage: WorkflowStage, index: number) { stage.rules?.splice(index, 1); }

    targetChanged(rule: StageRule, stageIndex: number) {
        if (rule.target === 'Stage' && rule.targetStageIndex == null) {
            rule.targetStageIndex = this.workflow.stages.findIndex((_, i) => i !== stageIndex);
        }
    }

    otherStages(stageIndex: number) {
        return this.workflow.stages.map((s, i) => ({i, name: s.name || `Stage ${i + 1}`})).filter(x => x.i !== stageIndex);
    }

    private allRules(): StageRule[] { return this.workflow.stages.flatMap(s => s.rules ?? []); }

    get activeTeams() { return this.lookups?.teams.filter(t => t.isActive) ?? []; }

    strategyLabel(strategy: string) { return TEAM_STRATEGIES.find(s => s.value === strategy)?.label ?? strategy; }

    teamHint(teamId: string | null | undefined) {
        const team = this.lookups?.teams.find(t => t.id === teamId);
        return team ? TEAM_STRATEGIES.find(s => s.value === team.strategy)?.hint ?? '' : '';
    }

    /** Fills the optional parts the editor binds to. */
    private prepare(w: Workflow): Workflow {
        w.stages.forEach(s => (s.rules ??= []).forEach(r => r.condition ??= {match: 'all', rules: []}));
        return w;
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
        for (const stage of w.stages) {
            for (const rule of stage.rules ?? []) {
                if (rule.kind === 'OnEvent' && !toCode(rule.eventName)) { this.error = `Stage "${stage.name}": say which event switches it.`; return; }
                if (rule.kind === 'AfterHours' && !(Number(rule.afterHours) > 0)) { this.error = `Stage "${stage.name}": enter the hours for the timer.`; return; }
            }
        }

        const body: Workflow = {
            ...w,
            stages: w.stages.map(s => ({
                ...s,
                rules: (s.rules ?? []).map(r => ({
                    ...r,
                    eventName: r.kind === 'OnEvent' ? toCode(r.eventName) : null,
                    afterHours: r.kind === 'AfterHours' ? Number(r.afterHours) : null,
                    condition: r.kind === 'OnEvent' ? cleanCondition(r.condition) : null,
                    targetStageIndex: r.target === 'Stage' ? r.targetStageIndex : null
                }))
            }))
        };

        this.saving = true;
        this.api.saveWorkflow(body).pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: savedWorkflow => {
                this.saved = true;
                if (this.isNew) {
                    this.router.navigate(['../', savedWorkflow.id], {relativeTo: this.route, replaceUrl: true});
                }
                this.workflow = this.prepare(savedWorkflow);
                setTimeout(() => this.saved = false, 2500);
            },
            error: e => this.error = errorMessageOf(e, 'The workflow could not be saved.')
        });
    }

    trackByIndex(index: number) { return index; }
}
