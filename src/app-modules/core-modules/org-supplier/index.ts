import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {OrgSupplierRoutes} from "./supplier.routing";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(OrgSupplierRoutes)
    ]
})
export class OrgSupplierModule{}