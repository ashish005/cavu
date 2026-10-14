import {Component, DestroyRef, Input, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {CommonModule} from "@angular/common";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {ASIDE_CLASS, ASIDE_SIZE, LoaderComponent, SharedService} from "@app-global";
import {SoftwareInvoiceDetail} from "../domains/subscription.models";
import {SubscriptionService} from "../services/subscription.service";
import {errorMessageOf} from "../services/api-response";
import {InvoiceDocumentComponent} from "./invoice-document.component";

export interface InvoicePopupInput {
    invoiceId: number;
    voucherNo: string;
}

/**
 * Invoice popup content. The popup service creates it from the root injector, so it is standalone
 * and provides its own SubscriptionService instead of relying on the lazy module's providers.
 */
@Component({
    standalone: true,
    imports: [CommonModule, LoaderComponent, InvoiceDocumentComponent],
    providers: [SubscriptionService],
    styles: [`:host { display: contents; }`],
    template: `
        <div class="d-flex flex-column flex">
            <loader [isLoading]="isLoading"></loader>
            <div *ngIf="errorMessage" class="alert alert-danger d-flex align-items-center m-3">
                <span class="flex">{{ errorMessage }}</span>
                <button class="btn btn-sm white" (click)="load()">Retry</button>
            </div>
            <div class="scrollable box-shadow-6 m-3">
                <subscription-invoice-document #doc [invoice]="invoice"></subscription-invoice-document>
            </div>
        </div>
        <ng-template #footerTemplate>
            <ul class="nav nav-xs flex-row no-border float-right">
                <li class="nav-item mx-2">
                    <button class="btn btn-sm theme" [disabled]="!invoice" (click)="doc.print(data?.voucherNo || 'Invoice')">
                        <i class="fa fa-print mr-1"></i> Print / Save as PDF
                    </button>
                </li>
            </ul>
        </ng-template>`
})
export class SoftwareInvoicePrintView implements OnInit {
    @ViewChild('footerTemplate', {static: true}) public footerTemplate: TemplateRef<any>;
    @ViewChild('doc', {static: true}) public doc: InvoiceDocumentComponent;

    private readonly destroyRef = inject(DestroyRef);

    /** Assigned by the popup service from the `data` key of the popup input. */
    @Input() data: InvoicePopupInput | null = null;

    invoice: SoftwareInvoiceDetail | null = null;
    isLoading = false;
    errorMessage: string | null = null;

    constructor(private service: SubscriptionService) {}

    ngOnInit() { this.load(); }

    load() {
        if (!this.data?.invoiceId) {
            this.errorMessage = 'No invoice was selected.';
            return;
        }
        this.isLoading = true;
        this.errorMessage = null;
        this.service.getInvoice(this.data.invoiceId)
            .pipe(finalize(() => this.isLoading = false), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: invoice => this.invoice = invoice,
                error: err => this.errorMessage = errorMessageOf(err, 'Could not load the invoice.')
            });
    }
}

/** Opens an invoice in the right-hand aside. Used by the invoice grid and the payment success page. */
export function openInvoicePopup(sharedService: SharedService, invoiceId: number, voucherNo: string): void {
    const close = () => sharedService.destroy();
    sharedService.showCustomPopup(
        SoftwareInvoicePrintView,
        {header: {text: `Invoice ${voucherNo}`, desc: ''}, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_75},
        {data: {invoiceId, voucherNo} as InvoicePopupInput}
    ).then(close, close);
}
