import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {Inventory, InventorySerializer} from "../domains/inventory.serializer";
import {
    InventoryProduct,
    InventoryProductPrice, InventoryProductPriceSerializer,
    InventoryProductSerializer
} from "../domains/inventory-product.serializer";

@Injectable()
export class InventoryService extends OrgResourceService<Inventory>{
    constructor(public override injector: Injector) { super(injector, 'inventoryTransaction', new InventorySerializer()); }
}

@Injectable()
export class InventoryByProductService extends OrgResourceService<InventoryProduct>{
    constructor(public override injector: Injector) { super(injector, 'inventoryProductVariantSummary', new InventoryProductSerializer()); }
}

@Injectable()
export class InventoryByProductPriceService extends OrgResourceService<InventoryProductPrice>{
    constructor(public override injector: Injector) { super(injector, 'inventoryVariantPriceSummary', new InventoryProductPriceSerializer()); }
}
