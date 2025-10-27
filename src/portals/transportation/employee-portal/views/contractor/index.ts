import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {ContractorAPIResolver} from "./services/api.resolver";
import {RouterModule} from "@angular/router";
import {ContractorManageView} from "./views/manage.view";
import {ContractorPaymentManageView} from "./views/payment-manage.view";
import {ContractorPaymentService, ContractorService} from "./services/contractor.service";
import {GlobalModule} from "@app-global";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '', data: {title: 'Contractor', header:'Contractor Management'},
                component: ContractorManageView
            },
            {
                path: 'payment', data: {title: 'Contractor Payment', header:'Contractor Payment Management'},
                component: ContractorPaymentManageView
            }
        ]),
        GlobalModule
    ],
    providers: [
        ContractorAPIResolver, ContractorService, ContractorPaymentService
    ],
    declarations: [ContractorManageView, ContractorPaymentManageView]
})
export class ContractorModule {}
