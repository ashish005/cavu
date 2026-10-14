import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {PRIORITY_CLASS, ProcessLookups, TaskRow, TaskScope, isClosed} from "../domains/process.models";
import {zonedDay, zonedLocalToIso} from "../domains/zoned-time";
import {ProcessApiService, errorMessageOf} from "../services/process-api.service";

interface CalendarDay { date: string; day: number; inMonth: boolean; isToday: boolean; tasks: TaskRow[]; }

/** Month view of tasks by due day, in the organisation's timezone. */
@Component({standalone: false, templateUrl: './templates/calendar.html'})
export class CalendarView implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate: TemplateRef<any>;

    private readonly destroyRef = inject(DestroyRef);
    readonly priorityClass = PRIORITY_CLASS;
    readonly isClosed = isClosed;
    readonly weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    lookups: ProcessLookups | null = null;
    year = new Date().getFullYear();
    month = new Date().getMonth();
    scope: TaskScope = 'Mine';
    weeks: CalendarDay[][] = [];
    loading = false;
    error: string | null = null;
    panelTaskId: string | null | undefined = undefined;

    constructor(private api: ProcessApiService) {}

    get title(): string { return new Date(this.year, this.month, 1).toLocaleString('en-GB', {month: 'long', year: 'numeric'}); }

    ngOnInit() {
        this.api.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: l => { this.lookups = l; this.load(); },
            error: e => this.error = errorMessageOf(e, 'Could not load.')
        });
    }

    shift(delta: number) {
        const d = new Date(this.year, this.month + delta, 1);
        this.year = d.getFullYear();
        this.month = d.getMonth();
        this.load();
    }

    today() {
        const now = new Date();
        this.year = now.getFullYear();
        this.month = now.getMonth();
        this.load();
    }

    setScope(scope: TaskScope) { this.scope = scope; this.load(); }

    load() {
        const tz = this.lookups!.orgTimeZone;
        const days = this.buildGrid();
        const from = zonedLocalToIso(`${days[0].date}T00:00`, tz);
        const to = zonedLocalToIso(`${days[days.length - 1].date}T23:59`, tz);

        this.loading = true;
        this.api.tasks({scope: this.scope, includeClosed: true, dueFrom: from, dueTo: to, take: 200})
            .pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: page => {
                    const byDay = new Map<string, TaskRow[]>();
                    for (const t of page.items.filter(t => t.dueAt)) {
                        const key = zonedDay(t.dueAt!, tz);
                        byDay.set(key, [...(byDay.get(key) ?? []), t]);
                    }
                    for (const d of days) { d.tasks = byDay.get(d.date) ?? []; }
                    this.weeks = Array.from({length: days.length / 7}, (_, i) => days.slice(i * 7, i * 7 + 7));
                },
                error: e => this.error = errorMessageOf(e, 'Could not load tasks.')
            });
    }

    onPanelClosed(changed: boolean) {
        this.panelTaskId = undefined;
        if (changed) { this.load(); }
    }

    /** Six weeks starting on the Monday on or before the 1st. */
    private buildGrid(): CalendarDay[] {
        const tz = this.lookups!.orgTimeZone;
        const todayKey = zonedDay(new Date().toISOString(), tz);
        const first = new Date(Date.UTC(this.year, this.month, 1));
        const offset = (first.getUTCDay() + 6) % 7;
        const start = new Date(first.getTime() - offset * 86400000);
        return Array.from({length: 42}, (_, i) => {
            const d = new Date(start.getTime() + i * 86400000);
            const date = d.toISOString().slice(0, 10);
            return {date, day: d.getUTCDate(), inMonth: d.getUTCMonth() === this.month, isToday: date === todayKey, tasks: []};
        });
    }

    trackByDate(_: number, d: CalendarDay) { return d.date; }
}
