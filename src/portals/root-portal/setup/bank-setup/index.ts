import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {BankingRoutes} from "./banking.routing";
import {BankSetupLayout} from "./layout/layout";
import {GlobalModule} from "@app-global";
import {BankService} from "./bank/services/bank-account.service";
import {BankingSetupResolver} from "./bank-setup.service";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(BankingRoutes),
        GlobalModule
    ],
    declarations: [BankSetupLayout],
    providers: [BankService, BankingSetupResolver]
})
export class BankingModule {}
