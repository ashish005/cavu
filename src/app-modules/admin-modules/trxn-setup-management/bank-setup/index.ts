import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {BankingRoutes} from "./banking.routing";
import {BankSetupLayout} from "./layout/layout";
import {GlobalModule} from "@app-global";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(BankingRoutes),
        GlobalModule
    ],
    declarations: [BankSetupLayout]
})
export class BankingModule {}
