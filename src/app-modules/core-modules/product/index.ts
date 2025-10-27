import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {ProductRoutes} from "./product.routing";
import {GlobalModule} from "@app-global";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ProductRoutes), GlobalModule
    ],
    providers: [],
    declarations: []
})
export class ProductModule{}
