import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {BankService} from "./services/bank.service";
import {BANK_VIEWS, BankRoutes} from "./bank.routing";
import {GlobalModule} from "@app-global";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule,
        RouterModule.forChild(BankRoutes),
        GlobalModule
    ],
    providers: [BankService],
    declarations: [BANK_VIEWS]
})

export class BankModule {}
