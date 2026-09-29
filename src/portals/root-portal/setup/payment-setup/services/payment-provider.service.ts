import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {PaymentProvider} from "../domains/lookup.serializer";
import {PaymentProviderSerializer} from "../domains/payment-provider.serializer";

@Injectable()
export class PaymentProviderService extends OrgResourceService<PaymentProvider>{
    constructor(public override injector: Injector) {
        super(injector, 'v1/global/paymentProvider', new PaymentProviderSerializer());
    }
}
