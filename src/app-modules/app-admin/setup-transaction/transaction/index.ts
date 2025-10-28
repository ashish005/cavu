import {NgModule} from "@angular/core";
import {CommonModule, JsonPipe} from "@angular/common";
import {RouterModule} from "@angular/router";
import {BankingAPIResolver} from "./services/api.resolver";
import {BANKING_COMPONENT, BANKING_ENTRY_COMPONENT} from "./components";
import {BankAccountService} from "./services/bank-account.service";
import {TrxnTypeAllocationService} from "./services/trxn-type-allocation.service";
import {BankTrxnService} from "./services/bank-trxn.service";
import {BANK_TRANSACTION_VIEWS, BankTransactionRoutes} from "./bank-transaction.routing";
import {GlobalModule} from "@app-global";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule,
        RouterModule.forChild(BankTransactionRoutes),
        GlobalModule
    ],
    providers: [ JsonPipe, BankingAPIResolver, BankAccountService, TrxnTypeAllocationService, BankTrxnService ],
    declarations: [BANK_TRANSACTION_VIEWS, BANKING_COMPONENT, BANKING_ENTRY_COMPONENT]
})
export class BankTransactionModule {}
