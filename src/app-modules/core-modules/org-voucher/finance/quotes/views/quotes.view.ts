import {Component, DestroyRef, OnInit, inject} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {AlertService, DateFormatCell, MessageSeverity, ViewExtender} from "@app-global";
import {FinanceGridEvents, financeErrorOf} from "../../services/finance-api.service";
import {formatMoney} from "../../grid-cells/finance-cells";
import {ROUTE_OF_KIND} from "../../views/documents.view";
import {QuoteApiService, QuoteGridService} from "../quote-api.service";
import {QuoteNumberCell, QuoteStatusCell} from "../quote-cells";
import {Quote, QuoteLookups, QuoteQueryOptions, QuoteRow, QuoteSummary} from "../quote.models";

/**
 * Sales quotes of the branch: the pipeline at a glance, filters (open, expiring, follow-ups due…), the list, and a
 * quote's detail (send, record the customer's answer, convert to an invoice) or editor in a side panel.
 * Deep links `?quote=<id>`, `?new=1`.
 */
@Component({standalone: false, templateUrl: './templates/quotes.html'})
export class FinanceQuotesView extends ViewExtender<QuoteRow> implements OnInit {
    override coreState = new QuoteQueryOptions();
    private readonly destroyRef = inject(DestroyRef);
    readonly filters: {key: string | null; label: string}[] = [
        {key: null, label: 'All'}, {key: 'open', label: 'Open'}, {key: 'draft', label: 'Drafts'}, {key: 'pending_approval', label: 'To approve'},
        {key: 'expiring', label: 'Expiring soon'}, {key: 'follow_up', label: 'Follow-up due'}, {key: 'accepted', label: 'Accepted'}, {key: 'invoiced', label: 'Invoiced'},
        {key: 'declined', label: 'Declined'}, {key: 'expired', label: 'Expired'}
    ];
    lookups: QuoteLookups | null = null;
    summary: QuoteSummary | null = null;
    quote: Quote | null = null;
    editing: {quote: Quote | null} | null = null;

    constructor(public override service: QuoteGridService, public override activatedRoute: ActivatedRoute, private api: QuoteApiService,
                private events: FinanceGridEvents, private alerts: AlertService, private router: Router) {
        super(activatedRoute, service);
        this.gridOptions.header = {...this.gridOptions.header, add: false, edit: false, delete: false};
        this.gridOptions.columnDefs = [
            {headerName: 'Quote', field: 'number', cellTemplate: QuoteNumberCell},
            {headerName: 'Customer', field: 'customerName'},
            {headerName: 'Date', field: 'issueDate', cellTemplate: DateFormatCell},
            {headerName: 'Valid until', field: 'validUntil', cellTemplate: DateFormatCell},
            {headerName: 'Total', field: 'total', class: 'text-right', cellFn: (r: QuoteRow) => formatMoney(r.total, r.currencyCode)},
            {headerName: 'Margin', field: 'marginPercent', class: 'text-right', cellFn: (r: QuoteRow) => r.marginPercent === null ? '' : `${r.marginPercent}%`},
            {headerName: 'Owner', field: 'ownerName', cellFn: (r: QuoteRow) => r.ownerName ?? ''},
            {headerName: 'Status', field: 'status', cellTemplate: QuoteStatusCell}
        ];
        this.coreState.take = 25;
    }

    get errorText() { return this.errorMsg ? financeErrorOf(this.errorMsg, 'Quotes could not be loaded.') : null; }

    ngOnInit() {
        this.api.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: l => this.lookups = l,
            error: e => this.alerts.showMessage('Quotes', financeErrorOf(e, 'Quotes could not be loaded.'), MessageSeverity.error)
        });
        this.loadSummary();
        this.events.actions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(a => { if (a.action === 'quote') { this.openRow(a.row.id); } });
        this.activatedRoute.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(q => {
            const id = q.get('quote');
            if (id && id !== this.quote?.id) { this.open(id); }
            if (q.get('new') === '1' && !this.editing) { this.quote = null; this.editing = {quote: null}; }
        });
        this.populateGrid();
    }

    loadSummary() { this.api.summary().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: s => this.summary = s, error: () => {}}); }
    setFilter(key: string | null) { this.coreState.status = key; this.coreState.skip = 0; this.coreState.page = 1; this.populateGrid(); }
    search() { this.coreState.skip = 0; this.populateGrid(); }
    actionCb(_: any) {}

    openRow(id: string) { this.router.navigate([], {relativeTo: this.activatedRoute, queryParams: {quote: id, new: null}, queryParamsHandling: 'merge'}); }

    open(id: string) {
        this.api.quote(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: q => { this.quote = q; this.editing = null; },
            error: e => this.alerts.showMessage('Quotes', financeErrorOf(e, 'The quote could not be opened.'), MessageSeverity.error)
        });
    }

    newQuote() { this.quote = null; this.editing = {quote: null}; }

    closePanels() {
        this.quote = null;
        this.editing = null;
        this.router.navigate([], {relativeTo: this.activatedRoute, queryParams: {quote: null, new: null}, queryParamsHandling: 'merge', replaceUrl: true});
    }

    closeEditor() { if (this.editing?.quote) { this.quote = this.editing.quote; this.editing = null; } else { this.closePanels(); } }

    saved(q: Quote) {
        this.editing = null;
        this.quote = q;
        this.refreshGrid();
        this.loadSummary();
        this.router.navigate([], {relativeTo: this.activatedRoute, queryParams: {quote: q.id, new: null}, queryParamsHandling: 'merge', replaceUrl: true});
    }

    changed(q: Quote | null) {
        this.quote = q;
        if (!q) { this.closePanels(); }
        this.refreshGrid();
        this.loadSummary();
    }

    /** Opens the invoice made from a quote in the invoices list. */
    openInvoice(id: string) { this.router.navigate(ROUTE_OF_KIND.Invoice.split('/'), {relativeTo: this.activatedRoute.parent, queryParams: {doc: id}}); }
}
