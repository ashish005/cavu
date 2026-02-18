import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {PaymentMode, PaymentModeSerializer} from "../domains/payment-mode.serializer";

@Injectable()
export class PaymentModeService extends OrgResourceService<PaymentMode>{
    constructor(public override injector: Injector) {
        super(injector, 'paymentMasterMode', new PaymentModeSerializer());
    }
}
