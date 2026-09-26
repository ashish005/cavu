import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {ServiceCharge, ServiceChargeSerializer} from "../domains/gateway-service-charge.serializer";

@Injectable()
export class PaymentGatewayChargeService extends OrgResourceService<ServiceCharge>{
    constructor(public override injector: Injector) {
        super(injector, 'paymentGateway/ServiceCharge', new ServiceChargeSerializer());
    }
}

