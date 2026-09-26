import  { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {PaymentSystemType, PaymentSystemTypeSerializer} from "../domains/payment-type.serializer";

@Injectable()
export class PaymentSystemTypeService extends OrgResourceService<PaymentSystemType>{
    constructor(public override injector: Injector) { super(injector, 'paymentSystemType', new PaymentSystemTypeSerializer()); }
}
