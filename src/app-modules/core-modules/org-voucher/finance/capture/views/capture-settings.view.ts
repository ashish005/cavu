import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Observable, finalize, forkJoin, map} from "rxjs";
import {AlertService, MessageSeverity} from "@app-global";
import {AccountOption, ModeOption} from "../../domains/finance.models";
import {FinanceApiService, financeErrorOf} from "../../services/finance-api.service";
import {PickerOption} from "../../views/finance-picker.component";
import {CaptureApiService} from "../capture-api.service";
import {CAPTURE_PURPOSE_LABEL, CapturePurpose, CaptureSettings} from "../capture.models";

/**
 * Document capture settings: which reader is used (automatic, invoice/receipt analysis, any form layout, or typing in),
 * what uploads become by default, the defaults filled in, and whether confident reads become drafts on their own.
 */
@Component({standalone: false, templateUrl: './templates/capture-settings.html'})
export class FinanceCaptureSettingsView implements OnInit {
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate!: TemplateRef<any>;
    @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
    private readonly destroyRef = inject(DestroyRef);
    readonly purposeLabel = CAPTURE_PURPOSE_LABEL;
    readonly purposes = Object.keys(CAPTURE_PURPOSE_LABEL) as CapturePurpose[];
    model: CaptureSettings | null = null;
    expenseLabel: string | null = null;
    moneyAccounts: AccountOption[] = [];
    modes: ModeOption[] = [];
    currency = 'USD';
    saving = false;
    error: string | null = null;

    constructor(private api: CaptureApiService, private finance: FinanceApiService, private alerts: AlertService) {}

    ngOnInit() {
        forkJoin({s: this.api.settings(), l: this.finance.lookups()}).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: ({s, l}) => {
                this.model = s;
                this.moneyAccounts = l.bankAccounts;
                this.modes = l.paymentModes;
                this.currency = l.functionalCurrency;
                if (s.defaultExpenseAccountId) {
                    this.finance.accountOptions('expense', null).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                        next: list => this.expenseLabel = list.find(a => a.id === s.defaultExpenseAccountId)?.name ?? 'Selected account', error: () => {}
                    });
                }
            },
            error: e => this.error = financeErrorOf(e, 'Settings could not be loaded.')
        });
    }

    get simulated() { return this.model?.providers.some(p => p.simulated) ?? false; }

    searchAccounts = (term: string | null): Observable<PickerOption[]> =>
        this.finance.accountOptions('expense', term).pipe(map((list: AccountOption[]) => list.map(a => ({id: a.id, label: a.name, sub: [a.code, a.group].filter(Boolean).join(' · ')}))));

    clearExpense() { if (this.model) { this.model.defaultExpenseAccountId = null; this.expenseLabel = null; } }

    save() {
        const m = this.model;
        if (!m) { return; }
        this.error = null;
        this.saving = true;
        this.api.saveSettings({...m, confidenceThreshold: +m.confidenceThreshold || 0, roundingTolerance: +m.roundingTolerance || 0})
            .pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
                next: s => { this.model = s; this.alerts.showMessage('Saved', 'Document capture settings saved.', MessageSeverity.success); },
                error: e => this.error = financeErrorOf(e, 'Settings could not be saved.')
            });
    }
}
