import {AfterViewInit, Component, ElementRef, Input, NgZone, OnChanges, OnDestroy, ViewChild} from "@angular/core";

/**
 * Small, dependency-free chart pieces for the process dashboard, built to the data-viz mark specs: 2px lines, bars
 * at most 14px thick with a 4px rounded data end, 2px surface gaps between stacked segments, recessive hairline grid,
 * one crosshair tooltip listing every series, values at line ends / bar tips only. Colours come from CSS custom
 * properties set on the dashboard root (light and dark steps), never from text.
 */

export interface LineSeries { key: string; label: string; color: string; }
export interface LinePoint { label: string; values: Record<string, number>; }
export interface BarSegment { key: string; value: number; }
export interface BarRow { label: string; sub?: string | null; value: number; segments?: BarSegment[]; }
export interface BarSeries { key: string; label: string; color: string; icon?: string; }

/** 1,284 → 1,284 · 12,900 → 12.9K · 4,200,000 → 4.2M */
export const compact = (n: number | null | undefined): string => {
    if (n === null || n === undefined || isNaN(n)) { return '—'; }
    const abs = Math.abs(n);
    if (abs >= 1_000_000) { return (n / 1_000_000).toFixed(abs >= 10_000_000 ? 0 : 1).replace(/\.0$/, '') + 'M'; }
    if (abs >= 10_000) { return (n / 1_000).toFixed(abs >= 100_000 ? 0 : 1).replace(/\.0$/, '') + 'K'; }
    return Math.round(n).toLocaleString();
};

/** Clean axis maximum and ticks: 0, step, 2·step … ≥ max (steps of 1, 2 or 5 × 10ⁿ). */
const niceTicks = (max: number, count = 4): number[] => {
    if (max <= 0) { return [0, 1]; }
    const raw = max / count;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 5, 10].map(m => m * mag).find(s => s >= raw) ?? 10 * mag;
    const ticks: number[] = [];
    for (let v = 0; v <= max + step * 0.001; v += step) { ticks.push(Math.round(v * 1000) / 1000); }
    if (ticks[ticks.length - 1] < max) { ticks.push(ticks[ticks.length - 1] + step); }
    return ticks;
};

/** Multi-series line chart with a snapping crosshair and one tooltip for all series. */
@Component({
    selector: 'dash-line-chart',
    standalone: false,
    template: `
        <div class="dash-legend" *ngIf="series.length > 1">
            <span *ngFor="let s of series" class="dash-legend-item"><i class="dash-key-line" [style.background]="s.color"></i>{{ s.label }}</span>
        </div>
        <div #host class="dash-plot" [style.height.px]="height" (pointerleave)="hover = null">
            <svg *ngIf="width > 0" [attr.width]="width" [attr.height]="height" role="img" [attr.aria-label]="ariaLabel"
                 (pointermove)="onMove($event)" (pointerdown)="onMove($event)">
                <g>
                    <line *ngFor="let t of ticks" [attr.x1]="left" [attr.x2]="width - right" [attr.y1]="y(t)" [attr.y2]="y(t)" class="dash-gridline"></line>
                    <text *ngFor="let t of ticks" [attr.x]="left - 8" [attr.y]="y(t)" class="dash-tick" text-anchor="end" dominant-baseline="middle">{{ fmt(t) }}</text>
                    <line [attr.x1]="left" [attr.x2]="width - right" [attr.y1]="y(0)" [attr.y2]="y(0)" class="dash-baseline"></line>
                    <text *ngFor="let i of xLabelIdx" [attr.x]="x(i)" [attr.y]="height - 6" class="dash-tick" text-anchor="middle">{{ points[i].label }}</text>
                </g>
                <path *ngFor="let s of series" [attr.d]="path(s.key)" fill="none" [attr.stroke]="s.color" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
                <ng-container *ngIf="points.length">
                    <ng-container *ngFor="let s of series">
                        <circle [attr.cx]="x(points.length - 1)" [attr.cy]="y(last(s.key))" r="4" [attr.fill]="s.color" class="dash-dot"></circle>
                        <text [attr.x]="x(points.length - 1) + 8" [attr.y]="y(last(s.key))" class="dash-end-label" dominant-baseline="middle">{{ fmt(last(s.key)) }}</text>
                    </ng-container>
                </ng-container>
                <g *ngIf="hover !== null">
                    <line [attr.x1]="x(hover)" [attr.x2]="x(hover)" [attr.y1]="top" [attr.y2]="y(0)" class="dash-crosshair"></line>
                    <circle *ngFor="let s of series" [attr.cx]="x(hover)" [attr.cy]="y(points[hover].values[s.key] || 0)" r="4" [attr.fill]="s.color" class="dash-dot"></circle>
                </g>
            </svg>
            <div *ngIf="hover !== null" class="dash-tooltip" [style.left.px]="tooltipLeft" [style.top.px]="top">
                <div class="dash-tooltip-title">{{ points[hover].label }}</div>
                <div *ngFor="let s of series" class="dash-tooltip-row">
                    <i class="dash-key-line" [style.background]="s.color"></i><b>{{ fmt(points[hover].values[s.key] || 0) }}</b><span>{{ s.label }}</span>
                </div>
            </div>
        </div>`
})
export class DashLineChartComponent implements AfterViewInit, OnChanges, OnDestroy {
    @Input() series: LineSeries[] = [];
    @Input() points: LinePoint[] = [];
    @Input() height = 220;
    @Input() ariaLabel = '';
    @ViewChild('host', {static: true}) host!: ElementRef<HTMLElement>;

    width = 0;
    hover: number | null = null;
    ticks: number[] = [0, 1];
    readonly left = 36;
    readonly right = 40;
    readonly top = 10;
    readonly bottom = 26;
    private observer?: ResizeObserver;

    constructor(private zone: NgZone) {}

    ngAfterViewInit() {
        this.observer = new ResizeObserver(entries => this.zone.run(() => this.width = Math.floor(entries[0].contentRect.width)));
        this.observer.observe(this.host.nativeElement);
    }

    ngOnChanges() {
        const max = Math.max(0, ...this.points.flatMap(p => this.series.map(s => p.values[s.key] || 0)));
        this.ticks = niceTicks(max);
        this.hover = null;
    }

    ngOnDestroy() { this.observer?.disconnect(); }

    get xLabelIdx(): number[] {
        const n = this.points.length;
        if (n <= 1) { return n ? [0] : []; }
        const wanted = Math.max(2, Math.min(6, Math.floor((this.width - this.left - this.right) / 80)));
        const step = Math.max(1, Math.round((n - 1) / (wanted - 1)));
        const idx: number[] = [];
        for (let i = 0; i < n; i += step) { idx.push(i); }
        if (idx[idx.length - 1] !== n - 1) { idx[idx.length - 1] = n - 1; }
        return idx;
    }

    x(i: number) {
        const n = Math.max(1, this.points.length - 1);
        return this.left + (i / n) * (this.width - this.left - this.right);
    }

    y(v: number) {
        const max = this.ticks[this.ticks.length - 1] || 1;
        return this.top + (1 - v / max) * (this.height - this.top - this.bottom);
    }

    last(key: string) { return this.points[this.points.length - 1]?.values[key] || 0; }

    path(key: string) {
        return this.points.map((p, i) => `${i ? 'L' : 'M'}${this.x(i).toFixed(1)},${this.y(p.values[key] || 0).toFixed(1)}`).join(' ');
    }

    onMove(e: PointerEvent) {
        if (!this.points.length) { return; }
        const rect = (e.currentTarget as SVGElement).getBoundingClientRect();
        const px = e.clientX - rect.left;
        const n = this.points.length - 1;
        const i = Math.round(((px - this.left) / Math.max(1, this.width - this.left - this.right)) * n);
        this.hover = Math.min(n, Math.max(0, i));
    }

    /** Beside the crosshair, flipped to the left in the right half, always inside the plot. */
    get tooltipLeft() {
        const px = this.x(this.hover ?? 0);
        const wanted = px > this.width / 2 ? px - 172 : px + 12;
        return Math.max(0, Math.min(wanted, this.width - 170));
    }

    fmt(v: number) { return compact(v); }
}

/** Horizontal bars (one value per row, or stacked segments) with values at the tip and a per-bar tooltip. */
@Component({
    selector: 'dash-bar-list',
    standalone: false,
    template: `
        <div class="dash-legend" *ngIf="series.length > 1">
            <span *ngFor="let s of series" class="dash-legend-item"><i class="dash-key-rect" [style.background]="s.color"></i><i *ngIf="s.icon" [class]="s.icon + ' mr-1'"></i>{{ s.label }}</span>
        </div>
        <div class="dash-bars" (pointerleave)="tip = null">
            <div *ngFor="let r of rows; let i = index" class="dash-bar-row" tabindex="0" (pointermove)="show(i, $event)" (focus)="show(i, null)" (blur)="tip = null">
                <div class="dash-bar-label text-ellipsis" [title]="r.label">{{ r.label }}<span *ngIf="r.sub" class="dash-bar-sub">{{ r.sub }}</span></div>
                <div class="dash-bar-track">
                    <ng-container *ngIf="r.segments; else single">
                        <span class="dash-bar-fill" style="display: inline-flex" [style.width.%]="pct(r.value)">
                            <span *ngFor="let seg of visible(r); let last = last" class="dash-seg" [class.dash-seg-end]="last"
                                  [style.flex-grow]="seg.value" [style.background]="colorOf(seg.key)"></span>
                        </span>
                    </ng-container>
                    <ng-template #single><span class="dash-bar-fill dash-seg-end" [style.width.%]="pct(r.value)" [style.background]="color"></span></ng-template>
                    <span class="dash-bar-value">{{ fmt(r.value) }}</span>
                </div>
            </div>
            <div *ngIf="!rows.length" class="dash-empty">{{ empty }}</div>
            <div *ngIf="tip !== null && rows[tip] as r" class="dash-tooltip" [style.top.px]="tipTop" style="right: 8px">
                <div class="dash-tooltip-title">{{ r.label }}</div>
                <ng-container *ngIf="r.segments; else oneValue">
                    <div *ngFor="let seg of r.segments" class="dash-tooltip-row">
                        <i class="dash-key-rect" [style.background]="colorOf(seg.key)"></i><b>{{ fmt(seg.value) }}</b><span>{{ labelOf(seg.key) }}</span>
                    </div>
                </ng-container>
                <ng-template #oneValue><div class="dash-tooltip-row"><b>{{ fmt(r.value) }}</b><span>{{ valueLabel }}</span></div></ng-template>
                <div *ngIf="r.sub" class="dash-tooltip-sub">{{ r.sub }}</div>
            </div>
        </div>`
})
export class DashBarListComponent {
    @Input() rows: BarRow[] = [];
    @Input() series: BarSeries[] = [];
    /** Single-value bars: one sequential hue. */
    @Input() color = 'var(--dash-seq)';
    @Input() valueLabel = '';
    @Input() empty = 'Nothing to show for this period.';

    tip: number | null = null;
    tipTop = 0;

    get max() { return Math.max(1, ...this.rows.map(r => r.value)); }

    pct(v: number) { return Math.max(v > 0 ? 1.5 : 0, (v / this.max) * 100); }
    visible(r: BarRow) { return (r.segments ?? []).filter(s => s.value > 0); }
    colorOf(key: string) { return this.series.find(s => s.key === key)?.color ?? 'var(--dash-muted)'; }
    labelOf(key: string) { return this.series.find(s => s.key === key)?.label ?? key; }

    show(i: number, e: PointerEvent | null) {
        this.tip = i;
        const row = (e?.currentTarget as HTMLElement) ?? null;
        this.tipTop = row ? row.offsetTop + row.offsetHeight : i * 34 + 34;
    }

    fmt(v: number) { return compact(v); }
}

/** KPI tile: label, value, delta vs the previous period (direction × whether up is good), optional status. */
@Component({
    selector: 'dash-stat',
    standalone: false,
    template: `
        <div class="dash-stat" [class.dash-hero]="hero">
            <div class="dash-stat-label">{{ label }}</div>
            <div class="dash-stat-value">
                <i *ngIf="status" class="fa mr-1" [ngClass]="status === 'critical' ? 'fa-exclamation-circle' : 'fa-exclamation-triangle'"
                   [style.color]="status === 'critical' ? 'var(--dash-critical)' : 'var(--dash-warning)'" [attr.aria-label]="status"></i>{{ display }}
            </div>
            <div class="dash-stat-delta" *ngIf="deltaText as d" [style.color]="deltaColor">{{ d }}</div>
            <div class="dash-stat-hint" *ngIf="hint">{{ hint }}</div>
        </div>`
})
export class DashStatComponent {
    @Input() label = '';
    @Input() value: number | null | undefined = null;
    @Input() previous: number | null | undefined = null;
    @Input() format: 'number' | 'percent' | 'hours' = 'number';
    /** Whether a rise is good news (completions) or bad (overdue, cycle time). */
    @Input() upIsGood = true;
    @Input() hero = false;
    @Input() hint: string | null = null;
    @Input() status: 'warning' | 'critical' | null = null;
    @Input() periodLabel = 'previous period';

    get display() { return DashStatComponent.format(this.value, this.format); }

    static format(v: number | null | undefined, format: string): string {
        if (v === null || v === undefined) { return '—'; }
        if (format === 'percent') { return `${Math.round(v)}%`; }
        if (format === 'hours') { return v >= 48 ? `${(v / 24).toFixed(1)} d` : `${v.toFixed(v < 10 ? 1 : 0)} h`; }
        return compact(v);
    }

    get deltaText(): string | null {
        if (this.value === null || this.value === undefined || this.previous === null || this.previous === undefined) { return null; }
        const diff = this.value - this.previous;
        if (Math.abs(diff) < 0.05) { return `No change vs ${this.periodLabel}`; }
        const sign = diff > 0 ? '▲' : '▼';
        const amount = this.format === 'percent' ? `${Math.abs(Math.round(diff))} pts` : DashStatComponent.format(Math.abs(diff), this.format);
        return `${sign} ${amount} vs ${this.periodLabel}`;
    }

    get deltaColor() {
        if (this.value === null || this.value === undefined || this.previous === null || this.previous === undefined || this.value === this.previous) { return 'var(--dash-ink-2)'; }
        const good = (this.value > this.previous) === this.upIsGood;
        return good ? 'var(--dash-good-text)' : 'var(--dash-critical)';
    }
}
