import {Injectable, Injector} from "@angular/core";
import {OrgResourceService} from "@app-global";
import {
    LICENSE_HISTORY_SERIALIZER, LicenseHistoryRow, SOFTWARE_INVOICE_SERIALIZER, SoftwareInvoiceRow
} from "../domains/grid-row.serializers";

/** Paged `GET {tenant}/api/v1/subscription/history`, used by ViewExtender grids. */
@Injectable()
export class LicenseHistoryService extends OrgResourceService<LicenseHistoryRow> {
    constructor(public override injector: Injector) { super(injector, 'v1/subscription/history', LICENSE_HISTORY_SERIALIZER); }
}

/** Paged `GET {tenant}/api/v1/subscription/invoices`, used by ViewExtender grids. */
@Injectable()
export class SoftwareInvoiceService extends OrgResourceService<SoftwareInvoiceRow> {
    constructor(public override injector: Injector) { super(injector, 'v1/subscription/invoices', SOFTWARE_INVOICE_SERIALIZER); }
}
