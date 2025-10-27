import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {GlobalModule} from "@app-global";
import {VENDOR_Routes, VENDOR_VIEWS} from "./vendor-portal.routing";
import {ProductService} from "./services/product.service";
import {ExecutiveService} from "./services/executive.service";
import {GRID_COLUMN_CELL_COMPONENTS} from "./grid-cells";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(VENDOR_Routes),
    GlobalModule
  ],
  providers: [ProductService, ExecutiveService],
  declarations: [VENDOR_VIEWS, GRID_COLUMN_CELL_COMPONENTS]
})

export class VendorPortal{
  constructor(){}
}
