import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize, forkJoin} from "rxjs";
import {EntityField, EntityType, ProcessLookups, Trigger, TriggerTestResult, newTrigger, toCode} from "../domains/process.models";
import {ProcessApiService, errorMessageOf} from "../services/process-api.service";
import {cleanCondition} from "../components/condition-builder.component";

/**
 * "When something happens to a record, start a workflow." Works for any record type: the built-in ones (members,
 * documents, OCR jobs, processes, tasks, subscriptions, compliance) and the organisation's own types, whose events
 * arrive through `POST api/v1/process/events`. Defaults are seeded switched off.
 */
@Component({standalone: false, templateUrl: './templates/triggers.html'})
export class TriggersView implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate: TemplateRef<any>;

    private readonly destroyRef = inject(DestroyRef);

    lookups: ProcessLookups | null = null;
    types: EntityType[] = [];
    triggers: Trigger[] = [];
    loading = false;
    error: string | null = null;

    editing: Trigger | null = null;
    saving = false;
    editError: string | null = null;

    readonly namePlaceholder = 'e.g. Onboarding: {{name}}';
    sample = '{\n  "name": "Asha",\n  "userType": "employee"\n}';
    testResult: TriggerTestResult | null = null;
    testError: string | null = null;

    constructor(private api: ProcessApiService) {}

    ngOnInit() { this.load(); }

    load() {
        this.loading = true;
        this.error = null;
        forkJoin({lookups: this.api.lookups(), types: this.api.entityTypes(), triggers: this.api.triggers()})
            .pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: r => { this.lookups = r.lookups; this.types = r.types; this.triggers = r.triggers; },
                error: e => this.error = errorMessageOf(e, 'Could not load triggers.')
            });
    }

    typeName(code: string) { return this.types.find(t => t.code === code)?.name ?? code.replace(/_/g, ' '); }

    get selectedType(): EntityType | undefined { return this.types.find(t => t.code === toCode(this.editing?.entityType)); }
    get fields(): EntityField[] { return this.selectedType?.fields ?? []; }
    get events(): string[] { return this.selectedType?.events ?? []; }

    open(trigger?: Trigger) {
        this.editing = trigger
            ? {...trigger, condition: trigger.condition ? {...trigger.condition, rules: trigger.condition.rules.map(r => ({...r}))} : {match: 'all', rules: []}}
            : {...newTrigger(), workflowId: this.lookups?.workflows[0]?.id ?? null};
        this.editError = null;
        this.testResult = null;
        this.testError = null;
    }

    typeChanged() {
        if (this.editing && this.events.length && !this.events.includes(this.editing.eventName)) {
            this.editing.eventName = this.events[0];
        }
    }

    save() {
        const t = this.editing;
        if (!t) { return; }
        this.editError = null;
        const entityType = toCode(t.entityType);
        const eventName = toCode(t.eventName);
        if (!t.name.trim()) { this.editError = 'Give the trigger a name.'; return; }
        if (!entityType || !eventName) { this.editError = 'Choose the record type and the event.'; return; }
        if (!t.workflowId) { this.editError = 'Choose the workflow to start.'; return; }
        if (t.ownerSource === 'User' && !t.ownerUserId) { this.editError = 'Choose the owner.'; return; }
        if (t.ownerSource === 'PayloadField' && !t.ownerField?.trim()) { this.editError = 'Name the field holding the owner\'s user id.'; return; }

        this.saving = true;
        this.api.saveTrigger({...t, entityType, eventName, condition: cleanCondition(t.condition), nameTemplate: t.nameTemplate?.trim() || null})
            .pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => { this.editing = null; this.load(); },
                error: e => this.editError = errorMessageOf(e, 'The trigger could not be saved.')
            });
    }

    toggle(trigger: Trigger) {
        this.api.saveTrigger({...trigger, isActive: !trigger.isActive}).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: saved => Object.assign(trigger, saved),
            error: e => this.error = errorMessageOf(e, 'Could not change the trigger.')
        });
    }

    remove(trigger: Trigger) {
        if (!trigger.id || !confirm(`Delete "${trigger.name}"? Processes it already started are not affected.`)) { return; }
        this.api.deleteTrigger(trigger.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => this.triggers = this.triggers.filter(x => x.id !== trigger.id),
            error: e => this.error = errorMessageOf(e, 'Could not delete the trigger.')
        });
    }

    /** Dry run of the condition being edited (and the saved triggers) against sample data; nothing is started. */
    test() {
        const t = this.editing;
        if (!t) { return; }
        this.testResult = null;
        this.testError = null;
        let payload: any;
        try { payload = JSON.parse(this.sample || '{}'); }
        catch { this.testError = 'The sample data is not valid JSON.'; return; }

        this.api.testTrigger({entityType: toCode(t.entityType), eventName: toCode(t.eventName), payload, condition: cleanCondition(t.condition), nameTemplate: t.nameTemplate})
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: r => this.testResult = r,
                error: e => this.testError = errorMessageOf(e, 'The test failed.')
            });
    }

    describe(t: Trigger): string {
        const rules = t.condition?.rules ?? [];
        if (!rules.length) { return 'always'; }
        return rules.map(r => `${r.field} ${r.op} ${r.value === undefined ? '' : Array.isArray(r.value) ? r.value.join('/') : r.value}`.trim())
            .join(t.condition!.match === 'any' ? ' or ' : ' and ');
    }
}
