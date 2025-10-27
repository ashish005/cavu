import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {SetupTransactionRoutes, TransactionSetupLayout} from "./setup-transaction.routing";
import {GlobalModule} from "@app-global";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(SetupTransactionRoutes),
      GlobalModule
    ],
    providers: [],
    declarations: [TransactionSetupLayout]
})
export class SetupTransactionModule{}
