import {CoreResource, CoreSerializer} from "@app-global";
import {LicenseStatus, SUBSCRIPTION_BILLING_CURRENCY, paymentModeName} from "./subscription.models";

/** Grid rows are read-only views of the API payload, so rows are built straight from the JSON. */
const readOnlySerializer = <T extends CoreResource>(Row: new (json: any) => T): CoreSerializer => ({
    fromJson: (json: any) => new Row(json),
    toJson: () => { throw new Error('Subscription grids are read-only.'); }
});

/** Row of `GET v1/subscription/history`. */
export class LicenseHistoryRow extends CoreResource {
    declare licenseId: number;
    declare licenseNo: string | null;
    declare eventType: string;
    declare previousStatus: LicenseStatus;
    declare currentStatus: LicenseStatus;
    declare previousPlanName: string | null;
    declare currentPlanName: string | null;
    declare currentValidFrom: string | null;
    declare currentValidTo: string | null;
    declare isSystemGenerated: boolean;
    declare remark: string | null;
    declare occurredAt: string;

    constructor(json: any = {}) {
        super();
        Object.assign(this, json);
    }

    /** "PlanChanged" -> "Plan Changed" */
    get eventLabel(): string { return (this.eventType || '').replace(/([a-z])([A-Z])/g, '$1 $2'); }

    get planLabel(): string {
        const {previousPlanName: from, currentPlanName: to} = this;
        return from && to && from !== to ? `${from} → ${to}` : (to || from || '--');
    }

    get statusLabel(): string {
        return this.previousStatus !== this.currentStatus ? `${this.previousStatus} → ${this.currentStatus}` : this.currentStatus;
    }
}

/** Row of `GET v1/subscription/invoices`. */
export class SoftwareInvoiceRow extends CoreResource {
    declare voucherNo: string;
    declare voucherDate: string;
    declare licenseNo: string | null;
    declare planName: string | null;
    declare description: string | null;
    declare netAmount: number;
    declare paidAmount: number;
    declare paymentMode: string | null;
    declare paymentReferenceNumber: string | null;

    constructor(json: any = {}) {
        super();
        Object.assign(this, json);
    }

    get paymentModeLabel(): string { return paymentModeName(this.paymentMode); }

    /** Read by the shared currency cell through `currencyCodeField`. */
    get currencyCode(): string { return SUBSCRIPTION_BILLING_CURRENCY; }
}

export const LICENSE_HISTORY_SERIALIZER = readOnlySerializer(LicenseHistoryRow);
export const SOFTWARE_INVOICE_SERIALIZER = readOnlySerializer(SoftwareInvoiceRow);
