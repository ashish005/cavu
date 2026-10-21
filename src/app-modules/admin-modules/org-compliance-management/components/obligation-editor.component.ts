import {Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Subject, debounceTime, finalize, switchMap, catchError, of} from "rxjs";
import {
    CATEGORIES, CATEGORY_LABEL, ComplianceLookups, MONTHS, OBLIGATION_BADGE, ObligationDetail, ObligationInput, Period, RegistrationRow, SCHEDULE_LABEL,
    STATUS_BADGE, ScheduleKind
} from "../domains/compliance.models";
import {ComplianceApiService, errorMessageOf} from "../services/compliance-api.service";

/**
 * Creates or edits an obligation: what it is, who owns and reviews it, and its schedule, with the next due dates
 * previewed as the schedule changes. Catalog obligations show the authority's notes and offer catalog updates.
 */
@Component({selector: 'compliance-obligation-editor', standalone: false, templateUrl: './obligation-editor.component.html'})
export class ObligationEditorComponent implements OnInit {
    /** Null: a new obligation. */
    @Input() obligationId: string | null = null;
    @Input({required: true}) lookups!: ComplianceLookups;
    @Output() saved = new EventEmitter<ObligationDetail | null>();
    @Output() cancelled = new EventEmitter<void>();

    private readonly destroyRef = inject(DestroyRef);
    private readonly preview$ = new Subject<ObligationInput>();
    readonly categories = CATEGORIES;
    readonly categoryLabel = CATEGORY_LABEL;
    readonly scheduleLabel = SCHEDULE_LABEL;
    readonly kinds = Object.keys(SCHEDULE_LABEL) as ScheduleKind[];
    readonly months = MONTHS;
    readonly badge = OBLIGATION_BADGE;
    readonly taskBadge = STATUS_BADGE;
    readonly intervals = [{v: 1, l: 'Monthly'}, {v: 2, l: 'Every 2 months'}, {v: 3, l: 'Quarterly'}, {v: 6, l: 'Half-yearly'}, {v: 12, l: 'Yearly'}, {v: 24, l: 'Every 2 years'}, {v: 36, l: 'Every 3 years'}, {v: 60, l: 'Every 5 years'}];

    detail: ObligationDetail | null = null;
    model: ObligationInput = this.blank();
    periods: Period[] = [];
    registrations: RegistrationRow[] = [];
    loading = false;
    busy = false;
    error: string | null = null;

    constructor(private api: ComplianceApiService) {}

    get canManage() { return this.lookups.canManage; }
    get readOnly() { return !this.canManage || this.detail?.status === 'Retired'; }

    ngOnInit() {
        this.preview$.pipe(
            debounceTime(300),
            switchMap(m => this.api.previewSchedule(m).pipe(catchError(() => of([] as Period[])))),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(p => this.periods = p);
        this.api.registrations({state: 'active', take: 100}).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: r => this.registrations = r.entities, error: () => {}});
        if (this.obligationId) { this.load(this.obligationId); } else { this.changed(); }
    }

    private load(id: string) {
        this.loading = true;
        this.api.obligation(id).pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => { this.detail = d; this.model = {...d.values}; this.periods = d.nextPeriods; },
            error: e => this.error = errorMessageOf(e, 'The obligation could not be loaded.')
        });
    }

    /** Schedule fields changed: preview again. */
    changed() {
        const m = this.model;
        if (m.schedule === 'OnEvent' || ((m.schedule === 'Anniversary' || m.schedule === 'OneTime') && !m.anchorDate)) { this.periods = []; return; }
        this.preview$.next(this.input());
    }

    private input(): ObligationInput {
        const m = this.model;
        return {
            ...m, intervalMonths: +m.intervalMonths || 0, dueMonthOffset: +m.dueMonthOffset || 0, dueDay: +m.dueDay || 1, leadDays: +m.leadDays || 0,
            yearStartMonth: m.useFinancialYear ? null : (m.yearStartMonth ? +m.yearStartMonth : null), anchorDate: m.anchorDate || null, startDate: m.startDate || null,
            endDate: m.endDate || null, countryCode: m.countryCode?.trim().toUpperCase() || null, region: m.region?.trim().toUpperCase() || null
        };
    }

    save() {
        if (!this.model.name?.trim()) { this.error = 'Enter the name.'; return; }
        this.busy = true;
        this.error = null;
        this.api.saveObligation(this.detail?.id ?? null, this.input()).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => { this.detail = d; this.model = {...d.values}; this.periods = d.nextPeriods; this.saved.emit(d); },
            error: e => this.error = errorMessageOf(e, 'The obligation could not be saved.')
        });
    }

    act(action: 'activate' | 'pause' | 'resume' | 'retire' | 'refresh') {
        if (!this.detail) { return; }
        let note: string | null = null;
        if (action === 'retire') {
            note = prompt('Why does it no longer apply? (kept with the history)');
            if (note === null) { return; }
        }
        if (action === 'refresh' && !confirm('Take the catalog\'s current schedule? Future tasks nobody has started are regenerated.')) { return; }
        this.busy = true;
        this.api.obligationAction(this.detail.id, action, note).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => { this.detail = d; this.model = {...d.values}; this.periods = d.nextPeriods; this.saved.emit(d); },
            error: e => this.error = errorMessageOf(e, 'The obligation could not be updated.')
        });
    }

    remove() {
        if (!this.detail || !confirm(`Delete "${this.detail.values.name}"? Obligations with filing history can only be retired.`)) { return; }
        this.busy = true;
        this.api.deleteObligation(this.detail.id).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => this.saved.emit(null),
            error: e => this.error = errorMessageOf(e, 'The obligation could not be deleted.')
        });
    }

    private blank(): ObligationInput {
        return {
            name: '', description: null, category: 'Other', countryCode: null, region: null, authorityName: null, formName: null, referenceUrl: null, schedule: 'Periodic',
            intervalMonths: 12, yearStartMonth: 1, useFinancialYear: false, dueMonthOffset: 1, dueDay: 15, rollForwardWeekend: false, leadDays: 14, anchorDate: null,
            startDate: null, endDate: null, isMandatory: false, ownerId: null, reviewerId: null, registrationId: null, branchId: null, notes: null
        };
    }
}
