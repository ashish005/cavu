import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {TAX_MANAGEMENT_VIEWS, TaxManagementRoutes} from "./tax-management.routing";
import {TAX_MANAGEMMENT_COMPONENTS} from "./components";
import {TAX_MANAGEMENT_SERVICES} from "./services";
import {TAX_MANAGEMENT_CELL_COMPONENT} from "./grid-cells";
import {TaxRateListComponent} from "./views/tax-rate-list.view";
import {GlobalModule} from "@app-global";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(TaxManagementRoutes),
        GlobalModule
    ],
    declarations: [TAX_MANAGEMENT_VIEWS, TAX_MANAGEMMENT_COMPONENTS, TAX_MANAGEMENT_CELL_COMPONENT, TaxRateListComponent],
    providers: [TAX_MANAGEMENT_SERVICES]
})

export class TaxManagementModule{
}
