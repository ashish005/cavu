import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {TRXN_CONFIG_VIEWS, TrxnConfigRoutes} from "./trxn-config.routing";
import {TRXN_CONFIG_ENTRY_COMPONENT} from "./grid-cell";
import {GlobalModule} from "@app-global";
import {TRXN_CONFIG_SERVIES} from "./services";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(TrxnConfigRoutes),
        GlobalModule
    ],
    providers: [TRXN_CONFIG_SERVIES],
    declarations: [TRXN_CONFIG_VIEWS, TRXN_CONFIG_ENTRY_COMPONENT]
})

export class TrxnConfigModule {}
