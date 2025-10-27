import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {ProductTransaction, ProductTransactionSerializer} from "../domains/transaction.serializer";

@Injectable({ providedIn: 'root'})
export class ProductTransactionService extends OrgResourceService<ProductTransaction>{
    constructor(public override injector: Injector) {
      super(injector, 'inventoryTransaction', new ProductTransactionSerializer());
    }
}
