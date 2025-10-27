import  { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {
    PaymentCardType,
    PaymentCardTypeSerializer
} from "../domains/card-type.serializer";

@Injectable()
export class PaymentCardTypeService extends OrgResourceService<PaymentCardType>{
    constructor(public override injector: Injector) { super(injector, 'paymentCardMasterType', new PaymentCardTypeSerializer()); }
}
