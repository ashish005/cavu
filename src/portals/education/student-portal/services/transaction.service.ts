import { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {OnlineTransaction, OnlineTransactionSerializer} from "../domains/online-transaction.serializer";

@Injectable()
export class TransactionService extends OrgResourceService<OnlineTransaction> {
    constructor(public override injector: Injector) {
        super(injector, 'student/transaction', new OnlineTransactionSerializer());
    }
}