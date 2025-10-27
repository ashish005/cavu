export {NG_SELECT_COMPONENTS} from "./ng-select";
import {VoucherPurchasePaymentComponent, VoucherSaleReceiptComponent} from "./voucher/voucher.component";

import {MasterSearchComponent, PaymentComponent, ParticularSearch, MasterTypesSettingComponent } from "./app";
import {StatusCheckComponent} from "./status-check/status-check.component";

export const SHARED_COMPONENTS = [
    StatusCheckComponent,
    //NG_SELECT_COMPONENTS,
    MasterSearchComponent, PaymentComponent, ParticularSearch, MasterTypesSettingComponent
];
