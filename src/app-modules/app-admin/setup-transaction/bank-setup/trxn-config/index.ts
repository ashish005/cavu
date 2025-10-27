import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {PaymentCardTypeService} from "./services/card-type.service";
import {TRXN_CONFIG_VIEWS, TrxnConfigRoutes} from "./trxn-config.routing";
import {PaymentSystemTypeService} from "./services/payment-type.service";
import {TRXN_CONFIG_ENTRY_COMPONENT} from "./grid-cell";
import {GlobalModule} from "@app-global";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(TrxnConfigRoutes),
        GlobalModule
    ],
    providers: [PaymentCardTypeService, PaymentSystemTypeService],
    declarations: [TRXN_CONFIG_VIEWS, TRXN_CONFIG_ENTRY_COMPONENT]
})

export class TrxnConfigModule {}
