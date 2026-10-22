import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {AlertService, MessageSeverity} from "@app-global";
import {financeErrorOf} from "../../services/finance-api.service";
import {QuoteApiService} from "../quote-api.service";
import {QuoteSettings} from "../quote.models";

/** Quote numbering, validity, when a quote needs approval (amount, discount, margin), default notes and terms. */
@Component({standalone: false, templateUrl: './templates/quote-settings.html'})
export class FinanceQuoteSettingsView implements OnInit {
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate!: TemplateRef<any>;
    @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
    private readonly destroyRef = inject(DestroyRef);
    model: QuoteSettings | null = null;
    currency = '';
    saving = false;
    error: string | null = null;

    constructor(private api: QuoteApiService, private alerts: AlertService) {}

    ngOnInit() {
        this.api.settings().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: s => this.model = s,
            error: e => this.error = financeErrorOf(e, 'Settings could not be loaded.')
        });
        this.api.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: l => this.currency = l.functionalCurrency, error: () => {}});
    }

    save() {
        const m = this.model;
        if (!m) { return; }
        const num = (v: any) => v === null || v === '' || v === undefined ? null : +v;
        this.saving = true;
        this.error = null;
        this.api.saveSettings({...m, quotePrefix: (m.quotePrefix ?? '').trim().toUpperCase(), defaultValidityDays: +m.defaultValidityDays || 30,
            expiryWarningDays: +m.expiryWarningDays || 7, approvalAmount: num(m.approvalAmount), maxDiscountWithoutApproval: num(m.maxDiscountWithoutApproval),
            minMarginPercent: num(m.minMarginPercent)})
            .pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
                next: s => { this.model = s; this.api.lookups(true); this.alerts.showMessage('Saved', 'Quote settings saved.', MessageSeverity.success); },
                error: e => this.error = financeErrorOf(e, 'Settings could not be saved.')
            });
    }
}
