import {Routes} from "@angular/router";
import {PaymentGatewayLayout, PaymentSystemLayout} from "./layout/layout";
import {PaymentGatewayView} from "./views/payment-gateway.view";
import {PaymentSetupLookupAPIResolver} from "./services/api.resolver";
import {PaymentModeView} from "./views/payment-mode.view";

const getTranslationString = (key)=> `master_type.modules.${key}`;
export const PaymentGatewayRoutes: Routes = [
    {
      path: '', component: PaymentGatewayLayout, resolve: { items: PaymentSetupLookupAPIResolver },
      children:[
          {
              path: ':systemCode', component: PaymentSystemLayout,
              data: { title: getTranslationString('transaction.cash.title'), header: getTranslationString('transaction.cash.header') },
              children: [
                  { path: '', pathMatch: 'full', redirectTo: 'mode' },
                  { path: 'system', data: { title: getTranslationString('transaction.cash.title'), header: getTranslationString('transaction.cash.header')}, component: PaymentGatewayView },
                  { path: 'mode', data: { key: 'all', title: getTranslationString('transaction.cash.title'), header: getTranslationString('transaction.all.header')}, component: PaymentModeView }
              ]
          }
      ]
    }
];

export const PAYMENT_GATEWAY_VIEWS = [
    PaymentGatewayLayout, PaymentSystemLayout, PaymentGatewayView, PaymentModeView
];
