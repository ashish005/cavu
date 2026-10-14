import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject, catchError, debounceTime, finalize, of, switchMap} from "rxjs";
import {
    MONTHS, PRIORITIES, ProcessLookups, RUN_STATUS_CLASS, RecurrenceType, ScheduleDefinition, ScheduleDetail, ScheduleRun, WEEKDAYS, newScheduleDefinition
} from "../domains/process.models";
import {ProcessApiService, errorMessageOf} from "../services/process-api.service";

/** Pairs shown for "monthly on the …" by weekday. */
const WEEK_NUMBERS = [{value: 1, label: '1st'}, {value: 2, label: '2nd'}, {value: 3, label: '3rd'}, {value: 4, label: '4th'}, {value: -1, label: 'last'}];

/**
 * Creates or edits a schedule. The definition is previewed by the server as you type, so the next runs shown are
 * exactly what the scheduler will do, in the schedule's timezone (daylight-saving included).
 */
@Component({standalone: false, templateUrl: './templates/schedule-editor.html'})
export class ScheduleEditorView implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate: TemplateRef<any>;

    private readonly destroyRef = inject(DestroyRef);
    private readonly preview$ = new Subject<void>();
    readonly weekdays = WEEKDAYS;
    readonly months = MONTHS;
    readonly weekNumbers = WEEK_NUMBERS;
    readonly priorities = PRIORITIES;
    readonly runStatusClass = RUN_STATUS_CLASS;
    readonly monthDayOptions = [...Array.from({length: 31}, (_, i) => ({value: i + 1, label: String(i + 1)})), {value: -1, label: 'Last day'}];
    readonly repeatOptions: {value: RecurrenceType; label: string}[] = [
        {value: 'Once', label: 'Does not repeat'},
        {value: 'Minutely', label: 'Every few minutes'},
        {value: 'Hourly', label: 'Hourly'},
        {value: 'Daily', label: 'Daily'},
        {value: 'BusinessDay', label: 'Every weekday (Mon–Fri)'},
        {value: 'Weekly', label: 'Weekly'},
        {value: 'Monthly', label: 'Monthly'},
        {value: 'Yearly', label: 'Yearly'},
        {value: 'Cron', label: 'Custom (cron)'}
    ];

    id: string | null = null;
    lookups: ProcessLookups | null = null;
    def: ScheduleDefinition = newScheduleDefinition('UTC');
    detail: ScheduleDetail | null = null;
    monthlyMode: 'days' | 'weekday' = 'days';
    timeZones: string[] = [];

    previewRuns: string[] = [];
    previewSummary = '';
    previewError: string | null = null;

    runs: ScheduleRun[] = [];
    loading = false;
    saving = false;
    error: string | null = null;

    constructor(private api: ProcessApiService, private route: ActivatedRoute, private router: Router) {}

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        this.timeZones = (Intl as any).supportedValuesOf?.('timeZone') ?? [];

        this.preview$.pipe(
            debounceTime(400),
            switchMap(() => this.api.previewSchedule(this.payload()).pipe(catchError(e => {
                this.previewError = errorMessageOf(e, 'This repeat pattern is not valid.');
                return of(null);
            }))),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(p => {
            if (p) { this.previewRuns = p.runs; this.previewSummary = p.summary; this.previewError = null; }
            else { this.previewRuns = []; }
        });

        this.api.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(l => {
            this.lookups = l;
            if (!this.id) {
                this.def = newScheduleDefinition(l.orgTimeZone);
                this.def.assigneeId = l.currentUserId;
                this.changed();
            }
        });

        if (this.id) {
            this.loading = true;
            this.api.schedule(this.id).pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
                next: d => {
                    this.detail = d;
                    this.def = {...d.definition, startTime: d.definition.startTime.slice(0, 5)};
                    this.monthlyMode = d.definition.recurrence.weekNumbers.length ? 'weekday' : 'days';
                    this.changed();
                },
                error: e => this.error = errorMessageOf(e, 'Could not load the schedule.')
            });
            this.api.scheduleRuns(this.id, 0, 20).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(p => this.runs = p.items);
        }
    }

    get r() { return this.def.recurrence; }

    get intervalUnit(): string {
        return ({Minutely: 'minutes', Hourly: 'hours', Daily: 'days', Weekly: 'weeks', Monthly: 'months', Yearly: 'years'} as Record<string, string>)[this.r.type] ?? '';
    }

    changed() { this.preview$.next(); }

    setRepeat(type: RecurrenceType) {
        this.r.type = type;
        this.r.interval = type === 'Minutely' ? 15 : 1;
        if (type === 'Weekly' && !this.r.weekDays.length) { this.r.weekDays = [1]; }
        if ((type === 'Monthly' || type === 'Yearly') && !this.r.monthDays.length) { this.r.monthDays = [1]; }
        if (type === 'Yearly' && !this.r.months.length) { this.r.months = [1]; }
        if (type === 'Cron' && !this.r.cronExpression) { this.r.cronExpression = '0 9 * * 1-5'; }
        this.changed();
    }

    toggle(list: number[], value: number) {
        const i = list.indexOf(value);
        i >= 0 ? list.splice(i, 1) : list.push(value);
        this.changed();
    }

    setMonthlyMode(mode: 'days' | 'weekday') {
        this.monthlyMode = mode;
        if (mode === 'weekday') {
            this.r.weekNumbers = this.r.weekNumbers.length ? this.r.weekNumbers : [1];
            this.r.weekDays = this.r.weekDays.length ? this.r.weekDays : [1];
        } else {
            this.r.weekNumbers = [];
        }
        this.changed();
    }

    addReminder() { this.def.reminders.push({triggerType: 'BeforeOccurrence', offsetMinutes: 60}); this.changed(); }
    removeReminder(i: number) { this.def.reminders.splice(i, 1); }

    save(active: boolean) {
        this.error = null;
        if (!this.def.name.trim()) { this.error = 'Give the schedule a name.'; return; }
        if (this.def.kind === 'StartProcess' && !this.def.workflowId) { this.error = 'Choose the workflow to start.'; return; }

        this.saving = true;
        this.api.saveSchedule(this.id, {...this.payload(), active}).pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => this.router.navigate(['/admin', 'process', 'schedules']),
            error: e => this.error = errorMessageOf(e, 'The schedule could not be saved.')
        });
    }

    remove() {
        if (!this.id || !confirm('Delete this schedule? Runs already made stay; no new ones are created.')) { return; }
        this.api.deleteSchedule(this.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => this.router.navigate(['/admin', 'process', 'schedules']),
            error: e => this.error = errorMessageOf(e, 'The schedule could not be deleted.')
        });
    }

    /** What the API receives: only the fields that matter for the chosen repeat type. */
    private payload(): ScheduleDefinition {
        const d = this.def;
        const r = d.recurrence;
        return {
            ...d,
            name: d.name.trim() || 'Untitled',
            startTime: d.startTime.length === 5 ? `${d.startTime}:00` : d.startTime,
            endDate: d.endDate || null,
            assigneeId: d.assigneeId || null,
            assigneeRoleId: d.assigneeId ? null : (d.assigneeRoleId || null),
            workflowId: d.kind === 'StartProcess' ? d.workflowId : null,
            recurrence: {
                ...r,
                weekNumbers: r.type === 'Monthly' && this.monthlyMode === 'weekday' ? r.weekNumbers : [],
                cronExpression: r.type === 'Cron' ? r.cronExpression : null
            }
        };
    }

    trackByIndex(i: number) { return i; }
}
