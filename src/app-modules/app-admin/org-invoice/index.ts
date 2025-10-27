import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {GlobalModule} from "@app-global";
import {RouterModule} from "@angular/router";
import {OrgInvoiceAPIResolver} from "./services/api.resolver";
import {OrgInvoiceService} from "./services/invoice.service";
import {MONEY_COMPONENT, MONEY_ENTRY_COMPONENT, MONEY_POPOVER_COMPONENT} from "./components";
import {ORG_INVOICE_VIEWS, OrgInvoiceRoutes} from "./org-invoice.routing";
import {ReactiveFormsModule} from "@angular/forms";

const MONEY_SERVICES = [ OrgInvoiceAPIResolver, OrgInvoiceService ];

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule,
        RouterModule.forChild(OrgInvoiceRoutes),
        GlobalModule
    ],
    providers: [...MONEY_SERVICES],
    declarations: [ORG_INVOICE_VIEWS, MONEY_COMPONENT, MONEY_ENTRY_COMPONENT, MONEY_POPOVER_COMPONENT]
})

export class ManageMoneyModule{}
