import {Component, DestroyRef, Injectable, Injector, Input, OnInit, inject} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Observable, catchError, map} from "rxjs";
import {CoreEndpointBase} from "../../services/endpoint-base.service";

// The member's dashboard, built by the tenant API: which portlets they see depends on their member type, roles,
// permissions and plan (Settings › Dashboards). Every portal's dashboard is this component.

export interface MyPortlet { code: string; name: string; description: string; width: number; }
export interface MyDashboard { userTypeCode: string; userTypeName: string; portlets: MyPortlet[]; }
export interface PortletStat { label: string; value: number | null; format: 'number' | 'money' | 'percent' | 'text'; tone: string | null; hint: string | null; link: string | null; }
export interface PortletItem { title: string; subtitle: string | null; value: string | null; tone: string | null; link: string | null; }
export interface PortletBar { label: string; value: number; tone: string | null; }
export interface PortletData {
    code: string; title: string; stats: PortletStat[]; items: PortletItem[]; bars: PortletBar[];
    currencyCode: string | null; note: string | null; link: string | null; linkLabel: string | null; emptyText: string | null;
}

const unwrap = <T>(r: any): T => {
    if (r?.isSuccess === false) { throw {error: r}; }
    return r?.data as T;
};

/** Tenant API `api/v1/dashboard/*`. */
@Injectable({providedIn: 'root'})
export class OrgDashboardService extends CoreEndpointBase {
    constructor(public override injector: Injector) { super(injector); }

    mine(): Observable<MyDashboard> {
        return this.httpClient.get(`${this.baseSectorAPIUrl}/v1/dashboard/me`, this.requestHeaders).pipe(
            map(r => unwrap<MyDashboard>(r)), catchError(e => this.handleError(e, () => this.mine())));
    }

    data(code: string): Observable<PortletData> {
        return this.httpClient.get(`${this.baseSectorAPIUrl}/v1/dashboard/portlets/${encodeURIComponent(code)}/data`, this.requestHeaders).pipe(
            map(r => unwrap<PortletData>(r)), catchError(e => this.handleError(e, () => this.data(code))));
    }
}

const messageOf = (e: any, fallback: string) => e?.error?.message || e?.error?.detail || fallback;

/** One portlet card: loads, fails and retries on its own, so one broken data source does not blank the dashboard. */
@Component({
    selector: 'org-portlet',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
        <div class="box h-100 mb-0 d-flex flex-column">
            <div class="box-header d-flex align-items-center pb-1">
                <div class="flex">
                    <h6 class="mb-0">{{ portlet.name }}</h6>
                    <small class="text-muted" *ngIf="data?.note">{{ data?.note }}</small>
                </div>
                <button type="button" class="btn btn-xs white" (click)="load()" [disabled]="loading" title="Refresh">
                    <i class="fa fa-refresh" [class.fa-spin]="loading"></i></button>
            </div>
            <div class="box-body pt-2 flex">
                <div *ngIf="loading && !data" class="text-muted text-sm py-3"><i class="fa fa-spinner fa-spin mr-1"></i>Loading…</div>
                <div *ngIf="error" class="text-sm text-danger py-2">
                    {{ error }} <a role="button" class="ml-1" (click)="load()">Try again</a>
                </div>

                <ng-container *ngIf="data as d">
                    <div class="row no-gutters" *ngIf="d.stats.length">
                        <div *ngFor="let s of d.stats" class="col mb-2 pr-2" style="min-width: 120px">
                            <div class="text-xs text-muted text-truncate" [title]="s.label">{{ s.label }}</div>
                            <a *ngIf="s.link; else plain" [routerLink]="s.link" class="h5 mb-0 d-block _600" [ngClass]="toneText(s.tone)">{{ show(s, d) }}</a>
                            <ng-template #plain><div class="h5 mb-0 _600" [ngClass]="toneText(s.tone)">{{ show(s, d) }}</div></ng-template>
                            <div class="text-xs text-muted text-truncate" *ngIf="s.hint && s.format !== 'text'" [title]="s.hint">{{ s.hint }}</div>
                        </div>
                    </div>

                    <div *ngIf="d.bars.length && hasBarValues(d)" class="mt-1 mb-2">
                        <div *ngFor="let b of d.bars" class="d-flex align-items-center mb-1 text-xs">
                            <span class="text-truncate" style="width: 34%" [title]="b.label">{{ b.label }}</span>
                            <div class="flex mx-2 rounded" style="height: 8px; background: rgba(120,130,140,.2)">
                                <div class="rounded h-100" [style.width.%]="barWidth(b, d)" [ngClass]="toneBg(b.tone)"></div>
                            </div>
                            <span class="text-right" style="min-width: 64px">{{ format(b.value, d.currencyCode ? 'money' : 'number', d.currencyCode) }}</span>
                        </div>
                    </div>

                    <div *ngFor="let i of d.items" class="d-flex align-items-center py-1 text-sm" style="border-top: 1px solid rgba(120,130,140,.2)">
                        <div class="flex text-truncate">
                            <a *ngIf="i.link; else title" [routerLink]="i.link" class="_500" [ngClass]="toneText(i.tone)">{{ i.title }}</a>
                            <ng-template #title><span class="_500" [ngClass]="toneText(i.tone)">{{ i.title }}</span></ng-template>
                            <div class="text-xs text-muted text-truncate" *ngIf="i.subtitle">{{ i.subtitle }}</div>
                        </div>
                        <span class="text-xs ml-2" *ngIf="i.value" [ngClass]="toneText(i.tone)">{{ i.value }}</span>
                    </div>

                    <div *ngIf="isEmpty(d)" class="text-sm text-muted py-2">{{ d.emptyText || 'Nothing to show yet.' }}</div>
                </ng-container>
            </div>
            <div class="px-3 pb-2 text-xs" *ngIf="data?.link">
                <a [routerLink]="data?.link">{{ data?.linkLabel || 'Open' }} <i class="fa fa-angle-right"></i></a>
            </div>
        </div>`
})
export class OrgPortletComponent implements OnInit {
    @Input({required: true}) portlet!: MyPortlet;
    private readonly destroyRef = inject(DestroyRef);
    data: PortletData | null = null;
    loading = false;
    error: string | null = null;

    constructor(private api: OrgDashboardService) {}

    ngOnInit() { this.load(); }

    load() {
        this.loading = true;
        this.error = null;
        this.api.data(this.portlet.code).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => { this.data = d; this.loading = false; },
            error: e => { this.error = messageOf(e, 'Could not load this item.'); this.loading = false; }
        });
    }

    show(s: PortletStat, d: PortletData) { return s.format === 'text' ? (s.hint ?? '—') : this.format(s.value, s.format, d.currencyCode); }

    format(value: number | null | undefined, kind: string, currency: string | null): string {
        if (value === null || value === undefined) { return '—'; }
        if (kind === 'percent') { return `${Math.round(value)}%`; }
        if (kind === 'money') {
            try { return new Intl.NumberFormat(undefined, {style: 'currency', currency: currency || 'USD', maximumFractionDigits: 0}).format(value); }
            catch { return value.toLocaleString(undefined, {maximumFractionDigits: 0}); }
        }
        return value.toLocaleString(undefined, {maximumFractionDigits: 2});
    }

    hasBarValues(d: PortletData) { return d.bars.some(b => b.value > 0); }
    barWidth(b: PortletBar, d: PortletData) {
        const max = Math.max(...d.bars.map(x => x.value), 0);
        return max > 0 ? Math.max(2, b.value * 100 / max) : 0;
    }
    /** The portlet's own empty text when its list is empty; a generic one only when it has nothing at all. */
    isEmpty(d: PortletData) { return !d.items.length && (!!d.emptyText || (!d.stats.length && !this.hasBarValues(d))); }

    toneText(tone: string | null) { return tone ? `text-${tone === 'warn' ? 'warning' : tone}` : ''; }
    toneBg(tone: string | null) { return tone === 'danger' ? 'danger' : tone === 'warn' ? 'warning' : tone === 'success' ? 'success' : 'theme'; }
}

/**
 * A member's dashboard: `<org-dashboard [title]="title"></org-dashboard>`. The API decides the portlets and their order
 * and width; administrators change them under Settings › Dashboards.
 */
@Component({
    selector: 'org-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, OrgPortletComponent],
    template: `
        <div class="d-flex flex-column flex scroll-y">
            <div class="p-3">
                <div class="d-flex align-items-center mb-3">
                    <div class="flex">
                        <h5 class="mb-0">{{ title || 'Dashboard' }}</h5>
                        <small class="text-muted" *ngIf="board?.userTypeName">{{ board?.userTypeName }}</small>
                    </div>
                    <button type="button" class="btn btn-sm white" (click)="load()" [disabled]="loading" title="Refresh everything">
                        <i class="fa fa-refresh" [class.fa-spin]="loading"></i></button>
                </div>
                <div *ngIf="loading && !board" class="text-muted p-4 text-center"><i class="fa fa-spinner fa-spin mr-1"></i>Loading your dashboard…</div>
                <div *ngIf="error" class="alert alert-danger d-flex align-items-center">
                    <span class="flex">{{ error }}</span><button class="btn btn-sm white" (click)="load()">Retry</button>
                </div>
                <div *ngIf="board && !board.portlets.length" class="box p-4 text-center text-muted">
                    Nothing is set to show on your dashboard. An administrator can choose what each role sees under Settings › Dashboards.
                </div>
                <div class="row" *ngIf="board">
                    <div *ngFor="let p of board.portlets; trackBy: byCode" class="mb-3" [ngClass]="'col-12 col-lg-' + p.width">
                        <org-portlet [portlet]="p"></org-portlet>
                    </div>
                </div>
            </div>
        </div>`
})
export class OrgDashboardComponent implements OnInit {
    @Input() title: string | null = null;
    private readonly destroyRef = inject(DestroyRef);
    board: MyDashboard | null = null;
    loading = false;
    error: string | null = null;

    constructor(private api: OrgDashboardService) {}

    ngOnInit() { this.load(); }

    load() {
        this.loading = true;
        this.error = null;
        // A fresh board re-creates the cards, so each reloads its data.
        this.board = null;
        this.api.mine().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: b => { this.board = b; this.loading = false; },
            error: e => { this.error = messageOf(e, 'Your dashboard could not be loaded.'); this.loading = false; }
        });
    }

    byCode(_: number, p: MyPortlet) { return p.code; }
}
