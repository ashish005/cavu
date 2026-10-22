import {Component, DestroyRef, OnInit, inject} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {AlertService, MessageSeverity, ViewExtender} from "@app-global";
import {ExpenseApiService, ExpenseGridEvents, PaymentGridService, expenseErrorOf} from "../expense-api.service";
import {PaymentActionsCell, PaymentKindCell} from "../expense-cells";
import {EmployeeOption, ExpenseLookups, PaymentQueryOptions, PaymentRow, todayIso} from "../expense.models";

/** Reimbursements and cash advances paid to employees; finance pays advances here and voids payments made in error. */
@Component({standalone: false, templateUrl: './templates/payments.html'})
export class ExpensePaymentsView extends ViewExtender<PaymentRow> implements OnInit {
    override coreState = new PaymentQueryOptions();
    private readonly destroyRef = inject(DestroyRef);
    lookups: ExpenseLookups | null = null;
    employees: EmployeeOption[] = [];
    advance: {employeePartyId: string | null; date: string; amount: number; bankAccountId: string | null; reference: string; note: string} | null = null;
    busy = false;
    error: string | null = null;

    constructor(public override service: PaymentGridService, public override activatedRoute: ActivatedRoute, private api: ExpenseApiService,
                private events: ExpenseGridEvents, private alerts: AlertService) {
        super(activatedRoute, service);
        this.gridOptions.header = {...this.gridOptions.header, add: false, edit: false, delete: false};
        this.gridOptions.columnDefs = [
            {headerName: 'Date', field: 'date', cellTemplate: PaymentKindCell},
            {headerName: 'Employee', field: 'employeeName'},
            {headerName: 'Claim', field: 'claimNumber', cellFn: (r: PaymentRow) => r.claimNumber ?? '—'},
            {headerName: 'Amount', field: 'amount', class: 'text-right',
                cellFn: (r: PaymentRow) => `${r.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${r.currencyCode}`},
            {headerName: 'Paid from', field: 'bankAccountName', cellFn: (r: PaymentRow) => r.bankAccountName ?? (r.voucherId ? '' : 'Against advance')},
            {headerName: 'Journal', field: 'voucherNumber', cellFn: (r: PaymentRow) => r.voucherNumber ?? ''},
            {headerName: '', field: 'id', cellTemplate: PaymentActionsCell}
        ];
        this.coreState.take = 25;
    }

    get errorText() { return this.errorMsg ? expenseErrorOf(this.errorMsg, 'Payments could not be loaded.') : null; }

    ngOnInit() {
        this.api.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: l => this.lookups = l, error: () => {}});
        this.events.actions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(a => { if (a.action === 'void') { this.voidPayment(a.row); } });
        this.populateGrid();
    }

    actionCb(_: any) {}
    search() { this.coreState.skip = 0; this.populateGrid(); }

    newAdvance() {
        this.error = null;
        this.advance = {employeePartyId: null, date: todayIso(), amount: 0, bankAccountId: this.lookups?.policy.reimbursementBankAccountId ?? null, reference: '', note: ''};
        if (!this.employees.length) {
            this.api.employees(null).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: e => this.employees = e, error: () => {}});
        }
    }

    payAdvance() {
        const a = this.advance;
        if (!a) { return; }
        if (!a.employeePartyId) { this.error = 'Choose the employee.'; return; }
        if (!(+a.amount > 0)) { this.error = 'Enter the amount.'; return; }
        if (!a.bankAccountId) { this.error = 'Choose the account it is paid from.'; return; }
        this.busy = true;
        this.api.advance({employeePartyId: a.employeePartyId, date: a.date || null, amount: +a.amount, bankAccountId: a.bankAccountId,
            reference: a.reference.trim() || null, note: a.note.trim() || null})
            .pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
                next: p => { this.advance = null; this.alerts.showMessage('Expenses', `Advance paid (${p.voucherNumber}).`, MessageSeverity.success); this.refreshGrid(); },
                error: e => this.error = expenseErrorOf(e, 'The advance could not be paid.')
            });
    }

    voidPayment(p: PaymentRow) {
        const reason = prompt(`Void this ${p.kind === 'Advance' ? 'advance' : 'reimbursement'} of ${p.amount} ${p.currencyCode}? Give a reason:`);
        if (!reason || reason.trim().length < 3) { return; }
        this.api.voidPayment(p.id, reason.trim()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => { this.alerts.showMessage('Expenses', 'Payment voided; its journal was reversed.', MessageSeverity.success); this.refreshGrid(); },
            error: e => this.alerts.showMessage('Expenses', expenseErrorOf(e, 'The payment could not be voided.'), MessageSeverity.error)
        });
    }
}
