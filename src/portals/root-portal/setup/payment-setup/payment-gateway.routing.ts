import {Routes} from "@angular/router";
import {PaymentGatewayLayout, PaymentLayout, PaymentSystemLayout} from "./layout/layout";
import {PaymentGatewayView} from "./views/payment-gateway.view";
import {PaymentSetupLookupAPIResolver} from "./services/api.resolver";
import {PaymentModeView} from "./views/payment-mode.view";
import {PaymentProviderView} from "./views/payment-provider.view";
import {PaymentRailView} from "./views/payment-rail.view";

const getTranslationString = (key)=> `master_type.modules.${key}`;
export const PaymentGatewayRoutes: Routes = [
    {
      path: '', component: PaymentLayout, resolve: { items: PaymentSetupLookupAPIResolver },
      children:[
          { path: '', pathMatch: 'full', redirectTo: 'providers' },
          {
              path: 'systemType', component: PaymentGatewayLayout,
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
          },
          { path: 'providers', component: PaymentProviderView },
          {
              path: 'rails', component: PaymentRailView
          },
      ]
    }
];

export const PAYMENT_GATEWAY_VIEWS = [
    PaymentLayout, PaymentGatewayLayout,
    PaymentSystemLayout,
    PaymentGatewayView, PaymentModeView, PaymentProviderView, PaymentRailView
];
