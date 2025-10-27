import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {
    PaymentGateway,
    PaymentGatewaySerializer
} from "../domains/payment-gateway.serializer";
import {tap} from "rxjs";
import { PaymentGatewayByMode, PaymentGatewayByModeSerializer } from "../domains/payment-gateway-by-mode.serializer";

@Injectable()
export class PaymentGatewayService extends OrgResourceService<PaymentGateway>{
    constructor(public override injector: Injector) {
        super(injector, 'paymentGateway', new PaymentGatewaySerializer());
    }

    createPaymentGatewayScheduler(data: any, gatewayId: any) {
        const url: string = this.viewUrl + `/scheduler/${gatewayId}`;
        return this.httpClient.post(url, data, this.requestHeaders)
            .pipe(
                tap(
                    (error) => { this.handleError(error, () => this.createPaymentGatewayScheduler(data, gatewayId)); }
                )
            );
    }
}

@Injectable()
export class PaymentModeGatewayMapperService extends OrgResourceService<PaymentGatewayByMode>{
    constructor(public override injector: Injector) {
        super(injector, 'paymentGateway/Mapper', new PaymentGatewayByModeSerializer());
    }
}
