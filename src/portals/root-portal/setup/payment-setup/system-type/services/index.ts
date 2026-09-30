import {PaymentGatewayService, PaymentModeGatewayMapperService} from "./payment-gateway.service";
import {PaymentGatewayChargeService} from "./payment-gateway-charges.service";
import {PaymentModeService} from "./payment-mode.service";

export const PAYMENT_GATEWAY_SERVICES = [
    PaymentGatewayService, PaymentModeGatewayMapperService, PaymentGatewayChargeService,
    PaymentModeService
];


