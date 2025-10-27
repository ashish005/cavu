import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {GlobalModule} from "@app-global";
import {EXPENSE_VIEWS, ExpenseRoute} from "./expense.routing";
import {EXPENSE_COMPONENTS, EXPENSE_ENTRY_COMPONENTS} from "./components";
import {ExpenseAPIResolver} from "./services/api.resolver";
import {ExpenseAccountGroupService, ExpenseAccountService, ExpenseVoucherService} from "./services/expense.service";

@NgModule({
    imports: [
        CommonModule,
        ExpenseRoute,
        GlobalModule
    ],
    providers: [
        ExpenseAPIResolver,
        ExpenseVoucherService, ExpenseAccountService, ExpenseAccountGroupService
    ],
    declarations: [EXPENSE_COMPONENTS, EXPENSE_VIEWS, EXPENSE_ENTRY_COMPONENTS]
})

export class ExpenseModule{}
