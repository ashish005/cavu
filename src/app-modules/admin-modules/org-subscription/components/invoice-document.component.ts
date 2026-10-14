import {Component, ElementRef, Input, ViewEncapsulation} from "@angular/core";
import {CommonModule} from "@angular/common";
import {DateFormat, DateHourMinFormat, VoucherCurrencyPipe} from "@app-global";
import {SUBSCRIPTION_BILLING_CURRENCY, SoftwareInvoiceDetail, paymentModeName} from "../domains/subscription.models";

/**
 * Scoped under `.sub-invoice` and not encapsulated, so the same rules apply when the rendered
 * invoice is copied into the print frame.
 */
export const INVOICE_STYLES = `
.sub-invoice { font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif; color: #222; font-size: 13px; background: #fff; padding: 24px; }
.sub-invoice h2 { margin: 0 0 4px; font-size: 20px; }
.sub-invoice .muted { color: #6c757d; }
.sub-invoice .head { display: flex; justify-content: space-between; gap: 24px; margin-bottom: 24px; }
.sub-invoice .head .right { text-align: right; }
.sub-invoice .parties { display: flex; gap: 24px; margin-bottom: 24px; }
.sub-invoice .parties > div { flex: 1; }
.sub-invoice .label { font-size: 11px; text-transform: uppercase; letter-spacing: .04em; color: #6c757d; margin-bottom: 4px; }
.sub-invoice table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
.sub-invoice th, .sub-invoice td { padding: 6px 8px; border-bottom: 1px solid #e5e5e5; text-align: left; vertical-align: top; }
.sub-invoice th { font-size: 11px; text-transform: uppercase; color: #6c757d; }
.sub-invoice .num { text-align: right; white-space: nowrap; }
.sub-invoice .totals { margin-left: auto; width: 320px; max-width: 100%; }
.sub-invoice .totals .grand td { font-weight: 600; border-top: 2px solid #222; }
.sub-invoice .address { white-space: pre-line; }
`;

@Component({
    standalone: true,
    selector: 'subscription-invoice-document',
    imports: [CommonModule, DateFormat, DateHourMinFormat, VoucherCurrencyPipe],
    encapsulation: ViewEncapsulation.None,
    styles: [INVOICE_STYLES],
    template: `
        <div class="sub-invoice" *ngIf="invoice as inv">
            <div class="head">
                <div>
                    <h2>Invoice</h2>
                    <div class="muted">{{ inv.softwareName }}</div>
                </div>
                <div class="right">
                    <div><b>{{ inv.voucherNo }}</b></div>
                    <div class="muted">{{ inv.voucherDate | fullDateFormat }}</div>
                </div>
            </div>

            <div class="parties">
                <div>
                    <div class="label">Billed to</div>
                    <div><b>{{ inv.customerName }}</b></div>
                    <div *ngIf="inv.customerAddress" class="address">{{ inv.customerAddress }}</div>
                    <div *ngIf="inv.customerEmailId">{{ inv.customerEmailId }}</div>
                    <div *ngIf="inv.customerContactNo">{{ inv.customerContactNo }}</div>
                    <div *ngIf="inv.customerTaxNumber">Tax no.: {{ inv.customerTaxNumber }}</div>
                </div>
                <div>
                    <div class="label">License</div>
                    <div><b>{{ inv.licenseNo }}</b></div>
                    <div>{{ inv.planName }} plan</div>
                    <div *ngIf="inv.validFrom">Valid {{ inv.validFrom | dateFormat }} &ndash; {{ inv.validTo | dateFormat }}</div>
                </div>
            </div>

            <table>
                <thead><tr><th>Description</th><th class="num">Amount</th></tr></thead>
                <tbody><tr><td>{{ inv.description }}</td><td class="num">{{ inv.grossAmount | voucherCurrency : currency }}</td></tr></tbody>
            </table>

            <table class="totals">
                <tbody>
                <tr><td>Subtotal</td><td class="num">{{ inv.grossAmount | voucherCurrency : currency }}</td></tr>
                <tr *ngIf="inv.discountAmount > 0"><td>Discount</td><td class="num">- {{ inv.discountAmount | voucherCurrency : currency }}</td></tr>
                <tr><td>Taxable amount</td><td class="num">{{ inv.taxableAmount | voucherCurrency : currency }}</td></tr>
                <tr><td>Tax</td><td class="num">{{ inv.taxAmount > 0 ? (inv.taxAmount | voucherCurrency : currency) : '--' }}</td></tr>
                <tr class="grand"><td>Total</td><td class="num">{{ inv.netAmount | voucherCurrency : currency }}</td></tr>
                <tr><td>Paid</td><td class="num">{{ inv.paidAmount | voucherCurrency : currency }}</td></tr>
                </tbody>
            </table>

            <ng-container *ngIf="inv.receipts.length">
                <div class="label">Payments</div>
                <table>
                    <thead><tr><th>Receipt</th><th>Date</th><th>Mode</th><th>Reference</th><th class="num">Amount</th></tr></thead>
                    <tbody>
                    <tr *ngFor="let r of inv.receipts">
                        <td>{{ r.voucherNo }}</td>
                        <td>{{ r.paymentDate | fullDateFormat }}</td>
                        <td>{{ modeName(r.paymentMode) }}</td>
                        <td>{{ r.paymentReferenceNumber || '--' }}</td>
                        <td class="num">{{ r.amount | voucherCurrency : currency }}</td>
                    </tr>
                    </tbody>
                </table>
            </ng-container>

            <p *ngIf="inv.terms" class="muted">{{ inv.terms }}</p>
        </div>`
})
export class InvoiceDocumentComponent {
    @Input() invoice: SoftwareInvoiceDetail | null = null;

    readonly currency = SUBSCRIPTION_BILLING_CURRENCY;
    readonly modeName = paymentModeName;

    constructor(private host: ElementRef<HTMLElement>) {}

    /**
     * Prints only the invoice by copying its rendered markup into a hidden frame. The markup is Angular-rendered
     * (all values interpolated, so escaped), which is why no server HTML is ever injected.
     */
    print(title: string) {
        const source = this.host.nativeElement.querySelector('.sub-invoice');
        if (!source) { return; }

        const frame = document.createElement('iframe');
        frame.setAttribute('aria-hidden', 'true');
        frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
        document.body.appendChild(frame);

        const doc = frame.contentDocument!;
        doc.open();
        doc.write('<!doctype html><html><head><meta charset="utf-8"><title></title><style>@page{margin:12mm}</style></head><body></body></html>');
        doc.close();
        doc.title = title;
        const style = doc.createElement('style');
        style.textContent = INVOICE_STYLES;
        doc.head.appendChild(style);
        doc.body.appendChild(doc.importNode(source, true));

        const cleanup = () => setTimeout(() => frame.remove(), 0);
        frame.contentWindow!.addEventListener('afterprint', cleanup, {once: true});
        frame.contentWindow!.focus();
        frame.contentWindow!.print();
        // Browsers that print synchronously never fire afterprint on the frame.
        setTimeout(cleanup, 60_000);
    }
}
