import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {ComplianceLookups, STATUS_BADGE, TaskRow} from "../domains/compliance.models";
import {ComplianceApiService, errorMessageOf} from "../services/compliance-api.service";

interface Cell { date: string; day: number; inMonth: boolean; isToday: boolean; tasks: TaskRow[]; }

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** A month of due dates (weeks start on Monday). */
@Component({standalone: false, templateUrl: './templates/calendar.html'})
export class ComplianceCalendarView implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate!: TemplateRef<any>;
    private readonly destroyRef = inject(DestroyRef);
    readonly badge = STATUS_BADGE;
    readonly weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    lookups: ComplianceLookups | null = null;
    month = new Date();
    weeks: Cell[][] = [];
    loading = false;
    error: string | null = null;
    openTaskId: string | null = null;

    constructor(private api: ComplianceApiService) {}

    ngOnInit() {
        this.month = new Date(this.month.getFullYear(), this.month.getMonth(), 1);
        this.api.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: l => this.lookups = l, error: () => {}});
        this.load();
    }

    move(delta: number) { this.month = new Date(this.month.getFullYear(), this.month.getMonth() + delta, 1); this.load(); }
    today() { const n = new Date(); this.month = new Date(n.getFullYear(), n.getMonth(), 1); this.load(); }

    load() {
        const first = new Date(this.month);
        const start = new Date(first); start.setDate(1 - ((first.getDay() + 6) % 7));
        const last = new Date(first.getFullYear(), first.getMonth() + 1, 0);
        const end = new Date(last); end.setDate(last.getDate() + (6 - ((last.getDay() + 6) % 7)));
        this.loading = true;
        this.api.calendar(iso(start), iso(end)).pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: days => {
                const byDate = new Map(days.map(d => [d.date, d.tasks]));
                const todayIso = this.lookups?.today ?? iso(new Date());
                const cells: Cell[] = [];
                for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                    const key = iso(d);
                    cells.push({date: key, day: d.getDate(), inMonth: d.getMonth() === first.getMonth(), isToday: key === todayIso, tasks: byDate.get(key) ?? []});
                }
                this.weeks = Array.from({length: cells.length / 7}, (_, i) => cells.slice(i * 7, i * 7 + 7));
            },
            error: e => this.error = errorMessageOf(e, 'Could not load the calendar.')
        });
    }
}
