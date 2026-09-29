import {PaymentSetupLookupAPIResolver} from "./api.resolver";
import {PaymentGatewayService, PaymentModeGatewayMapperService} from "./payment-gateway.service";
import {PaymentGatewayChargeService} from "./payment-gateway-charges.service";
import {PaymentModeService} from "./payment-mode.service";
import {PaymentProviderService} from "./payment-provider.service";
import {PaymentRailService} from "./payment-rail.service";

export const PAYMENT_GATEWAY_SERVICES = [
    PaymentSetupLookupAPIResolver,
    PaymentGatewayService, PaymentModeGatewayMapperService, PaymentGatewayChargeService,
    PaymentModeService, PaymentProviderService, PaymentRailService
];


