import {Routes} from "@angular/router";
import {PaymentGatewayLayout} from "./layout/layout";
import {PaymentGatewayView} from "./views/payment-gateway.view";
import {PaymentGatewayLookupAPIResolver} from "./services/api.resolver";
import {PaymentGatewayByModeView} from "./views/payment-gateway-by-mode.view";

const getTranslationString = (key)=> `master_type.modules.${key}`;
export const PaymentGatewayRoutes: Routes = [
    {
      path: '', resolve: { items: PaymentGatewayLookupAPIResolver },
      children:[
          { path: '', pathMatch: 'full', redirectTo:'list/all' },
          {
              path: 'list', component: PaymentGatewayLayout,
              children:[
                  { path: '', pathMatch: 'full', redirectTo:'all' },
                  { path: 'all', data: { key: 'all', title: getTranslationString('transaction.cash.title'), header: getTranslationString('transaction.all.header')}, component: PaymentGatewayView },
                  { path: 'cash', data: { key: 'cash', title: getTranslationString('transaction.cash.title'), header: getTranslationString('transaction.cash.header')}, component: PaymentGatewayView },
                  { path: 'bank', data: { key: 'bank', title: getTranslationString('transaction.bank.title'), header: getTranslationString('transaction.bank.header')}, component: PaymentGatewayView },
                  { path: 'api', data: { key: 'api', title: getTranslationString('transaction.api.title'), header: getTranslationString('transaction.api.header')}, component: PaymentGatewayView },
                  { path: 'digital', data: {key: 'digital', title: getTranslationString('transaction.digital.title'), header: getTranslationString('transaction.digital.header')}, component: PaymentGatewayView },
                  { path: 'pos', data: { key: 'pos', title: getTranslationString('transaction.pos.title'), header: getTranslationString('transaction.pos.header')}, component: PaymentGatewayView },
                  { path: 'voucher', data: { key: 'voucher', title: getTranslationString('transaction.voucher.title'), header: getTranslationString('transaction.voucher.header')}, component: PaymentGatewayView },
                  { path: 'wallet', data: { key: 'wallet', title: getTranslationString('transaction.voucher.title'), header: getTranslationString('transaction.voucher.header')}, component: PaymentGatewayView },
              ]
          },
          {
              path: 'mode', component: PaymentGatewayLayout,
              children:[
                  { path: '', pathMatch: 'full', redirectTo:'all' },
                  { path: 'all', data: { key: 'all', title: getTranslationString('transaction.cash.title'), header: getTranslationString('transaction.all.header')}, component: PaymentGatewayByModeView },
                  { path: 'cash', data: { key: 'cash', title: getTranslationString('transaction.cash.title'), header: getTranslationString('transaction.cash.header')}, component: PaymentGatewayByModeView },
                  { path: 'bank', data: { key: 'bank', title: getTranslationString('transaction.bank.title'), header: getTranslationString('transaction.bank.header')}, component: PaymentGatewayByModeView },
                  { path: 'api', data: { key: 'api', title: getTranslationString('transaction.api.title'), header: getTranslationString('transaction.api.header')}, component: PaymentGatewayByModeView },
                  { path: 'digital', data: { key: 'digital', title: getTranslationString('transaction.digital.title'), header: getTranslationString('transaction.digital.header')}, component: PaymentGatewayByModeView },
                  { path: 'pos', data: { key: 'pos', title: getTranslationString('transaction.pos.title'), header: getTranslationString('transaction.pos.header')}, component: PaymentGatewayByModeView },
                  { path: 'voucher', data: { key: 'voucher', title: getTranslationString('transaction.voucher.title'), header: getTranslationString('transaction.voucher.header')}, component: PaymentGatewayByModeView },
                  { path: 'wallet', data: { key: 'wallet', title: getTranslationString('transaction.voucher.title'), header: getTranslationString('transaction.voucher.header')}, component: PaymentGatewayByModeView }
              ]
          }
      ]
    }
];

export const PAYMENT_GATEWAY_VIEWS = [
    PaymentGatewayLayout, PaymentGatewayView, PaymentGatewayByModeView
];
