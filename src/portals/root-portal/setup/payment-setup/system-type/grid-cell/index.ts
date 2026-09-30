import {
    PaymentProviderGatewayAccountCell,
    PaymentGatewayCell,
    PaymentGatewayOptionsCell, PaymentGatewayPOSOptionsCell, PaymentModeCell
} from "./payment-gateway-grid.cell";
import {PaymentModeGatewayCell, PaymentModeServiceChargesCell} from "./payment-gateway-mode-grid.cell";

export const PAYMENT_GATEWAY_ENTRY_COMPONENT = [PaymentGatewayCell, PaymentModeCell, PaymentGatewayOptionsCell,
    PaymentProviderGatewayAccountCell,
    PaymentGatewayPOSOptionsCell,
    PaymentModeServiceChargesCell, PaymentModeGatewayCell
];