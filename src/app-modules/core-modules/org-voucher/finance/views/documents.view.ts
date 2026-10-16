import {Component, DestroyRef, OnInit, inject} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {AlertService, DateFormatCell, MessageSeverity, ViewExtender} from "@app-global";
import {FinanceDoc, FinanceDocQueryOptions, FinanceDocRow, FinanceKind, FinanceKindSummary, KINDS, KindInfo} from "../domains/finance.models";
import {FinanceApiService, FinanceDocGridService, FinanceGridEvents, financeErrorOf} from "../services/finance-api.service";
import {DocAmountCell, DocNumberCell, DocPartyCell, DocStatusCell} from "../grid-cells/finance-cells";

/**
 * Documents of one kind (route data `kind`): totals at the top, quick filters, the grid, and side panels to read,
 * create or edit a document. `?doc=<id>` opens one; `?new=1` starts a new one.
 */
@Component({standalone: false, templateUrl: './templates/documents.html'})
export class FinanceDocumentsView extends ViewExtender<FinanceDocRow> implements OnInit {
    override coreState = new FinanceDocQueryOptions();
    private readonly destroyRef = inject(DestroyRef);
    kind!: FinanceKind;
    info!: KindInfo;
    summary: FinanceKindSummary | null = null;
    detail: FinanceDoc | null = null;
    editing: {doc: FinanceDoc | null} | null = null;
    loadingDoc = false;
    quickFilters: {key: string | null; label: string}[] = [];

    constructor(public override service: FinanceDocGridService, public override activatedRoute: ActivatedRoute, private router: Router,
                private api: FinanceApiService, private events: FinanceGridEvents, private alerts: AlertService) {
        super(activatedRoute, service);
        this.gridOptions.header = {...this.gridOptions.header, add: false, edit: false, delete: false};
    }

    get errorText() { return this.errorMsg ? financeErrorOf(this.errorMsg, 'The list could not be loaded.') : null; }

    ngOnInit() {
        this.activatedRoute.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => this.setKind(data['kind'] as FinanceKind));
        this.activatedRoute.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(q => {
            const id = q.get('doc');
            if (id && id !== this.detail?.id) { this.openDoc(id); }
            if (q.get('new') === '1' && !this.editing) { this.editing = {doc: null}; }
        });
        this.events.actions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(a => {
            if (a.action === 'open') { this.openDoc(a.row.id); }
            if (a.action === 'post') { this.quickPost(a.row); }
            if (a.action === 'pay') { this.openDoc(a.row.id); }
        });
    }

    private setKind(kind: FinanceKind) {
        this.kind = kind;
        this.info = KINDS[kind];
        this.coreState = Object.assign(new FinanceDocQueryOptions(), {kind, take: 25});
        const settleable = kind === 'Invoice' || kind === 'Bill';
        this.quickFilters = settleable
            ? [{key: null, label: 'All'}, {key: 'unpaid', label: 'Unpaid'}, {key: 'overdue', label: 'Overdue'}, {key: 'draft', label: 'Drafts'},
               {key: 'awaiting_approval', label: 'To approve'}, {key: 'paid', label: 'Paid'}, {key: 'void', label: 'Void'}]
            : [{key: null, label: 'All'}, {key: 'posted', label: 'Posted'}, {key: 'draft', label: 'Drafts'}, {key: 'void', label: 'Void'}];
        const party = this.info.party === 'customer' ? 'Customer' : this.info.party === 'vendor' ? 'Vendor' : this.info.party === 'account' ? 'From' : 'Narration';
        this.gridOptions.columnDefs = [
            {headerName: 'Number', field: 'number', cellTemplate: DocNumberCell},
            {headerName: 'Date', field: 'date', cellTemplate: DateFormatCell},
            ...(settleable ? [{headerName: 'Due', field: 'dueDate', cellTemplate: DateFormatCell}] : []),
            {headerName: party, field: 'partyName', cellTemplate: DocPartyCell},
            {headerName: 'Amount', field: 'total', cellTemplate: DocAmountCell, class: 'text-right'},
            {headerName: 'State', field: 'status', cellTemplate: DocStatusCell}
        ];
        this.detail = null;
        this.editing = null;
        this.loadSummary();
        this.populateGrid();
    }

    loadSummary() {
        this.api.summary(this.kind).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: s => this.summary = s, error: () => this.summary = null});
    }

    quick(status: string | null) {
        this.coreState.status = status;
        this.applyFilter();
    }

    applyFilter() {
        this.coreState.skip = 0;
        this.coreState.page = 1;
        this.populateGrid();
    }

    actionCb(row: FinanceDocRow) { this.openDoc(row.id); }

    openDoc(id: string) {
        this.loadingDoc = true;
        this.api.document(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => {
                this.loadingDoc = false;
                // A linked document of another kind opens on its own page.
                if (d.kind !== this.kind) { this.navigateToKind(d.kind, d.id); return; }
                this.detail = d;
                this.setQuery({doc: d.id, new: null});
            },
            error: e => { this.loadingDoc = false; this.alerts.showMessage('Not found', financeErrorOf(e, 'The document could not be opened.'), MessageSeverity.error); }
        });
    }

    closeDetail() { this.detail = null; this.setQuery({doc: null}); }

    newDoc() { this.detail = null; this.editing = {doc: null}; }

    editDoc(doc: FinanceDoc) { this.detail = null; this.editing = {doc}; }

    onSaved(result: {doc: FinanceDoc; post: boolean}) {
        this.editing = null;
        this.setQuery({new: null});
        if (result.post) {
            this.api.post(result.doc.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                next: r => { this.alerts.showMessage('Done', r.message, MessageSeverity.success); this.detail = r.document; this.afterChange(); },
                error: e => {
                    this.alerts.showMessage('Saved as draft', financeErrorOf(e, 'It was saved but could not be posted.'), MessageSeverity.warn);
                    this.detail = result.doc;
                    this.afterChange();
                }
            });
        } else {
            this.alerts.showMessage('Saved', 'Draft saved.', MessageSeverity.success);
            this.detail = result.doc;
            this.afterChange();
        }
    }

    onChanged(doc: FinanceDoc) {
        if (doc.kind !== this.kind) { this.navigateToKind(doc.kind, doc.id); return; }
        this.detail = doc;
        this.afterChange();
    }

    onDeleted() {
        this.detail = null;
        this.setQuery({doc: null});
        this.alerts.showMessage('Deleted', 'The draft was deleted.', MessageSeverity.success);
        this.afterChange();
    }

    private quickPost(row: FinanceDocRow) {
        this.api.post(row.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => { this.alerts.showMessage('Done', r.message, MessageSeverity.success); this.afterChange(); },
            error: e => this.alerts.showMessage('Not posted', financeErrorOf(e, 'It could not be posted.'), MessageSeverity.error)
        });
    }

    private afterChange() { this.loadSummary(); this.refreshGrid(); }

    private navigateToKind(kind: FinanceKind, id: string) {
        const path = ROUTE_OF_KIND[kind];
        this.router.navigate(['../..', ...path.split('/')], {relativeTo: this.activatedRoute, queryParams: {doc: id}});
    }

    private setQuery(params: Record<string, string | null>) {
        this.router.navigate([], {relativeTo: this.activatedRoute, queryParams: params, queryParamsHandling: 'merge', replaceUrl: true});
    }
}

/** Where each kind's list lives in the finance module (relative to its root). */
export const ROUTE_OF_KIND: Record<FinanceKind, string> = {
    Invoice: 'sales/invoices', CreditNote: 'sales/credit-notes', Receipt: 'sales/receipts',
    Bill: 'purchases/bills', DebitNote: 'purchases/debit-notes', Payment: 'purchases/payments',
    Journal: 'accounting/journals', Contra: 'accounting/transfers'
};
