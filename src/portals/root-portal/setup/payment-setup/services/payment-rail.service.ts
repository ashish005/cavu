import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {PaymentRail} from "../domains/lookup.serializer";
import {PaymentRailSerializer} from "../domains/payment-rail.serializer";

@Injectable()
export class PaymentRailService extends OrgResourceService<PaymentRail>{
    constructor(public override injector: Injector) {
        super(injector, 'v1/global/paymentRail', new PaymentRailSerializer());
    }
}
