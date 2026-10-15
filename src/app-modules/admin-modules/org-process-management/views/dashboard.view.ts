import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Subject, debounceTime, finalize, switchMap, tap} from "rxjs";
import {Dashboard, ProcessLookups} from "../domains/process.models";
import {ProcessApiService, errorMessageOf} from "../services/process-api.service";
import {BarRow, BarSeries, LinePoint, LineSeries} from "../components/dashboard-charts";

type CardKey = 'processes' | 'tasks' | 'stages' | 'teams' | 'people' | 'sla' | 'notifications';

/**
 * Process dashboard. Filters (period, workflow, team) sit in one row and scope everything; refetching keeps the
 * previous render dimmed instead of flashing. Each chart has a table view. Administrators see the branch, everyone
 * else their own processes and tasks.
 */
@Component({
    standalone: false,
    templateUrl: './templates/dashboard.html',
    styleUrls: ['./templates/dashboard.css']
})
export class DashboardView implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate: TemplateRef<any>;

    private readonly destroyRef = inject(DestroyRef);
    private readonly reload$ = new Subject<void>();
    readonly periods = [7, 30, 90];

    lookups: ProcessLookups | null = null;
    data: Dashboard | null = null;
    days = 30;
    workflowId = '';
    teamId = '';
    loading = false;
    error: string | null = null;
    tableView: Partial<Record<CardKey, boolean>> = {};

    readonly processSeries: LineSeries[] = [
        {key: 'started', label: 'Started', color: 'var(--dash-s1)'},
        {key: 'completed', label: 'Completed', color: 'var(--dash-s2)'}
    ];
    readonly taskSeries: LineSeries[] = [
        {key: 'created', label: 'Created', color: 'var(--dash-s1)'},
        {key: 'completed', label: 'Completed', color: 'var(--dash-s2)'}
    ];
    readonly workloadSeries: BarSeries[] = [
        {key: 'onTrack', label: 'On track', color: 'var(--dash-s1)'},
        {key: 'overdue', label: 'Overdue', color: 'var(--dash-critical)', icon: 'fa fa-exclamation-circle'}
    ];
    readonly deliverySeries: BarSeries[] = [
        {key: 'sent', label: 'Sent', color: 'var(--dash-good)', icon: 'fa fa-check-circle'},
        {key: 'pending', label: 'Retrying', color: 'var(--dash-warning)', icon: 'fa fa-clock-o'},
        {key: 'failed', label: 'Failed', color: 'var(--dash-critical)', icon: 'fa fa-exclamation-circle'}
    ];

    processPoints: LinePoint[] = [];
    taskPoints: LinePoint[] = [];
    stageRows: BarRow[] = [];
    teamRows: BarRow[] = [];
    peopleRows: BarRow[] = [];
    slaRows: BarRow[] = [];
    deliveryRows: BarRow[] = [];

    constructor(private api: ProcessApiService) {}

    ngOnInit() {
        this.api.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(l => this.lookups = l);
        this.reload$.pipe(
            debounceTime(150),
            tap(() => { this.loading = true; this.error = null; }),
            switchMap(() => this.api.dashboard({days: this.days, workflowId: this.workflowId || null, teamId: this.teamId || null})
                .pipe(finalize(() => this.loading = false))),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: d => this.apply(d),
            error: e => this.error = errorMessageOf(e, 'Could not load the dashboard.')
        });
        this.reload$.next();
    }

    reload() { this.reload$.next(); }

    setDays(days: number) { this.days = days; this.reload(); }

    toggle(card: CardKey) { this.tableView[card] = !this.tableView[card]; }

    get periodLabel() { return `previous ${this.days} days`; }
    get selectedWorkflow() { return this.lookups?.workflows.find(w => w.id === this.workflowId)?.name ?? null; }
    get eventsTotal() { return Object.values(this.data?.events ?? {}).reduce((a, b) => a + b, 0); }

    eventCount(status: string) { return this.data?.events?.[status] ?? 0; }

    private apply(d: Dashboard) {
        this.data = d;
        const label = (iso: string) => new Date(iso + 'T00:00:00').toLocaleDateString(undefined, {day: 'numeric', month: 'short'});
        this.processPoints = d.daily.map(p => ({label: label(p.date), values: {started: p.processesStarted, completed: p.processesCompleted}}));
        this.taskPoints = d.daily.map(p => ({label: label(p.date), values: {created: p.tasksCreated, completed: p.tasksCompleted}}));
        this.stageRows = d.stages.map(s => ({
            label: this.workflowId ? s.stageName : `${s.workflowName} · ${s.stageName}`,
            value: s.active,
            sub: s.overdue ? `${s.overdue} past the stage time limit` : null
        }));
        this.teamRows = d.teams.map(t => ({
            label: t.name, value: t.onTrack + t.overdue,
            sub: t.queued ? `${t.queued} waiting in queue` : null,
            segments: [{key: 'onTrack', value: t.onTrack}, {key: 'overdue', value: t.overdue}]
        }));
        this.peopleRows = d.assignees.map(a => ({label: a.name, value: a.open, sub: a.overdue ? `${a.overdue} overdue` : null}));
        this.slaRows = d.slaHotspots.map(h => ({
            label: `${h.workflowName} · ${h.stageName}`, value: h.breaches,
            sub: `${Math.round(100 * h.breaches / Math.max(1, h.entered))}% of ${h.entered} entries`
        }));
        this.deliveryRows = d.notifications.map(n => ({
            label: n.channel === 'InApp' ? 'In-app' : n.channel, value: n.sent + n.pending + n.failed,
            segments: [{key: 'sent', value: n.sent}, {key: 'pending', value: n.pending}, {key: 'failed', value: n.failed}]
        }));
    }

    hours(v: number | null) {
        if (v === null || v === undefined) { return '—'; }
        return v >= 48 ? `${(v / 24).toFixed(1)} d` : `${v.toFixed(1)} h`;
    }
}
