import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {InvoiceByVendor, InvoiceByVendorSerializer} from "../domains/invoice-by-vendor.serializer";
import {InvoiceByProduct, InvoiceByProductSerializer} from "../domains/invoice-by-product.serializer";
import {InvoiceByPayment, InvoiceByPaymentSerializer} from "../domains/invoice-by-payment.serializer";
import {InvoiceByExecutive, InvoiceByExecutiveSerializer} from "../domains/invoice-by-executive.serializer";
import {InvoiceByDay, InvoiceByDaySerializer} from "../domains/invoice-by-day.serializer";

@Injectable()
export class InvoiceByVendorService extends OrgResourceService<InvoiceByVendor>{
    constructor(public override injector: Injector) { super(injector, 'invoiceByVendor', new InvoiceByVendorSerializer()); }
}

@Injectable()
export class InvoiceByProductService extends OrgResourceService<InvoiceByProduct>{
    constructor(public override injector: Injector) { super(injector, 'invoiceByProduct', new InvoiceByProductSerializer()); }
}

@Injectable()
export class InvoiceByPaymentService extends OrgResourceService<InvoiceByPayment>{
    constructor(public override injector: Injector) { super(injector, 'invoiceByPayment', new InvoiceByPaymentSerializer()); }
}

@Injectable()
export class InvoiceByExecutiveService extends OrgResourceService<InvoiceByExecutive>{
    constructor(public override injector: Injector) { super(injector, 'invoiceByExecutive', new InvoiceByExecutiveSerializer()); }
}

@Injectable()
export class InvoiceByDayService extends OrgResourceService<InvoiceByDay>{
    constructor(public override injector: Injector) { super(injector, 'invoiceByDay', new InvoiceByDaySerializer()); }
}
