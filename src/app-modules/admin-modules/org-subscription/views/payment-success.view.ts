import {Component, TemplateRef, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {SUBSCRIPTION_BILLING_CURRENCY, SubscriptionPurchaseResult} from "../domains/subscription.models";
import {PURCHASE_RESULT_STATE_KEY} from "./payment.view";
import {SharedService} from "@app-global";
import {openInvoicePopup} from "../components/software-invoice-print.view";

@Component({
    standalone: false,
    templateUrl: './templates/payment-success.html'
})
export class PaymentSuccessView {
    @ViewChild('pageTitleTemplate', {static: true}) public pageTitleTemplate: TemplateRef<any>;

    readonly currency = SUBSCRIPTION_BILLING_CURRENCY;

    /** Only present when arriving from a purchase; a reload or deep link shows the generic message. */
    readonly result: SubscriptionPurchaseResult | null;

    constructor(router: Router, private sharedService: SharedService) {
        const state = router.getCurrentNavigation()?.extras.state ?? history.state;
        this.result = state?.[PURCHASE_RESULT_STATE_KEY] ?? null;
    }

    viewInvoice() {
        if (this.result) {
            openInvoicePopup(this.sharedService, this.result.invoiceId, this.result.voucherNo);
        }
    }
}
