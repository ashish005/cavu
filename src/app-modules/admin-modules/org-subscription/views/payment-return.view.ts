import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ActivatedRoute} from "@angular/router";
import {Subscription, timer} from "rxjs";
import {SharedService} from "@app-global";
import {Checkout} from "../domains/subscription.models";
import {SubscriptionService, errorMessageOf} from "../services";
import {openInvoicePopup} from "../components/software-invoice-print.view";

/** How long to keep checking before telling the user the confirmation is taking longer than usual. */
const POLL_INTERVAL_MS = 3000;
const POLL_LIMIT = 40;

/**
 * Where the payment gateway sends the browser back (?checkout={id}, plus &canceled=1 from Stripe's cancel link).
 * The server confirms with the gateway on each check, so this page does not depend on the webhook arriving first.
 */
@Component({
    standalone: false,
    templateUrl: './templates/payment-return.html'
})
export class PaymentReturnView implements OnInit {
    @ViewChild('pageTitleTemplate', {static: true}) public pageTitleTemplate: TemplateRef<any>;

    private readonly destroyRef = inject(DestroyRef);
    private polling: Subscription | null = null;
    private attempts = 0;

    checkout: Checkout | null = null;
    canceledByUser = false;
    slow = false;
    error: string | null = null;

    constructor(private route: ActivatedRoute,
                private service: SubscriptionService,
                private sharedService: SharedService) {}

    get checkoutId(): string | null { return this.route.snapshot.queryParamMap.get('checkout'); }
    get isWaiting(): boolean { return !this.checkout || this.checkout.status === 'Pending' || this.checkout.status === 'Created'; }

    ngOnInit() {
        this.canceledByUser = this.route.snapshot.queryParamMap.get('canceled') === '1';
        if (!this.checkoutId) {
            this.error = 'This link is missing the payment reference.';
            return;
        }
        this.startPolling();
    }

    startPolling() {
        this.polling?.unsubscribe();
        this.attempts = 0;
        this.slow = false;
        this.error = null;

        this.polling = timer(0, POLL_INTERVAL_MS)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.check());
    }

    /** Continue paying on the same hosted page (e.g. after pressing back on the gateway). */
    resumePayment() {
        if (this.checkout?.checkoutUrl) {
            window.location.assign(this.checkout.checkoutUrl);
        }
    }

    /** A full reload so the portal picks up the new license (routes and menus depend on it). */
    continueToApp() {
        window.location.assign('/app/admin/subscription/info');
    }

    viewInvoice() {
        if (this.checkout?.invoiceId && this.checkout.voucherNo) {
            openInvoicePopup(this.sharedService, this.checkout.invoiceId, this.checkout.voucherNo);
        }
    }

    private check() {
        this.attempts++;
        this.service.getCheckout(this.checkoutId!)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: checkout => {
                    this.checkout = checkout;
                    // A user who left the gateway page is not kept waiting; they can resume or choose again.
                    const stop = !this.isWaiting || this.canceledByUser || this.attempts >= POLL_LIMIT;
                    this.slow = this.isWaiting && this.attempts >= POLL_LIMIT;
                    if (stop) {
                        this.polling?.unsubscribe();
                    }
                },
                error: err => {
                    this.error = errorMessageOf(err, 'Could not check the payment. Please try again.');
                    this.polling?.unsubscribe();
                }
            });
    }
}
