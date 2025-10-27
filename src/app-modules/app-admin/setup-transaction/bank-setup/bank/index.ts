import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {BANK_COMPONENT} from "./components";
import {BankAccountService, BankService} from "./services/bank-account.service";
import {BANK_VIEWS, BankRoutes} from "./bank.routing";
import {GlobalModule} from "@app-global";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(BankRoutes),
        GlobalModule
    ],
    providers: [BankService, BankAccountService],
    declarations: [BANK_VIEWS, BANK_COMPONENT]
})

export class BankModule {}
