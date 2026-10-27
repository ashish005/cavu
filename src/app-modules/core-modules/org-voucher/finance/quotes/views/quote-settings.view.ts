import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {AlertService, MessageSeverity} from "@app-global";
import {financeErrorOf} from "../../services/finance-api.service";
import {QuoteApiService} from "../quote-api.service";
import {QuoteLookups, QuoteSettings} from "../quote.models";

/**
 * Quote numbering and validity; the approval flow — steps in order, each with its conditions (total, margin, discount
 * or always) and the role that approves it; pricing (default markup on vendor costs, standard service and handling
 * charges); default notes and terms.
 */
@Component({standalone: false, templateUrl: './templates/quote-settings.html'})
export class FinanceQuoteSettingsView implements OnInit {
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate!: TemplateRef<any>;
    @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
    private readonly destroyRef = inject(DestroyRef);
    model: QuoteSettings | null = null;
    currency = '';
    lookups: QuoteLookups | null = null;
    saving = false;
    error: string | null = null;

    constructor(private api: QuoteApiService, private alerts: AlertService) {}

    ngOnInit() {
        this.api.settings().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: s => this.model = {...s, approvalSteps: s.approvalSteps ?? [], standardCharges: s.standardCharges ?? []},
            error: e => this.error = financeErrorOf(e, 'Settings could not be loaded.')
        });
        this.api.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: l => { this.lookups = l; this.currency = l.functionalCurrency; }, error: () => {}});
    }

    get salesTaxes() { return (this.lookups?.taxCodes ?? []).filter(t => t.scope !== 'Purchases'); }

    addStep() {
        const m = this.model!;
        // The first step takes over the single-step limits so nothing is lost.
        if (!m.approvalSteps.length && (m.approvalAmount !== null || m.maxDiscountWithoutApproval !== null || m.minMarginPercent !== null)) {
            m.approvalSteps.push({name: 'Manager approval', totalAtLeast: m.approvalAmount, discountAbove: m.maxDiscountWithoutApproval, marginBelow: m.minMarginPercent,
                always: false, approverRoleId: null});
        } else {
            m.approvalSteps.push({name: m.approvalSteps.length ? 'Director approval' : 'Manager approval', totalAtLeast: null, discountAbove: null, marginBelow: null,
                always: !m.approvalSteps.length, approverRoleId: null});
        }
    }
    moveStep(i: number, by: -1 | 1) {
        const list = this.model!.approvalSteps, j = i + by;
        if (j < 0 || j >= list.length) { return; }
        [list[i], list[j]] = [list[j], list[i]];
    }
    addCharge() { this.model!.standardCharges.push({type: 'handling', label: 'Handling charge', basis: 'percent_cost', rate: 5, taxCodeId: null}); }

    save() {
        const m = this.model;
        if (!m) { return; }
        const num = (v: any) => v === null || v === '' || v === undefined ? null : +v;
        const steps = m.approvalSteps.map(st => ({...st, name: (st.name ?? '').trim(), totalAtLeast: num(st.totalAtLeast), marginBelow: num(st.marginBelow),
            discountAbove: num(st.discountAbove)}));
        const empty = steps.find(st => !st.name || (!st.always && st.totalAtLeast === null && st.marginBelow === null && st.discountAbove === null));
        if (empty) { this.error = empty.name ? `Give "${empty.name}" a condition, or tick "Every quote".` : 'Name every approval step.'; return; }
        const charges = m.standardCharges.map(c => ({...c, label: (c.label ?? '').trim(), rate: +c.rate || 0}));
        if (charges.some(c => !c.label)) { this.error = 'Name every standard charge.'; return; }
        this.saving = true;
        this.error = null;
        this.api.saveSettings({...m, quotePrefix: (m.quotePrefix ?? '').trim().toUpperCase(), defaultValidityDays: +m.defaultValidityDays || 30,
            expiryWarningDays: +m.expiryWarningDays || 7, approvalAmount: num(m.approvalAmount), maxDiscountWithoutApproval: num(m.maxDiscountWithoutApproval),
            minMarginPercent: num(m.minMarginPercent), approvalSteps: steps, standardCharges: charges, defaultMarkupPercent: num(m.defaultMarkupPercent)})
            .pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
                next: s => { this.model = s; this.api.lookups(true); this.alerts.showMessage('Saved', 'Quote settings saved.', MessageSeverity.success); },
                error: e => this.error = financeErrorOf(e, 'Settings could not be saved.')
            });
    }
}
