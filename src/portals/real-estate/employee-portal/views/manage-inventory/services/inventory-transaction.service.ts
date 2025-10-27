import {Injectable, Injector} from "@angular/core";
import {
    PurchaseOrder, PurchaseOrderSerializer,
    SaleOrder, SaleOrderSerializer
} from "../domains/inventory-transaction.serializer";
import  { OrgResourceService } from "@app-global";


@Injectable({ providedIn: 'root'})
export class PurchaseOrderService extends OrgResourceService<PurchaseOrder>{
    constructor(public override injector: Injector) { super(injector, 'inventoryTransaction', new PurchaseOrderSerializer()); }
}

@Injectable({ providedIn: 'root'})
export class SaleOrderService extends OrgResourceService<SaleOrder>{
    constructor(public override injector: Injector) { super(injector, 'inventoryTransaction', new SaleOrderSerializer()); }
}
