import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {todayIso} from "../../domains/finance.models";
import {financeErrorOf} from "../../services/finance-api.service";
import {InventoryApiService} from "../inventory-api.service";
import {ItemSales, StockValuation, Warehouse} from "../inventory.models";

type Report = 'sales' | 'purchases' | 'valuation';

/**
 * Inventory reports: sales by item (quantity, revenue, cost of goods sold, margin), purchases by item, and stock
 * valuation as of a date checked against the inventory accounts' ledger balance. Every report exports to CSV.
 */
@Component({standalone: false, templateUrl: './templates/inventory-reports.html'})
export class FinanceInventoryReportsView implements OnInit {
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate!: TemplateRef<any>;
    @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
    private readonly destroyRef = inject(DestroyRef);

    report: Report = 'sales';
    from = todayIso().slice(0, 8) + '01';
    to = todayIso();
    asOf = todayIso();
    search: string | null = null;
    warehouseId: string | null = null;
    warehouses: Warehouse[] = [];

    sales: ItemSales | null = null;
    valuation: StockValuation | null = null;
    loading = false;
    error: string | null = null;

    constructor(private api: InventoryApiService, private router: Router, private route: ActivatedRoute) {}

    ngOnInit() {
        this.api.warehouses().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: w => this.warehouses = w, error: () => {}});
        this.load();
    }

    show(r: Report) { this.report = r; this.load(); }

    load() {
        this.error = null;
        this.loading = true;
        if (this.report === 'valuation') {
            this.sales = null;
            this.api.valuation(this.asOf || null, this.warehouseId).pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
                next: v => this.valuation = v, error: e => this.error = financeErrorOf(e, 'The valuation could not be loaded.')
            });
        } else {
            this.valuation = null;
            this.api.itemSales(this.from || null, this.to || null, this.report, this.search?.trim() || null)
                .pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
                    next: s => this.sales = s, error: e => this.error = financeErrorOf(e, 'The report could not be loaded.')
                });
        }
    }

    openItem(id: string) { this.router.navigate(['..', 'items'], {relativeTo: this.route, queryParams: {item: id}}); }

    exportCsv() {
        let rows: (string | number | null)[][] = [];
        let name = '';
        if (this.sales) {
            const s = this.sales;
            name = `${s.side}-by-item-${s.from}-${s.to}`;
            rows = [['Code', 'Item', 'Unit', 'Quantity', `Amount (${s.currencyCode})`, ...(s.side === 'sales' ? ['Cost', 'Margin', 'Margin %'] : []), 'Documents'],
                ...s.rows.map(r => [r.code, r.name, r.unit, r.quantity, r.amount, ...(s.side === 'sales' ? [r.cost, r.margin, r.marginPercent] : []), r.documents])];
        } else if (this.valuation) {
            const v = this.valuation;
            name = `stock-valuation-${v.asOf}`;
            rows = [['Code', 'Item', 'Unit', 'Quantity', `Value (${v.currencyCode})`], ...v.rows.map(r => [r.code, r.name, r.unit, r.quantity, r.value]),
                [], ['', 'Stock value', '', '', v.stockValue], ['', 'Inventory accounts (ledger)', '', '', v.ledgerBalance], ['', 'Difference', '', '', v.difference]];
        }
        if (!rows.length) { return; }
        const csv = rows.map(r => r.map(c => { const s = String(c ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }).join(',')).join('\n');
        const url = URL.createObjectURL(new Blob([csv], {type: 'text/csv;charset=utf-8'}));
        const a = document.createElement('a');
        a.href = url; a.download = `${name}.csv`; a.click();
        URL.revokeObjectURL(url);
    }
}
