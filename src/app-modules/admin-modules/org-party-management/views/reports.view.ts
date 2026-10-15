import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize} from "rxjs";
import {AgingReport, Form1099Report, PartyRole, money} from "../domains/party.models";
import {PartyApiService, errorMessageOf} from "../services/party-api.service";

const csv = (name: string, rows: any[][]) => {
    const esc = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([rows.map(r => r.map(esc).join(',')).join('\r\n')], {type: 'text/csv'}));
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};

/** Accounts receivable / payable aging as of a date: who owes what, and how late. */
@Component({standalone: false, templateUrl: './templates/aging.html'})
export class AgingView implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate: TemplateRef<any>;
    private readonly destroyRef = inject(DestroyRef);

    role: PartyRole = 'customer';
    asOf = new Date().toISOString().slice(0, 10);
    search = '';
    report: AgingReport | null = null;
    loading = false;
    error: string | null = null;

    constructor(private api: PartyApiService, private route: ActivatedRoute, private router: Router) {}

    ngOnInit() {
        const r = this.route.snapshot.queryParamMap.get('role');
        if (r === 'vendor' || r === 'customer' || r === 'employee') { this.role = r; }
        this.load();
    }

    setRole(role: PartyRole) {
        this.role = role;
        this.router.navigate([], {relativeTo: this.route, queryParams: {role}, replaceUrl: true});
        this.load();
    }

    load() {
        this.loading = true;
        this.error = null;
        this.api.aging(this.role, this.asOf, this.search || null).pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => this.report = r,
            error: e => this.error = errorMessageOf(e, 'Could not load the aging report.')
        });
    }

    open(partyId: string) { this.router.navigate(['..', this.role === 'vendor' ? 'vendors' : this.role === 'employee' ? 'employees' : 'customers', partyId], {relativeTo: this.route}); }

    export() {
        const r = this.report;
        if (!r) { return; }
        csv(`${this.role}-aging-${r.asOf}.csv`, [
            ['Number', 'Name', 'Terms', 'Not yet due', '1-30', '31-60', '61-90', 'Over 90', 'Total'],
            ...r.rows.map(x => [x.number, x.name, x.paymentTerm, x.buckets.current, x.buckets.days1To30, x.buckets.days31To60, x.buckets.days61To90, x.buckets.over90, x.buckets.total]),
            ['', 'Total', '', r.totals.current, r.totals.days1To30, r.totals.days31To60, r.totals.days61To90, r.totals.over90, r.totals.total]
        ]);
    }

    fmt(v: number) { return v ? money(v, this.report?.currencyCode ?? 'USD') : '—'; }
}

/** US Form 1099 summary for a calendar year: reportable vendors and missing TIN / W-9. */
@Component({standalone: false, templateUrl: './templates/form1099.html'})
export class Form1099View implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate: TemplateRef<any>;
    private readonly destroyRef = inject(DestroyRef);

    readonly years = Array.from({length: 6}, (_, i) => new Date().getFullYear() - i);
    year = new Date().getFullYear() - 1;
    onlyReportable = true;
    report: Form1099Report | null = null;
    loading = false;
    error: string | null = null;

    constructor(private api: PartyApiService) {}

    ngOnInit() { this.load(); }

    load() {
        this.loading = true;
        this.error = null;
        this.api.form1099(this.year).pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => this.report = r,
            error: e => this.error = errorMessageOf(e, 'Could not load the 1099 summary.')
        });
    }

    get rows() { return (this.report?.rows ?? []).filter(r => !this.onlyReportable || r.reportable); }

    export() {
        const r = this.report;
        if (!r) { return; }
        csv(`1099-${r.year}.csv`, [['Number', 'Name', 'TIN', 'W-9 on file', 'Form', 'Paid', 'Reportable', 'Issue'],
            ...r.rows.map(x => [x.number, x.name, x.tinMasked, x.w9OnFile ? 'yes' : 'no', x.form === 'Misc' ? '1099-MISC' : '1099-NEC', x.paid, x.reportable ? 'yes' : 'no', x.issue])]);
    }

    fmt(v: number) { return money(v, 'USD'); }
}
